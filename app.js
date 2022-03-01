const inquirer = require('inquirer');
const db = require('./db');
require('console.table')


initialize();

function initialize() {
    console.log('Welcome To Our Employee Tracker!');
    selectChoices();
}

function selectChoices() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add a department',
                    'Add a role',
                    'Update an employee role'
                ]
            }
        ])
        .then(function (answer) {
            // console.log(answer);
            switch (answer.option) {
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Update an employee role':
                    updateRole();
                    break;
            }
        });
}

function viewAllEmployees() {
    db.findAllEmployees()
        .then(([rows])=> {
            let employees = rows
            console.log('\n');
            console.table(employees);
        })
        .then(()=> {selectChoices()})
}

function viewDepartments() {
    db.findAllDepartments()
        .then(([rows])=> {
            let departments = rows
            console.log('\n');
            console.table(departments);
        })
        .then(()=> {selectChoices()})
}

function viewRoles() {
    db.findAllRoles()
        .then(([rows])=> {
            let roles = rows
            console.log('\n');
            console.table(roles);
        })
        .then(()=> {selectChoices()})
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `What is the employee's first name?`
            },
            {
                type: 'input',
                name: 'last_name',
                message: `What is the employee's last name?`
            },
            {
                type: 'input',
                name: 'role_id',
                message: `What is the employee's role ID?`
            },
            {
                type: 'input',
                name: 'manager_id',
                message: `What is the manager's ID for this employee?`
            }
        ])
        .then(function (answer) {
            db.createEmployee(answer)
                console.log('\n');
                console.log(`${answer.first_name} ${answer.last_name} was added to the database.`);
        })
        .then(() => {
            console.log('\n');
            selectChoices();
        })
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ])
        .then(function (answer) {
            db.createDepartment(answer)
                .then(([rows])=> {
                    let departments = rows
                    console.log('\n');
                    console.table(departments);
                })
                .then(() => {selectChoices()})
        })
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'How much is the salary?'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'What is the department ID?'
            }])
        .then(function (answer) {
            db.createRole(answer)
            console.log('/n');
            console.log(`You added a new role called: ${answer.title}`)
        })
        .then(() => {selectChoices()})
}

function updateRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_id',
                message: 'What is the ID of the role you would like to update?'
            },
            {
                type: 'input',
                name: 'title',
                message: 'What is the new title of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the new salary of the role?'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'What is the new department ID?'
            }
        ])
        .then(function (answer) {
            db.updateRole(answer)
            console.log('\n');
            console.log(`You updated the role with ID: ${answer.id}`)
        })
        .then(() => {selectChoices()})
}