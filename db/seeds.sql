INSERT INTO departments (name)
VALUES ('Engineering'), ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES ('lead engineer', 100000, 1), ('mark', 75000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('emily', 'kidd', 1, NULL), ('niles', 'lastname', 2, 1);