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
                    viewByManager()
                    
                    break;
                // case 'Add Employee':
                //     function4();
                //     break;
                // case 'Remove Employee':
                //     function5();
                //     break;
                // case 'Update Employee Role':
                //     function6();
                //     break;
                // case 'Update Employee Manager':
                //     function7();
                //     break;
            }
        });
};

const viewEmployees = () => {
    return db
        .query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.last_name;')
}

const viewByDepartment = () => {
    return db
        .query('SELECT department.name, employee.name FROM department JOIN employee ON employee.department_id = department.id ORDER BY department.name;')
}

const viewByManager = () => {
    db.query('SELECT id, first_name, last_name FROM employee WHERE is_manager = TRUE', (err, data) => {
        console.log(data);
        var choices = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
        inquirer
            .prompt ({
                name: 'pickManager',
                type: 'list',
                message: 'which manager?',
                choices: choices
            })
            .then (manager => {
                console.log(manager.pickManager)
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