const connection = require('./connection');

class DB { 
    constructor(connection){
        this.connection = connection;
    }
    
    findAllEmployees(){
        return this.connection.promise().query ("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;");
    };
    createEmployee(employee){
        return this.connection.promise().query (`INSERT INTO employee SET ?;`, employee);
    };
    createRole(role){
        return this.connection.promise().query (`INSERT INTO role SET ?;`, role);
    }
    createDepartment(department){
        return this.connection.promise().query (`INSERT INTO department SET ?;`, department);
    }
    findAllRoles(){
        return this.connection.promise().query ("SELECT * FROM role;");
    }
    findAllDepartments(){
        return this.connection.promise().query ("SELECT * FROM department;");
    }
    findEmployeeByID(id){
        return this.connection.promise().query ("SELECT * FROM employee WHERE id = ?;", id);
    }
    findRoleByID(id){
        return this.connection.promise().query ("SELECT * FROM role WHERE id = ?;", id);
    }
    updateRole(id, role){
        return this.connection.promise().query ("UPDATE role SET ? WHERE id = ?;", [role, id]);
    }
}

module.exports = new DB(connection);