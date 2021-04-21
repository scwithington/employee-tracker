const inquirer = require('inquirer');
const mysql = require('mysql');
const express = require('express');
const { response } = require('express');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'calwith',
    database: 'employee_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
    firstFunction();
});

app.get('/createdb', (req, res) => {
    var sql = 'CREATE DATABASE employee_db'
    db.query(sql, (err) => {
        if (err) throw err;
        res.send('Database created')
    });
});

//Create table in mysql
app.get('/createemployee', (req, res) => {
    let sql = 'CREATE TABLE employee(id INT AUTO_INCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), role_id(****), manager_id(****), PRIMARY KEY(id));'
    db.query(sql, (err) => {
        if (err) throw err;
        res.send('Employee table created')
    });
});

const firstFunction = () => {
    inquirer
        .prompt({
            name: 'promptInit',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager'
            ]
        })
        .then((answer) => {
            switch(answer.promptInit) {
                case 'View All Employees':
                    viewEmployees();
                    console.table(data);
                    break;
                case 'View All Employees By Department':
                    viewByDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewByManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Remove Employee':
                    rmEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Update Employee Manager':
                    updateManager();
                    break;
            }
        });
};

const viewEmployees = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.last_name', (err, data) => {
        console.table(data);
    });
};

const viewByDepartment = () => {
    db.query('SELECT id, name FROM department ORDER BY department.name', (err, data) => {
    // employee.name FROM department JOIN employee ON employee.department_id = department.id ORDER BY department.name
        let choices = data.map(({id, name}) => ({name: name, value: id}));
        // console.log(choices);
        inquirer
            .prompt ({
                name: 'pickDept',
                type: 'list',
                message: 'Which department?',
                choices: choices
            })
            .then (department => {
                // console.log(department.pickDept)
                db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department_id = ' + department.pickDept, + " ORDER BY role.id", (err, data) => {
                    console.table(data);
                })
            })
    })
}

const viewByManager = () => {
    db.query('SELECT id, first_name, last_name FROM employee WHERE is_manager = TRUE', (err, data) => {
        // console.log(data);
        let choices = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
        inquirer
            .prompt ({
                name: 'pickManager',
                type: 'list',
                message: 'Which manager?',
                choices: choices
            })
            .then (manager => {
                // console.log(manager.pickManager)
                db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id = ' + manager.pickManager, (err, data) => {
                    console.table(data)
                })
            })
    })    
}

const PORT = process.env.PORT || 8808;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});