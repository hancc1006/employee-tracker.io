-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employee_db;
-- Created the DB "seinfeld_db" (only works on local connections)
CREATE DATABASE employee_db;
-- Use the DB seinfeld_db for all the rest of the script
USE employee_db;
-- Created the table "actors"
CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(30,2) NOT NULL,
  department_id INT(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(30) NOT NULL,
  manager_id INT(30) NULL,
  PRIMARY KEY(id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
-- Inserted a set of records into the table
###INSERT INTO actors (name, coolness, attitude)
###VALUES ("Mike", 32, "Stubborn"), ("Jeremy", 67, "Happy"), ("Mike", 82, "Sad"), ("Sarah", 99, "Hyper");