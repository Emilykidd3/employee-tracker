const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require('console.table');
// require('dotenv').config('')

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  // process.env.SQL_DB_PWD,
  database: "employeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startQuestion();
});

const startQuestion = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      switch (res.start) {
        case "View all departments":
          viewAllDepts();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addDept();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateEmployee();
          break;

        case "Quit":
          console.log("goodbye!");
          connection.end();
          break;

        default:
          break;
      }
    });
};

// if view all depts is chosen
const viewAllDepts = function () {
  connection
    .promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion())
    .catch((err) => console.log(err));
};

// if view all roles is chosen
const viewAllRoles = function () {
  connection
    .promise()
    .query(
      "SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN  departments ON roles.department_id = departments.id"
    )
    //  (select name as department from departments) id, title, salary, department
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if view all employees is chosen
const viewAllEmployees = function () {
  connection
    .promise()
    .query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, roles.salary, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id"
    )
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if add a department is chosen
const addDept = function () {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter a name for your new department",
      },
    ])
    .then((res) =>
      connection.promise().query("INSERT INTO departments SET ?", {
        name: res.addDepartment,
      })
    )
    .then(() => startQuestion());
};

// if add a role is chosen
const addRole = function () {
  connection
    .promise()
    .query("SELECT name, id FROM departments")
    .then((rows) => {
      const deptList = rows[0].map((row) => {
        return {
          name: row.name,
          value: row.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Enter a name for your new role",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter a salary for your new role",
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department is your new role?",
            choices: deptList,
          },
        ])
        .then((newRole) => {
          connection.promise().query("INSERT INTO roles SET ?", newRole);
        })
        .then(() => startQuestion());
    });
};

// if add an employee is chosen
const addEmployee = function () {
  connection
    .promise()
    .query("SELECT title, id FROM roles")
    .then((rows) => {
      const roleList = rows[0].map((row) => {
        return {
          name: row.title,
          value: row.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the employee's first name",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the employee's last name",
          },
          {
            type: "list",
            name: "role_id",
            message: "Choose a role for the employee",
            choices: roleList,
          },
        ])
        .then((res) => {
          var { first_name, last_name, role_id } = res;
          connection
            .promise()
            .query("SELECT first_name, id FROM employees")
            .then((rows) => {
              const empList = rows[0].map((row) => {
                return {
                  name: row.first_name,
                  value: row.id,
                };
              });
              empList.push({ name: "none", value: null })
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager_id",
                    message: "Choose the employee's manager",
                    choices: empList
                  },
                ])
                .then((newEmp) => {
                  var employee = {
                    first_name: first_name,
                    last_name: last_name,
                    role_id: role_id,
                    manager_id: newEmp.manager_id,
                  };
                  connection
                    .promise()
                    .query("INSERT INTO employees SET ?", employee);
                })
                .then(() => startQuestion());
            });
        });
    });
};

// if update an employee is chosen
const updateEmployee = function () {
  connection
    .promise()
    .query("SELECT first_name, id FROM employees")
    .then((rows) => {
      const empList = rows[0].map((row) => {
        return {
          name: row.first_name,
          value: row.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "first_name",
            message:
              "Choose the name of the employee you would like to update:",
            choices: empList,
          },
        ])
        .then((res) => {
          var employeeId = res.first_name;
          connection
            .promise()
            .query("SELECT title, id FROM roles")
            .then((rows) => {
              const roleList = rows[0].map((row) => {
                return {
                  name: row.title,
                  value: row.id,
                };
              });
              inquirer.prompt([
                {
                  type: "list",
                  name: "role_id",
                  message: "What role would you like them to have?",
                  choices: roleList,
                },
              ])
              .then((res) => {
                connection
                  .promise()
                  .query("UPDATE employees SET role_id = ? WHERE id = ?", [
                    1,
                    employeeId,
                  ])
                  .then(() => startQuestion());
              });
            });
        });
    });
};
