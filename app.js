// Import Modules
const cTable = require('console.table');
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();
const { prompt } = require('inquirer');
const fs = require('fs');

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// // Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end;
});


// Prompt User for Choices
const promptsMessage = () => {
    console.log("******************* WELCOME ******************");
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View Department Budgets',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Employees') {
                showAllEmployees();
            }

            if (choices === 'View All Departments') {
                showAllDepartments();
            }

            if (choices === 'View All Employees By Department') {
                viewEmployeesByDepartment();
            }

            if (choices === 'Add Employee') {
                addEmployee();
            }

            if (choices === 'Remove Employee') {
                dropEmployee();
            }

            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'Update Employee Manager') {
                employeeSupervisorsUpdate();
            }

            if (choices === 'View All Roles') {
                showAllRoles();
            }

            if (choices === 'Add Role') {
                addRole();
            }

            if (choices === 'Remove Role') {
                dropRole();
            }

            if (choices === 'Add Department') {
                addDepartment();
            }

            if (choices === 'View Department Budgets') {
                viewDepartmentBudget();
            }

            if (choices === 'Remove Department') {
                dropDepartment();
            }

            if (choices === 'Exit') {
                connection.end();
            }
        });
};

// ************************************** VISTA SECTION ***************************************

// DEPARTEMENT 
const showAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        promptsMessage();
    });
};

// ROLES
const showAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((role) => { console.log(role.title); });
        promptsMessage();
    });
};

// EMPLOYEES
const showAllEmployees = () => {
    let sql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.department_name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        promptsMessage();
    });
};

// ************************************** ADD SECTION *****************************************

// DEPARTEMENT
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department would you like to add?',
            validate: validate.validateString
        }
    ])
        .then((answer) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            connection.query(sql, answer.addDept, (error, response) => {
                if (error) throw error;
                console.log(answer.addDept + ` Department successfully added!`);
                showAllDepartments();
            });
        });
};

// ROLES
const addRole = () => {
    const sql = 'SELECT * FROM department'
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let nameOfDept = [];
        response.forEach((department) => { nameOfDept.push(department.department_name); });
        nameOfDept.push('Create Department');
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'nomDeDept',
                    message: 'Please select the department in Which is this new role in:',
                    choices: nameOfDept
                }
            ])
            .then((answer) => {
                if (answer.nomDeDept === 'Create Department') {
                    this.addDepartment();
                } else {
                    roleAddition(answer);
                }
            });

        const roleAddition = (departmentInfo) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What role do you want to add?',
                        validate: validate.validateString
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Please enter the salary of this new role?',
                        validate: validate.validateSalary
                    }
                ])
                .then((answer) => {
                    let newRoleNameAndSalary = answer.role;
                    let departValue;

                    response.forEach((department) => {
                        if (departmentInfo.nomDeDept === department.department_name) { departValue = department.id; }
                    });

                    let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                    let crit = [newRoleNameAndSalary, answer.salary, departValue];

                    connection.promise().query(sql, crit, (error) => {
                        if (error) throw error;
                        console.log(`Role successfully added 🎉!`);
                        showAllRoles();
                    });
                });
        };
    });
};

// EMPLOYEE
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please enter the employee's first name? (Reqiired)",
            validate: prenomAddition => {
                if (prenomAddition) {
                    return true;
                } else {
                    console.log('Please enter a first name in order to processed!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please enter the employee's last name? (Required)",
            validate: nomAddition => {
                if (nomAddition) {
                    return true;
                } else {
                    console.log('Please enter a last name in order to processed!');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const crit = [answer.firstName, answer.lastName]
            const roleSql = `SELECT role.id, role.title FROM role`;
            connection.promise().query(roleSql, (error, data) => {
                if (error) throw error;
                const selectionOfRoles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Please select the employee's role?",
                        choices: selectionOfRoles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const supervisorsSQL = `SELECT * FROM employee`;
                        connection.promise().query(supervisorsSQL, (error, data) => {
                            if (error) throw error;
                            const supervisors = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Please select the employee's manager?",
                                    choices: supervisors
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    crit.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`;
                                    connection.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("Employee has been successfully added 🎉! ")
                                        showAllEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// *************************************** UPDATE EMPLOYEE'S MANAGER SECTION ***********************************

const employeeSupervisorsUpdate = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
                        FROM employee`;
    connection.promise().query(sql, (error, response) => {
        let employeeSupervisorsArray = [];
        response.forEach((employee) => { employeeSupervisorsArray.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer
            .prompt([
                {
                    name: 'employeeSupervisorsRoleChange',
                    type: 'list',
                    message: 'Which employee has a new manager?',
                    choices: employeeSupervisorsArray
                },
                {
                    name: 'newManager',
                    type: 'list',
                    message: 'Who is their manager?',
                    choices: employeeSupervisorsArray
                }
            ])
            .then((answer) => {
                let employeeNumero, managerId;
                response.forEach((employee) => {
                    if (
                        answer.employeeSupervisorsRoleChange === `${employee.first_name} ${employee.last_name}`
                    ) {
                        employeeNumero = employee.id;
                    }

                    if (
                        answer.newManager === `${employee.first_name} ${employee.last_name}`
                    ) {
                        managerId = employee.id;
                    }
                });

                if (validate.isSame(answer.employeeSupervisorsRoleChange, answer.newManager)) {
                    console.log(`The Manager Selection is not valid!!`); 
                    promptsMessage();
                } else {
                    let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

                    connection.query(
                        sql,
                        [managerId, employeeNumero],
                        (error) => {
                            if (error) throw error;
                            console.log(`The Employee Manager is Updated 🎉!`);
                            promptsMessage();
                        }
                    );
                }
            });
    });
};

// *************************************** UPDATE EMPLOYEE'S ROLE SECTION ***********************************

const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                        FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeSupervisorsArray = [];
        response.forEach((employee) => { employeeSupervisorsArray.push(`${employee.first_name} ${employee.last_name}`); });

        let sql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(sql, (error, response) => {
            if (error) throw error;
            let employeeSupervisorsRole = [];
            response.forEach((role) => { employeeSupervisorsRole.push(role.title); });

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeSupervisorsRoleChange',
                        message: 'Please select the employee who has a new role?',
                        choices: employeeSupervisorsArray
                    },
                    {
                        type: 'list',
                        name: 'selectedRole',
                        message: 'Please select the employee with the new role?',
                        choices: employeeSupervisorsRole
                    }
                ])
                .then((answer) => {
                    let VIPTitre, employeeNumero;

                    response.forEach((role) => {
                        if (answer.selectedRole === role.title) {
                            VIPTitre = role.id;
                        }
                    });

                    response.forEach((employee) => {
                        if (
                            answer.employeeSupervisorsRoleChange ===
                            `${employee.first_name} ${employee.last_name}`
                        ) {
                            employeeNumero = employee.id;
                        }
                    });

                    let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                    connection.query(
                        sqls,
                        [VIPTitre, employeeNumero],
                        (error) => {
                            if (error) throw error;
                            console.log(`Employee Role has been successfully Updated  🎉!`);
                            promptsMessage();
                        }
                    );
                });
        });
    });
};


// ****************************** DROP SECTION *******************************

// DEPARTEMENT
const dropDepartment = () => {
    let sql = `SELECT department.id, department.department_name FROM department`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let nomDeDeptsArray = [];
        response.forEach((department) => { nomDeDeptsArray.push(department.department_name); });

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedDepartment',
                    message: 'Please select the department that you would like to remove?',
                    choices: nomDeDeptsArray
                }
            ])
            .then((answer) => {
                let departValue;

                response.forEach((department) => {
                    if (answer.selectedDepartment === department.department_name) {
                        departValue = department.id;
                    }
                });

                let sql = `DELETE FROM department WHERE department.id = ?`;
                connection.promise().query(sql, [departValue], (error) => {
                    if (error) throw error;
                    console.log(`The Department is Successfully Dropped 🎉!`);
                    showAllDepartments();
                });
            });
    });
};

// ROLE
const dropRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;

    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let roleArrays = [];
        response.forEach((role) => { roleArrays.push(role.title); });

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedRole',
                    message: 'Please select the role that you would like to remove?',
                    choices: roleArrays
                }
            ])
            .then((answer) => {
                let roleNumero;

                response.forEach((role) => {
                    if (answer.selectedRole === role.title) {
                        roleNumero = role.id;
                    }
                });

                let sql = `DELETE FROM role WHERE role.id = ?`;
                connection.promise().query(sql, [roleNumero], (error) => {
                    if (error) throw error;
                    console.log(`The Role is Successfully Dropped 🎉!`);
                    showAllRoles();
                });
            });
    });
};

// EMPLOYEE
const dropEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeSupervisorsArray = [];
        response.forEach((employee) => { employeeSupervisorsArray.push(`${employee.first_name} ${employee.last_name}`); });

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeSupervisorsRoleChange',
                    message: 'Please select the employee who you would like to remove?',
                    choices: employeeSupervisorsArray
                }
            ])
            .then((answer) => {
                let employeeNumero;

                response.forEach((employee) => {
                    if (
                        answer.employeeSupervisorsRoleChange ===
                        `${employee.first_name} ${employee.last_name}`
                    ) {
                        employeeNumero = employee.id;
                    }
                });

                let sql = `DELETE FROM employee WHERE employee.id = ?`;
                connection.query(sql, [employeeNumero], (error) => {
                    if (error) throw error;
                    console.log(chalk.redBright(`The Employee is Successfully Dropped 🎉!`));
                    showAllEmployees();
                });
            });
    });
};

