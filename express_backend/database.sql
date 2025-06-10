DROP DATABASE vps_management;
CREATE DATABASE IF NOT EXISTS vps_management;
USE vps_management;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(20),
    credits INT DEFAULT 2000,
    role_id INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Tabla de planes
CREATE TABLE plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    cpu INT NOT NULL,
    ram INT NOT NULL,
    storage INT NOT NULL,
    bandwidth INT DEFAULT 1000,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vps (
    id varchar(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vmid INT NOT NULL,
    client_id INT,
    plan_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Insertar roles por defecto
INSERT INTO roles (role_name) VALUES ('admin'), ('user');

-- Contraseña "pepe"
INSERT INTO clients (name, email, password, company, phone) VALUES
('Juan Pérez', 'juan@example.com', '$2a$12$FkZ9ABpeCKC1esWv5TWPTeapPPbz3Z8wBd/B8RPvHxeazCuPzEeBe', 'Empresa ABC', '+34665666235'),
('Administrador', 'admin@admin.com', '$2a$12$FkZ9ABpeCKC1esWv5TWPTeapPPbz3Z8wBd/B8RPvHxeazCuPzEeBe', 'Empresa ABC', '+34665666235');

INSERT INTO plans (name, cpu, ram, storage, price) VALUES
('Basic', 2, 4, 50, 500),
('Mid-size', 4, 8, 100, 1000),
('Power', 8, 16, 200, 1500);
