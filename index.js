const mysql = require("mysql");
const inquirer = require("inquirer");
//const cTable = require('console.table');
let titlesRole=["Engineer","Teacher","Doctor"];
const choice=[
  'View All Employees',
  'View All Employees by Department',
  'Add Employee',
  'Add Department',
  'Add Role',
  'Update Employee Role',
  'View All Roles',
  'Exit',
];
// const password = require("./password.json");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db"
});
connection.connect(function (error) {
  if (error) {
    throw error;
  }
  console.log(`connected as id ${connection.threadId}`);
});

function inquire(){
    return inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "select",
        choices:choice,
      }
    ])
}

//view all employees
function viewEmployee(){
    console.log("\nRetrieving Employee from Database...\n");
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id=department.id";
    connection.query(query, function(err, res){
        console.log("\nEmployees Retrieved from Database...\n");
        console.table(res);
    });
    init();

}

//view by department
function viewDepartment(){
  var query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
    });
    init();
    
}

//view all roles
function viewRoles(){
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res){
        if(err) throw err;
        console.table(res);
    });
    init();
    
}

function addEmployee() {
    inquirer.prompt([
        {
            type:"input",
            message:"What is employee's first name?",
            name: "first_name",
            validate: function(response){
              if(response.length<1){
                return console.log("Enter a first name.");
              }
              return true;
            }
        },
        {
            type:"input",
            message:"What is employee's last name?",
            name: "last_name",
            validate: function(response){
              if(response.length<1){
                return console.log("Enter a last name.");
              }
              return true;
            }
        },
        {
            type:"list",
            message:"What is the employee's title?",
            name:"title",
            choices:titlesRole,
            
        },
        {
          type:"input",
          message:"Enter an employee ID",
          name:"employeeid",
          default:'1',
          validate: function(response){
            if(response.length<1){
              return console.log("Enter a valid employee ID");
            }
            return true;
          }
        }

    ]).then(function(response){
        var query = "INSERT INTO employee SET ?";
        connection.query(
            query,
            {
              first_name: response.first_name,
              last_name: response.last_name,
              role_id:response.employeeid,
              manager_id: 0,
            },
            function(err, res) {
              if (err) {throw err};
              // Call updateProduct AFTER the INSERT completes
              //updateEmployee();
              console.table(response);
            }
          );
        
          // logs the actual query being run
          
          init();
    });
    
  }

  

function updateEmployee(){
  let employees = [];
  connection.query("SELECT * FROM employee", function(err, response) {
    // console.log(answer);
    for (let i = 0; i < response.length; i++) {
      let emp =response[i].id + " " + response[i].first_name + " " + response[i].last_name;
      employees.push(emp);
    }
    // console.log(allemp)

    inquirer.prompt([
        {
          type: "list",
          name: "update",
          message: "Select employee to update role",
          choices: employees,
        },
        {
          type: "list",
          message: "Select a new role",
          choices: titlesRole,
          name: "role",
        }
      ])
      .then(function(response) {
        
        console.log("Updating employee", response);
        const ID = {};
        ID.employeeId = parseInt(response.update.split(" ")[0]);
        if (response.role === "Manager") {
          ID.role_id = 1;
        } else if (response.role === "Employee") {
          ID.role_id = 2;
        }else if (response.role === "Trainee") {
          ID.role_id = 3;
        }
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [ID.role_id, ID.employeeId],
          function(err, res) {
            init();
          }
        );
      });
  });
}

function addDepartment(){
  inquirer.prompt([{
    name:"department",
    type:"input",
    message:"Enter the department name to add",
  }]).then(function(response){
    connection.query("INSERT INTO department SET ?",
      [response.department]
    ,
    function(err,res){
      console.log(`You have added a department ${response.department}`);
      init();
    })
  })
}

function addRole(){
  inquirer.prompt([
    {
      name:"addRole",
      type:"input",
      message:"Choose a role to add",
    },{
      name:"salary",
      message:"How much is the salary?",
      type:"number"
    },{
      name:"departmentID",
      type:"number",
      message:"What is the department id?"
    }
  ]).then(function(response){
    connection.query("INSERT INTO role SET ?",
      {title:response.addRole,
      salary:response.salary,
      department_id:response.departmentID}
      
    , 
    function(err,res){
      if(err) throw err;
      titlesRole.push(response.addRole);
      console.log(`The following role ${response.addRole} has been added with a salary of ${response.salary} and a department ID of ${response.departmentID}`);
      init();
    })
  });
}

function exit() {
  connection.end(function(err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
  });
}

const init = function(){
    const resp=inquire();
    resp.then(function(response){
    switch (response.select) {
        case "View All Employees":
          viewEmployee();
          break;
        case "View All Employees by Department":
          viewDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View All Roles":
            viewRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Exit":
            exit();
          break;
      }
    })
  }
  
  init();



