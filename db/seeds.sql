USE employeeTracker;

INSERT INTO department(name)
VALUES
    ('Operations'),
    ('Sales & Marketing'),
    ('IT'),
    ('Finance & Accouting');


INSERT INTO role (title, salary, department_id)
VALUES
  ('Front-End Developer', 120000, 1),
  ('Human Resources Associate', 103000, 1),
  ('Salesperson', 90000, 3),
  ('Financial Analyst', 150000, 2),
  ('Marketing manager', 85000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Noel', 'Hammer', 2, NULL),
('Luke', 'Thomas', 5, NULL),
('Ameer', 'Jeffery', 1, 2),
('Joel', 'Yusuf', 2, 1),
('Teresa', 'Walkin', 4, NULL),
('John', 'Hamilton', 3, 2);

