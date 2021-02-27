const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startQuestion();
});

const startQuestion = function () {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "start",
        message: "Choose from the following:",
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
    .then((startQuestionAnswer) => {
      switch (startQuestionAnswer) {
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
            quit();
            break;

        default:
          break;
      }
    });
};

// if view all depts is chosen
const viewAllDepts = function () {
  con
    .promise()
    .query("SELECT * FROM departments")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if view all roles is chosen
const viewAllRoles = function () {
  con
    .promise()
    .query("SELECT * FROM roles")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if view all employees is chosen
const viewAllEmployees = function () {
  con
    .promise()
    .query("SELECT * FROM employees")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .then(() => startQuestion());
};

// if add a department is chosen
const addDept = function () {
  return inquirer.prompt([
    {
      type: "input",
      name: "addDepartment",
      message: "Enter a name for your new department",
    },
  ]);
};

// if add a role is chosen
const addRole = function() {
    return inquirer.prompt([
        {
            type:'input',
            name: 'roleName',
            message: "Enter a name for your new role"
        },
        {
            type:'input',
            name: 'roleSalary',
            message: "Enter a salary for your new role"
        },
        {
            type:'input',
            name: 'roleSalary',
            message: "Enter a salary for your new role"
        },
        // is the dept supposed to be multiple choice?
        {
            type:'input',
            name: 'roleDept',
            message: "Which department is your new rol?",
            choices: ''
        }
    ])
};

// if add an employee is chosen
const addEmployee = function() {
    return inquirer.prompt([
        {
            type:'input',
            name: 'employeeFirstName',
            message: "Enter the employee's first name"
        },
        {
            type:'input',
            name: 'employeeLastName',
            message: "Enter the employee's last name"
        },
        // should this be multiple choice??
        {
            type:'input',
            name: 'employeeRole',
            message: "Choose a role for the employee",
            choices: ''
        },
        // should this be multiple choice?
        {
            type:'input',
            name: 'employeeManager',
            message: "Choose the employee's manager",
            choices: ''
        }
    ])
};

// if update an employee is chosen
const updateEmployee = function() {
    return inquirer.prompt([
        {
            type:'input',
            name: 'employeeToUpdate',
            message: "Choose the name of the employee you would like to update:",
            choices: ''
        },
        {
            type:'input',
            name: 'employeeToUpdate',
            message: "Choose the name of the employee you would like to update:",
            choices: ''
        }
    ])
}