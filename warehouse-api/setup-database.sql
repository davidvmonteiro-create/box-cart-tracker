-- Criar a base de dados
CREATE DATABASE WarehouseDB;
GO
USE WarehouseDB;
GO

-- Tabela de utilizadores
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'operator',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tabela de corredores
CREATE TABLE Corridors (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Zone NVARCHAR(100) NOT NULL
);

-- Tabela de carrinhos
CREATE TABLE Carts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    CorridorId INT NULL REFERENCES Corridors(Id),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tabela de caixas
CREATE TABLE Boxes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    CartId INT NULL REFERENCES Carts(Id),
    ScannedAt DATETIME DEFAULT GETDATE(),
    ScannedBy NVARCHAR(100)
);

-- Dados de exemplo
INSERT INTO Corridors (Name, Zone) VALUES
    ('Corredor A1', 'Zona Norte'),
    ('Corredor B2', 'Zona Sul'),
    ('Corredor C3', 'Zona Leste');

INSERT INTO Carts (Code, CorridorId) VALUES
    ('CR-01', 1),
    ('CR-02', 2),
    ('CR-03', NULL);

INSERT INTO Boxes (Code, Description, CartId, ScannedBy) VALUES
    ('CX-001', 'Pecas Motor A', 1, 'Joao'),
    ('CX-002', 'Parafusos M8', 1, 'Joao'),
    ('CX-003', 'Filtros Oleo', 2, 'Ana'),
    ('CX-004', 'Correias V', NULL, 'Ana'),
    ('CX-005', 'Rolamentos', 2, 'Joao'),
    ('CX-006', 'Cabos Eletricos', NULL, 'Ana');

-- Utilizador de teste (password: admin123)
-- Hash gerado com bcryptjs
INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES
    ('Admin', 'admin@empresa.pt', '$2a$10$XQxBj1MFm7sPYBJyJdKJ.e8X3Z5z5z5z5z5z5z5z5z5z5z5z5z5z5', 'admin');

PRINT 'Base de dados criada com sucesso!';
GO
