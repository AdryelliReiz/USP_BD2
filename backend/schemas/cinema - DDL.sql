BEGIN;

CREATE SCHEMA IF NOT EXISTS public;

SET search_path TO public;

CREATE TABLE "cliente" (
  "email" varchar(255),
  "telefone" bigint,
  "cpf" char(11) PRIMARY KEY,
  "nome" varchar(100),
  "sobrenome" varchar(100),
  "rua" varchar(255),
  "n_end" smallint,
  "complemento" varchar(100),
  "cep" char(8),
  "senha" varchar(128)
);

CREATE TABLE "pontos" (
  "data" date,
  "hora" time,
  "qtde" integer,
  "cliente_id" varchar(11),
  PRIMARY KEY ("data", "hora", "cliente_id")
);

CREATE TABLE "ingresso" (
  "tipo" smallint,
  "id" serial PRIMARY KEY,
  "valor" money,
  "valor_total" money,
  "data" date,
  "hora" time,
  "forma_pagamento" varchar(50),
  "cliente_id" char(11)
);

CREATE TABLE "sessao" (
  "leg_ou_dub" boolean,
  "eh_3d" boolean,
  "data" date,
  "hora" time,
  "numero" serial PRIMARY KEY,
  "sala_id" smallint,
  "filme_id" integer,
  UNIQUE("data", "hora", "sala_id")
);

CREATE TABLE "filme" (
  "id" serial PRIMARY KEY,
  "titulo" varchar(255),
  "ano" smallint,
  "diretor" varchar(255),
  "class_ind" smallint,
  "idioma" varchar(50),
  "duracao" time,
  "eh_dub" boolean,
  "fim_contrato" date,
  "descricao" varchar(255),
);

CREATE TABLE "genero_filme" (
  "genero_id" integer,
  "filme_id" integer
);

CREATE TABLE "genero" (
  "id" serial PRIMARY KEY,
  "nome" varchar(255)
);

CREATE TABLE "poltrona" (
  "numero" smallint,
  "letra" char(1),
  "tipo" smallint,
  "sala_id" smallint,
  PRIMARY KEY ("numero", "letra", "sala_id")
);

CREATE TABLE "sala" (
  "profundidade" smallint,
  "largura" smallint,
  "suporta_imax" boolean,
  "suporta_3d" boolean,
  "qtde_poltronas" smallint,
  "numero" smallint PRIMARY KEY,
  "cinema_id" char(14),
  "eh_ativo" boolean DEFAULT TRUE
);

CREATE TABLE "cinema" (
  "nome" varchar(100),
  "cnpj" char(14) PRIMARY KEY,
  "telefone" bigint,
  "rua" varchar(255),
  "n_end" smallint,
  "complemento" varchar(100),
  "cep" char(8)
);

CREATE TABLE "funcionario" (
  "data_contratado" date,
  "cpf" char(11) PRIMARY KEY,
  "nome" varchar(100),
  "sobrenome" varchar(100),
  "trabalha_em" char(14)
);

CREATE TABLE "gerente" (
  "email" varchar(255),
  "senha" varchar(128),
  "cpf" char(11)
);

CREATE TABLE "administrador" (
  "email" varchar(255),
  "senha" varchar(128),
  "cpf" char(11)
);

CREATE TABLE "fcomum" (
  "cpf" char(11)
);

CREATE TABLE "pertence" (
  "ingresso_id" integer,
  "sessao_n" integer,
  "poltrona_n" smallint,
  "poltrona_l" char(1),
  "sala_id" smallint,
  PRIMARY KEY ("ingresso_id", "sessao_n", "poltrona_n", "poltrona_l", "sala_id")
);

ALTER TABLE "pontos" ADD FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("cpf");

ALTER TABLE "ingresso" ADD FOREIGN KEY ("cliente_id") REFERENCES "cliente" ("cpf");

ALTER TABLE "sessao" ADD FOREIGN KEY ("sala_id") REFERENCES "sala" ("numero");

ALTER TABLE "sessao" ADD FOREIGN KEY ("filme_id") REFERENCES "filme" ("id");

ALTER TABLE "genero_filme" ADD FOREIGN KEY ("genero_id") REFERENCES "genero" ("id");

ALTER TABLE "genero_filme" ADD FOREIGN KEY ("filme_id") REFERENCES "filme" ("id");

ALTER TABLE "poltrona" ADD FOREIGN KEY ("sala_id") REFERENCES "sala" ("numero");

ALTER TABLE "sala" ADD FOREIGN KEY ("cinema_id") REFERENCES "cinema" ("cnpj");

ALTER TABLE "funcionario" ADD FOREIGN KEY ("trabalha_em") REFERENCES "cinema" ("cnpj");

ALTER TABLE "gerente" ADD FOREIGN KEY ("cpf") REFERENCES "funcionario" ("cpf");

ALTER TABLE "administrador" ADD FOREIGN KEY ("cpf") REFERENCES "funcionario" ("cpf");

ALTER TABLE "fcomum" ADD FOREIGN KEY ("cpf") REFERENCES "funcionario" ("cpf");

ALTER TABLE "pertence" ADD FOREIGN KEY ("ingresso_id") REFERENCES "ingresso" ("id");

ALTER TABLE "pertence" ADD FOREIGN KEY ("sessao_n") REFERENCES "sessao" ("numero");

ALTER TABLE "pertence" ADD FOREIGN KEY ("poltrona_n", "poltrona_l", "sala_id") REFERENCES "poltrona" ("numero", "letra", "sala_id");

COMMIT;
