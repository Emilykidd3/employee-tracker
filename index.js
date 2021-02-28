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
// shows dept and id FUNCTION DONE
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
// NEED TO JOIN TO SHOW DEPT?? IS THIS GOOD?!
const viewAllRoles = function () {
  connection
    .promise()
    .query("SELECT id, title, salary, department FROM roles LEFT JOIN (select name as department from departments) departments ON roles.department_id = roles.id")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if view all employees is chosen
// NEED TO JOIN TO SHOW JOB TITLE, DEPT, SALARY, AND MANAGER
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
// FUNCTION DONE
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
// FUNCTION DONE
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
          console.log(newRole);
          connection.promise().query("INSERT INTO roles SET ?", newRole);
        })
        .then(() => startQuestion());
    });
};

// let roleArr = [];
// const listOfRoles = function() {
//   connection
//     .promise()
//     .query('SELECT title FROM roles')
//     .then((rows) => {
//       const roleList = row[0].map((row) => {
//         roleArr.push({
//           value: row.title
//         })
//       })
//     })
// }

// let empArr = [];
// const listOfEmps = function() {
//   connection
//     .promise()
//     .query('SELECT first_name, id FROM employees')
//     .then((rows) => {
//       const empList = row[0].map((row) => {
//         empArr.push({
//           name: row.first_name,
//           value: row.id
//         })
//       })
//     })
// }

// if add an employee is chosen
// NEED TO ADD DYNAMIC CHOICES FOR LAST Q
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
      // .query("SELECT first_name, id FROM employees")
      // .then((rows) => {
      //   const empList = rows[0].map((row) => {
      //     return {
      //       name: row.first_name,
      //       value: row.id
      //     };
      //   });
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
          // {
          //   type: "list",
          //   name: "manager_id",
          //   message: "Choose the employee's manager",
          //   choices: empList
          // }
        ])
        .then((newEmp) => {
          console.log(newEmp);
          connection.promise().query("INSERT INTO employees SET ?", newEmp);
        })
        .then(() => startQuestion());
    });
};
// );
// };

// if update an employee is chosen
// NEED TO ADD DYNAMIC CHOICES FOR SECOND Q
// FIX UPDATE FUNCTION
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
          // {
          //   type: "list",
          //   name: "newEmployeeRole",
          //   message: "What role would you like them to have?",
          //   choices: ""
          // }
        ])
        .then((updateRole) => {
          console.log(updateRole);
          connection
            .promise()
            .query("UPDATE employees SET ? WHERE ?", [
              {
                role_id: 1,
              },
              {
                id: updateRole.id,
              },
            ])
            .then(() => startQuestion());
        });
    });
};
