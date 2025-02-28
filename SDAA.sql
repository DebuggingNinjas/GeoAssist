DROP DATABASE IF EXISTS SDAA;
CREATE DATABASE SDAA;
USE SDAA;

CREATE TABLE employees (
name VARCHAR(16),
id INT,
description VARCHAR(255)
);

INSERT INTO employees (name, id, description)
VALUES
	("Alex", 13345, "I have black hair"),
	("Jason", 42345, "I like wearing hats"),
	("Homer", 23775, "I work at a power plant");