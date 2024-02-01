REQUESITOS: vscode, mysql workbench e nodejs
DEPENDENCIAS: (npm install) + (npm install express body-parser mysql2 cors bcryptjs date-fns)
ALTERAÇÃO: altere na linha 31 do arquivo para a senha do seu root

Para testar nosso projeto, crie um banco de dados no mysql workbench com o seguinte comando:

CREATE DATABASE IF NOT EXISTS project_management;

USE project_management;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    description TEXT,
    paymentDate DATE,
    status VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
