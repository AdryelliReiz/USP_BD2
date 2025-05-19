CREATE TABLE cliente (
  cpf CHAR(11) PRIMARY KEY,
  email VARCHAR(255),
  telefone BIGINT,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  rua VARCHAR(255),
  n_end SMALLINT,
  complemento VARCHAR(100),
  cep CHAR(8),
  senha VARCHAR(128),
  quantidade_pontos INTEGER
);

CREATE TABLE ingresso (
  id SERIAL PRIMARY KEY,
  tipo SMALLINT,
  valor FLOAT,
  data DATE,
  hora TIME,
  forma_pagamento VARCHAR(50),
  cliente_id CHAR(11),
  FOREIGN KEY (cliente_id) REFERENCES cliente(cpf)
);

CREATE TABLE filme (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255),
  ano SMALLINT,
  diretor VARCHAR(255),
  class_ind SMALLINT,
  idioma VARCHAR(50),
  duracao TIME,
  eh_dub BOOLEAN,
  fim_contrato DATE,
  descricao VARCHAR(255),
  cartaz TEXT
);

CREATE TABLE genero (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE genero_filme (
  genero_id INTEGER,
  filme_id INTEGER,
  FOREIGN KEY (genero_id) REFERENCES genero(id),
  FOREIGN KEY (filme_id) REFERENCES filme(id)
);

CREATE TABLE cinema (
  cnpj CHAR(14) PRIMARY KEY,
  nome VARCHAR(100),
  telefone BIGINT,
  rua VARCHAR(255),
  n_end SMALLINT,
  complemento VARCHAR(100),
  cep CHAR(8)
);

CREATE TABLE sala (
  numero SMALLINT PRIMARY KEY,
  profundidade SMALLINT,
  largura SMALLINT,
  suporta_imax BOOLEAN,
  suporta_3d BOOLEAN,
  qtde_poltronas SMALLINT,
  cinema_id CHAR(14),
  eh_ativo BOOLEAN,
  FOREIGN KEY (cinema_id) REFERENCES cinema(cnpj)
);

CREATE TABLE sessao (
  numero SERIAL PRIMARY KEY,
  leg_ou_dub BOOLEAN,
  eh_3d BOOLEAN,
  data DATE,
  hora TIME,
  sala_id SMALLINT,
  filme_id INTEGER,
  UNIQUE (data, hora, sala_id),
  FOREIGN KEY (sala_id) REFERENCES sala(numero),
  FOREIGN KEY (filme_id) REFERENCES filme(id)
);

CREATE TABLE poltrona (
  numero SMALLINT,
  letra CHAR(1),
  sala_id SMALLINT,
  tipo SMALLINT,
  PRIMARY KEY (numero, letra, sala_id),
  FOREIGN KEY (sala_id) REFERENCES sala(numero)
);

CREATE TABLE funcionario (
  cpf CHAR(11) PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  data_inicio_contratado DATE,
  data_fim_contrato DATE,
  trabalha_em CHAR(14),
  FOREIGN KEY (trabalha_em) REFERENCES cinema(cnpj)
);

CREATE TABLE gerente (
  cpf CHAR(11) PRIMARY KEY,
  email VARCHAR(255),
  senha VARCHAR(128),
  FOREIGN KEY (cpf) REFERENCES funcionario(cpf)
);

CREATE TABLE administrador (
  cpf CHAR(11) PRIMARY KEY,
  email VARCHAR(255),
  senha VARCHAR(128),
  FOREIGN KEY (cpf) REFERENCES funcionario(cpf)
);
