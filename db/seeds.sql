
INSERT INTO department(department_name)
VALUES
    ('Operations'),
    ('Sales & Marketing'),
    ('Human Resources'),
    ('IT'),
    ('Finance & Accouting');

 INSERT INTO role(title, salary, department_id)
 VALUES
 ('Front-End Developer', 120000, 1),
 ('Human Resources Associate', 75000, 3),
('Software Engineer', 130000, 1),
('Financial Analyst', 145000, 4),
('Sales Lead', 850000, 2),
('Project Manager', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Noel', 'Hammer', 2, 5),
('Luke', 'Thomas', 5, NULL),
('Ameer', 'Jeffery', 1, 4),
('Joel', 'Yusuf', 2, 2),
('Teresa', 'Walkin', 4, NULL),
('John', 'Hamilton', 3, 2);

