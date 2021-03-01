INSERT INTO departments (name)
VALUES ('DEPT1'), ('DEPT2');

INSERT INTO roles (title, salary, department_id)
VALUES ('JOB1', 100000, 1), ('JOB2', 75000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('EMP1', 'LAST', 1, null), ('EMP2', 'LAST', 2, null);