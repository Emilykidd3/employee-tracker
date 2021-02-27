const inquirer = require("inquirer");
const mysql = require("mysql2");
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
    .query("SELECT * FROM roles")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if view all employees is chosen
const viewAllEmployees = function () {
  connection
    .promise()
    .query("SELECT * FROM employees")
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
        console.log(row);
        return {
          name: row.name,
          id: row.id
        };
      });
      console.log(deptList);
      inquirer
        .prompt([
          {
            type: "input",
            name: "roleName",
            message: "Enter a name for your new role",
          },
          {
            type: "input",
            name: "roleSalary",
            message: "Enter a salary for your new role",
          },
          {
            type: "list",
            name: "roleDept",
            message: "Which department is your new role?",
            choices: deptList,
          },
        ])
        .then((res) => {
          connection.promise().query("INSERT INTO roles SET ?"),
            {
              title: res.roleName,
              salary: res.roleSalary,
              department_id: res.roleDept
            }
        })
        // .then(() => startQuestion());
    });
};

// if add an employee is chosen
const addEmployee = function () {
  inquirer.prompt([
    {
      type: "input",
      name: "employeeFirstName",
      message: "Enter the employee's first name",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "Enter the employee's last name",
    },
    // should this be multiple choice??
    {
      type: "list",
      name: "employeeRole",
      message: "Choose a role for the employee",
      choices: "",
    },
    // should this be multiple choice?
    {
      type: "list",
      name: "employeeManager",
      message: "Choose the employee's manager",
      choices: "",
    },
  ]);
};

// if update an employee is chosen
const updateEmployee = function () {
  inquirer.prompt([
    {
      type: "list",
      name: "employeeToUpdate",
      message: "Choose the name of the employee you would like to update:",
      choices: ""
    },
    {
      type: "list",
      name: "newEmployeeRole",
      message: "What role would you like them to have?",
      choices: ""
    }
  ]);
};
