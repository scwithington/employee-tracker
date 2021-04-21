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
                'Update Employee Manager',
                'Exit'
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
                case 'Exit':
                    process.exit();
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

const addEmployee = () => {
    inquirer
        .prompt ([
        {
            name: 'employeeFirst',
            type: 'input',
            message: 'First Name: '
        },
        {
            name: 'employeeLast',
            type: 'input',
            message: 'Last Name: '
        },
        {
            name: 'employeeRole',
            type: 'list',
            message: 'Pick a job title: ',
            choices: [
                "Salesperson",
                "Sales Lead",
                "Software Engineer",
                "Lead Engineer",
                "Accountant",
                "Finance Lead"
            ]
        }
        ])
        .then (res => {
            for (i = 8; i >= 0  ; i++);
            let firstName = res.employeeFirst
            let lastName = res.employeeLast
            switch(res.employeeRole) {
                case "Salesperson":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 1000, 1, FALSE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
                case "Sales Lead":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 1100, 0, TRUE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
                case "Software Engineer":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 2000, 0, FALSE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
                case "Lead Engineer":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 2200, 0, TRUE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
                case "Accountant":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 3000, 0, FALSE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
                case "Finance Lead":
                    let sqlinfo = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id, is_manager) VALUES (` + i + `, ` + firstName + `, ` + lastName + `, 3300, 0, TRUE)`
                    db.query(sqlinfo, (err) => {
                        throw err;
                    })
            }
        })
}


const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});