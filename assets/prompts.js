const inquirer = require('inquirer');

const startApp = [
    {
        type:'input',
        name: 'start',
        message: "Choose from the following:",
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }
]
// take choice to run function or more questions

const addDepts = [
    {
        type:'input',
        name: 'addDepartment',
        message: "Enter a name for your new department"
    }
]

const addRole = [
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
]
// add input to table, and return to start question??

const addEmployee = [
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
]
// add employee to database

const updateRole = [
    // how do you dynamically create 
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
]

module.exports = {startApp, }