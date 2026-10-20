-- Script de criação do banco MySQL

CREATE DATABASE IF NOT EXISTS webtech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
 
USE webtech;

-- voltar o banco pro estado limpo se precisar recriar
DROP TABLE IF EXISTS solicitacao_historico;
DROP TABLE IF EXISTS solicitacao;
DROP TABLE IF EXISTS categoria_equipamento;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS funcionario;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS status_solicitacao;
DROP TABLE IF EXISTS perfil;

-- Tabelas do Sistema
CREATE TABLE perfil(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    codigo VARCHAR(20) NOT NULL UNIQUE                   
);

CREATE TABLE status_solicitacao(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    codigo VARCHAR(20) NOT NULL UNIQUE                  
); 

-- Endereços
CREATE TABLE endereco(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL -- UF
);

-- Tabelas de usuarios (clientes e funcionarios)
CREATE TABLE usuario(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash CHAR(64) NOT NULL,
    salt CHAR(32) NOT NULL, -- É um texto aleatório diferente para cada usuário usado na senha
    perfil_id INT UNSIGNED NOT NULL, 
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_perfil FOREIGN KEY (perfil_id) REFERENCES perfil (id) 
);

CREATE TABLE cliente(
    usuario_id INT UNSIGNED NOT NULL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL UNIQUE,         
    telefone VARCHAR(15) NOT NULL,         
    endereco_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_cliente_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuario (id),
    CONSTRAINT fk_cliente_endereco FOREIGN KEY (endereco_id) REFERENCES endereco (id)
); 

CREATE TABLE funcionario(
    usuario_id INT UNSIGNED NOT NULL PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);

-- Equipamentos
CREATE TABLE categoria_equipamento(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    ativo TINYINT(1) NOT NULL DEFAULT 1 
); 

-- Solicitações
CREATE TABLE solicitacao(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    categoria_equipamento_id INT UNSIGNED NOT NULL,
    descricao_equipamento VARCHAR(200) NOT NULL,
    descricao_defeito VARCHAR(1000) NOT NULL,
    status_id INT UNSIGNED NOT NULL, 
    data_hora_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- p/ orçamento 
    valor_orcamento DECIMAL(10,2) NULL,
    orcamento_funcionario_id INT UNSIGNED NULL,
    data_hora_orcamento DATETIME NULL,
    motivo_rejeicao VARCHAR(500) NULL,
    -- p/ manutençao 
    descricao_manutencao VARCHAR(1000) NULL,
    orientacoes_cliente VARCHAR(1000) NULL,
    manutencao_funcionario_id INT UNSIGNED NULL,
    data_hora_manutencao DATETIME NULL,
    funcionario_atual_id INT UNSIGNED NULL, -- caso de redirecionamento
    -- pagamento 
    data_hora_pagamento DATETIME NULL,
    -- finalização
    finalizacao_funcionario_id  INT UNSIGNED NULL,
    data_hora_finalizacao DATETIME NULL,
    
    CONSTRAINT fk_solicitacao_cliente FOREIGN KEY (cliente_id) REFERENCES cliente (usuario_id),
    CONSTRAINT fk_solicitacao_categoria FOREIGN KEY (categoria_equipamento_id) REFERENCES categoria_equipamento (id),
    CONSTRAINT fk_solicitacao_status FOREIGN KEY (status_id) REFERENCES status_solicitacao (id),
    CONSTRAINT fk_solicitacao_orcamento_func FOREIGN KEY (orcamento_funcionario_id) REFERENCES funcionario (usuario_id),
    CONSTRAINT fk_solicitacao_manutencao_func FOREIGN KEY (manutencao_funcionario_id) REFERENCES funcionario (usuario_id),
    CONSTRAINT fk_solicitacao_atual_func FOREIGN KEY (funcionario_atual_id) REFERENCES funcionario (usuario_id),
    CONSTRAINT fk_solicitacao_finalizacao_func FOREIGN KEY (finalizacao_funcionario_id) REFERENCES funcionario (usuario_id),
    CONSTRAINT ck_solicitacao_valor CHECK (valor_orcamento IS NULL OR valor_orcamento > 0),

    -- Indices
    KEY idx_solicitacao_cliente_data (cliente_id, data_hora_abertura),
    KEY idx_solicitacao_status_data (status_id, data_hora_abertura),
    KEY idx_solicitacao_pagamento (data_hora_pagamento)
); 


CREATE TABLE solicitacao_historico (
    id  BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    solicitacao_id INT UNSIGNED NOT NULL,
    status_id INT UNSIGNED NOT NULL, 
    usuario_id INT UNSIGNED NOT NULL,
    usuario_destino_id INT UNSIGNED NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_historico_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES solicitacao (id),
    CONSTRAINT fk_historico_status FOREIGN KEY (status_id) REFERENCES status_solicitacao (id),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT fk_historico_destino FOREIGN KEY (usuario_destino_id) REFERENCES usuario (id),

    KEY idx_historico_solicitacao_data (solicitacao_id, data_hora)
); 

-- Inserts 
INSERT INTO perfil (id, codigo) VALUES (1, 'CLIENTE'), (2, 'FUNCIONARIO');

INSERT INTO status_solicitacao (id, codigo) VALUES 
(1, 'ABERTA'),
(2, 'ORCADA'),
(3, 'REJEITADA'),
(4, 'APROVADA'),
(5, 'REDIRECIONADA'),
(6, 'ARRUMADA'),
(7, 'PAGA'),
(8, 'FINALIZADA');

INSERT INTO categoria_equipamento (id, nome) VALUES
(1, 'Notebook'),
(2, 'Desktop'),
(3, 'Impressora'),
(4, 'Mouse'),
(5, 'Teclado');
