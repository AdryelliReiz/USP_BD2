CREATE TABLE cliente (
  cpf CHAR(11) PRIMARY KEY,
  email VARCHAR(255),
  telefone VARCHAR(15),
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  rua VARCHAR(255),
  n_end SMALLINT,
  complemento VARCHAR(100),
  cep CHAR(8),
  senha VARCHAR(128),
  quantidade_pontos INTEGER
);

CREATE INDEX idx_cliente_cpf ON cliente(cpf);
CREATE INDEX idx_cliente_email ON cliente(email);

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
  descricao TEXT,
  cartaz TEXT
);

CREATE TABLE genero (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255)
);

CREATE TABLE genero_filme (
  genero_id INTEGER NOT NULL,
  filme_id INTEGER NOT NULL,
  PRIMARY KEY (genero_id, filme_id),
  FOREIGN KEY (genero_id) REFERENCES genero(id),
  FOREIGN KEY (filme_id) REFERENCES filme(id)
);

CREATE INDEX idx_genero_filme_genero_id ON genero_filme(genero_id);
CREATE INDEX idx_genero_filme_filme_id ON genero_filme(filme_id);

CREATE TABLE cinema (
  cnpj CHAR(14) PRIMARY KEY,
  nome VARCHAR(100),
  telefone VARCHAR(15),
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
  cinema_id CHAR(14) NOT NULL,
  eh_ativo BOOLEAN,
  FOREIGN KEY (cinema_id) REFERENCES cinema(cnpj)
);

CREATE INDEX idx_sala_cinema_id ON sala(cinema_id);

CREATE TABLE sessao (
  numero SERIAL PRIMARY KEY,
  leg_ou_dub BOOLEAN,
  eh_3d BOOLEAN,
  data DATE,
  hora TIME,
  sala_id SMALLINT NOT NULL,
  filme_id INTEGER NOT NULL,
  cancelada BOOLEAN DEFAULT FALSE,
  UNIQUE (data, hora, sala_id),
  FOREIGN KEY (sala_id) REFERENCES sala(numero),
  FOREIGN KEY (filme_id) REFERENCES filme(id)
);

CREATE INDEX idx_sessao_sala_id ON sessao(sala_id);
CREATE INDEX idx_sessao_filme_id ON sessao(filme_id);

CREATE TABLE poltrona (
  numero SMALLINT,
  letra CHAR(1),
  sala_id SMALLINT NOT NULL,
  tipo SMALLINT,
  PRIMARY KEY (numero, letra, sala_id),
  FOREIGN KEY (sala_id) REFERENCES sala(numero)
);

CREATE INDEX idx_poltrona_sala_id ON poltrona(sala_id);

CREATE TABLE ingresso (
  id SERIAL PRIMARY KEY,
  tipo SMALLINT,
  valor NUMERIC(10,2),
  data DATE,
  hora TIME,
  forma_pagamento VARCHAR(50),
  cliente_id CHAR(11),
  sessao_id INTEGER NOT NULL,
  poltrona_numero SMALLINT NOT NULL,
  poltrona_letra CHAR(1) NOT NULL,
  poltrona_sala_id SMALLINT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES cliente(cpf),
  FOREIGN KEY (sessao_id) REFERENCES sessao(numero),
  FOREIGN KEY (poltrona_numero, poltrona_letra, poltrona_sala_id) REFERENCES poltrona(numero, letra, sala_id)
);

CREATE INDEX idx_ingresso_cliente_id ON ingresso(cliente_id);

CREATE TABLE funcionario (
  cpf CHAR(11) PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  data_inicio_contratado DATE,
  data_fim_contrato DATE,
  trabalha_em CHAR(14),
  FOREIGN KEY (trabalha_em) REFERENCES cinema(cnpj)
);

CREATE INDEX idx_funcionario_trabalha_em ON funcionario(trabalha_em);

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
