CREATE DATABASE prueba;

CREATE TABLE persona(
  nombre VARCHAR(20),
  email VARCHAR(20),
  password VARCHAR(225),
  rol VARCHAR(20)
);

CREATE TABLE cliente(
  id_cliente SERIAL PRIMARY KEY
)INHERITS(persona);

CREATE TABLE socio(
  id_socio SERIAL PRIMARY KEY
)INHERITS(persona);

CREATE TABLE administrador(
  id_admin SERIAL PRIMARY KEY
)INHERITS(persona);

CREATE TABLE vehiculo(
  id_vehiculo SERIAL PRIMARY KEY,
  nombre VARCHAR(10),
  placa VARCHAR(6),
  fechaingreso Date,
  id_parking INTEGER,
  id_cliente INTEGER
);

CREATE TABLE parqueadero(
  id_parking SERIAL PRIMARY KEY,
  nombre VARCHAR(20),
  id_socio INTEGER,
  capacidad INTEGER
);

CREATE TABLE socio_cliente(
  id_socio INTEGER,
  id_cliente INTEGER
);

CREATE TABLE Registro(
  id_regitro SERIAL PRIMARY KEY,
  id_parking INTEGER,
  fechasalida DATE
);


select * from administradores
select * from socios
select * from clientes
select * from historial
select * from socio_cliente
select * from parqueadero


ALTER TABLE socios
  ADD CONSTRAINT cliente_fk
  FOREIGN KEY(id_ciente)
  REFERENCES vehiculo(id);


ALTER TABLE clientes
  ADD CONSTRAINT vehiculo_fk
  FOREIGN KEY(id_Vehiculo)
  REFERENCES vehiculo(id);

ALTER TABLE parqueadero
  ADD CONSTRAINT vehiculoparking_fk
  FOREIGN KEY(id_vehiculo)
  REFERENCES vehiculo(id);

