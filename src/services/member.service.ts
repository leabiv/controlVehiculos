import { pool } from '../config/posgresql';
import { encryptPassword } from '../lib/encryptPassword';
import { Member } from "../models/member.models";
import { Client } from "../models/client.models";
import { Register } from "../models/register.models";
import { Fecha } from "../models/fecha.models"

export class MemberService {

  private registro: Register[];
  private socios: Client[] = [];
  private clientes: Member[] = [];
  private pool: typeof pool;

  constructor() {
    this.socios = [];
    this.clientes = [];
    this.registro = [];
    this.pool = pool
    //this.generate();
  }

  async generate() {
    const hash = await encryptPassword('admin');
    const result1 = await this.pool.query(`INSERT INTO administrador
                                            (nombre, email, password, rol)
                                            VALUES ('adminparking','admin@gmail.com',$1,'admin')`,
      [hash]);
  }

  /**
   *Funcion que permite crear un usuario TIPO ROL CLIENTE
  * @param dataCliente :Objeto Cliente
  * @returns : QueryResult
  */
  async crearCliente(dataCliente: Client) {
    const queryCliente = await this.pool.query("SELECT id FROM cliente where email = $1", [dataCliente.email])
    if (queryCliente.rowCount == 0 && dataCliente.rol == "cliente") {
      const result = await this.pool.query(`INSERT INTO cliente
                                            (nombre, email, password, rol)
                                            VALUES ($1, $2, $3, $4)`,
        [dataCliente.nombre, dataCliente.email, dataCliente.password, dataCliente.rol]);
      return true;
    } else {
      throw new Error('El cliente ya esta registrado')
    }
  }

  /**
    * Funcion que permite asociar un cliente a el mismo
    * @param idSocio : NUMBER, id socio
    * @param dataCliente : Object Cliente
    * @returns
    */
  async asociarClientes(idSocio: number, dataCliente: Client) {
    const queryCliente = await this.pool.query("SELECT id FROM cliente where id = $1", [dataCliente.id_cliente]);
    if (queryCliente.rowCount == 0) {
      throw new Error('El cliente no esta registrado')
    }
    const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id_cliente])
    return true;
  }

  /**
  * Funcion que permite listar Parqueadero por el socio
  * @param idSocio : number id socio
  * @returns :QueryResult listado de parqueadero
  */
  async listarParqueadero(idSocio: number) {
    const result1 = await this.pool.query(`SELECT v.nombre as carro, p.nombre, v.fechaingreso
                                                FROM parqueadero as p
                                                join socio as s
                                                on p.id_socio = s.id
                                                join vehiculo as v
                                                on p.id_parking = v.id_parking
                                                where s.id = $1`, [idSocio]);
    if (result1.rowCount == 0) {
      throw new Error('Error con el listado de parqueadero del socio')
    }
    return result1.rows;
  }

  /**
   * Funcion que permite ver el detalle del vehiculo en su parqueadero
   * @param idSocio : number id socio
   * @param placa : string id vehiculo
   * @returns
   */
  async destalleParqueadero(idSocio: number, placa: string) {
    const result1 = await this.pool.query(`SELECT v.nombre, v.placa, v.fechaingreso
                                            FROM parqueadero as p
                                            join socio as s
                                            on p.id_socio = s.id
                                            join vehiculo as v
                                            on p.id_parking = v.id_parking
                                            where v.placa = $1 and s.id = $2`, [placa, idSocio]);
    if (result1.rowCount == 0) {
      throw new Error('Vehiculo no encontrado')
    }
    return result1.rows;
  }

  /**
   * Funcion que permite consultar cuantos clientes han usado el parqueadero
   * @returns : QueryResult
   */
  async usandoParking() {
    const query = await this.pool.query(`SELECT count(v.id_cliente) as cantidad
                                            FROM vehiculo as v
                                            where v.id_cliente IS NOT NULL`);
    return query.rows;
  }

  /**
   * Funcion que permite consultar cuantos clientes no han usado el parqueadero
   * @returns : QueryResult
   */
  async notUsandoParking() {
    const query = await this.pool.query(`SELECT COUNT(c.id) as cantidad
                                                FROM cliente as c
                                                LEFT join vehiculo as v
                                                on c.id = v.id_cliente
                                                where v.id_cliente is null`);
    return query.rows;
  }

  /**
   * Funcion que permite listar vehiculos por cliente
   * @param idCliente
   * @returns : QueryResult
   */
  async listadoVehiculoCliente(idCliente: number) {
    const result = await this.pool.query(`SELECT v.nombre, v.placa, v.fechaingreso
                                            FROM cliente as c
                                            JOIN vehiculo as v
                                            ON c.id = v.id_cliente
                                            WHERE v.id_cliente = $1`, [idCliente]);
    if (result.rowCount == 0) {
      throw new Error('El cliente no tiene ningun vehiculo')
    }
    return result.rows;
  }

  /**
   * Funcion que permite ver el detalle del vehiculo por cliente
   * @param idCliente
   * @param idplaca
   * @returns : QueryResult
   */
  async listadoVehiculoDetalle(idCliente: number, idplaca: string) {

    const result = await this.pool.query(`SELECT v.nombre, v.placa, v.fechaingreso, v.id_cliente, p.nombre as parking
                                            FROM vehiculo as v
                                            LEFT OUTER JOIN parqueadero as p
                                            ON p.id_parking = v.id_parking
                                            WHERE v.id_cliente = $1 AND v.placa = $2`, [idCliente, idplaca]);
    if (result.rowCount == 0) {
      throw new Error('Cliente o vehiculo no encontrado')
    }
    return result.rows;
  }

  /**
   * funcion  que permite regresar los 10 vehículos que se han registrado en el parqueadero y cuantas veces
   * @param idParking : id_parking number
   * @returns : QueryResult
   */
  async listRegis(idParking: number) {
    const query = (`SELECT v.placa, count(v.placa) as registrado
                        FROM vehiculo as v
                        JOIN parqueadero as p
                        on v.id_parking = p.id_parking
                        WHERE p.id_parking = $1
                        group by v.placa FETCH FIRST 10 ROWS ONLY`);
    const result = await this.pool.query(query, [idParking]);
    return result.rows;
  }

  /**
   *  Funcion que permite obtener el promedio de un parqueadero por rango de fecha
   * @param idParking : number id_Parqueadero
   * @param bodyHisto : string fecha 'YYYY-MM-DD'
   * @returns : QueryResult
   */
  async promedioRangoFecha(idParking: number, bodyHisto: Register) {
    const query = await this.pool.query(`SELECT (COUNT(id_parking)/(SELECT DISTINCT(EXTRACT(DAY FROM age(date($2),date('2022-09-29')))) as dif_dias
                        FROM registro as r
                        JOIN vehiculo as v
                        ON r.id_parking = v.id_parking
                        WHERE r.id_parking = $1)) promedio
                        FROM vehiculo
                        where id_parking = $1`, [idParking, bodyHisto.fecha_salida]);
    return query.rows;
  }

  /**
   *
   * @param fechas
   * @returns
   */
  async promedioTodosParqueaderos(fechas: Fecha) {
    const query = await this.pool.query(`SELECT (COUNT(id_parking)/(SELECT DISTINCT(EXTRACT(DAY FROM age(date($1),date($2)))) as dif_dias
                                          FROM registro as r
                                          JOIN vehiculo as v
                                          ON r.id_parking = v.id_parking)) promedio
                                          FROM vehiculo`,[fechas.fechafinal, fechas.fechainicio]);
    return query.rows;
  }

   //----------------------------------------------------------------------------//
  /**
    * funcion que permite verificar vehiculos no son primera vez
    * @returns : QueryResult
    */
   async verifVehiculosNoPrim() {
    const query = await this.pool.query(`SELECT v.placa, count(v.nombre)
                                              FROM vehiculo as v
                                              join registro as r
                                              on v.id_vehiculo = r.id_vehiculo
                                              where v.id_parking IN (r.id_parking) AND r.fechasalida IS NOT NULL
                                              group by v.placa`);
    return query.rows;
  }

  /**
   * Funcion que permite verificar cuales son nuevos
   * @returns : QueryResult
   */
  async verifiVehiParNuevo() {
    const result = await this.pool.query(`SELECT v.nombre, v.placa
                                              FROM vehiculo as v
                                              join registro as r
                                              on v.id_parking = r.id_parking
                                              where v.id_vehiculo <> r.id_vehiculo
                                              group by v.id_vehiculo`);
    return result.rows;
  }


}
