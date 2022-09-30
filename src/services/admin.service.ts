import { pool } from '../config/posgresql';
import { encryptPassword } from '../lib/encryptPassword';
import { User } from '../models/users.models';
import { Member } from "../models/member.models";
import { Client } from "../models/client.models";
import { Vehicle } from "../models/vehicle.models";
import { Parking } from "../models/parking.models";
import { Register } from "../models/register.models";

export class AdminService {

    private socios: Member[] = [];
    private clientes: Client[] = [];
    private vehiculos: Vehicle[] = [];
    private parqueaderos: Parking[] = [];
    private pool: typeof pool;

    constructor() {
        this.socios = [];
        this.clientes = [];
        this.vehiculos = [];
        this.parqueaderos = [];
        //this.generate(); permite generar un administrador cada vez que se reinicie la maquina
        //this.generate();
        this.pool = pool
    }

    /**
      * Funcion que permite listar los usuarios tipo socio
      * @returns
      */
    async allMember() {
        const result = await this.pool.query(`SELECT * FROM socio`);
        return result.rows;
    }


    /**
     * Debe poder crear usuarios con ROL SOCIO Y debe poder crear usuarios con ROL CLIENTE
     * @param data
     * @returns : boolean
     */
    async createUser(data: User) {
        const { rol, email } = data;
        const buscarCorreo = await this.pool.query("SELECT * FROM (SELECT * FROM socio union SELECT * FROM cliente) sociosclientes WHERE email =$1", [email]);
        if (buscarCorreo.rowCount == 0) {
            if (rol == 'socio') {
                const query = "INSERT INTO socio (nombre, email, password, rol) VALUES ($1, $2, $3, $4)";
                const result1 = await this.pool.query(query, [data.nombre, data.email, data.password, data.rol]);
                return true;
            } else {
                const query = "INSERT INTO cliente (nombre, email, password, rol) VALUES ($1, $2, $3, $4)";
                const result = await this.pool.query(query, [data.nombre, data.email, data.password, data.rol]);
                return true;
            }
        }
        throw new Error('Correo ya existe')
    }

    /**
     * Debe poder ASOCIAR client a socios
     * @param idSocio
     * @param dataCliente
     * @returns : boolean
     */
    async asociarCliente(idSocio: number, dataCliente: Client) {
        const result = await this.pool.query("SELECT id FROM socio WHERE id = $1", [idSocio]);
        if (result.rowCount == 0) {
            throw new Error('No se pudo asociar el cliente')
        }
        const result1 = await this.pool.query("INSERT INTO socio_cliente (id_socio, id_cliente) VALUES ($1, $2)", [idSocio, dataCliente.id_cliente]);
        return true;
    }

    /**
    * Funcion que permite listar parqueadero
    * @returns
    */
    async listarParking() {
        const result = await this.pool.query("SELECT * FROM parqueadero");
        return result.rows;
    }

    /**
     * Funcion que permite crear un parqueadero
     * @param dataParking : object Parqueadero
     * @returns : boolean
     */
    async crearParking(dataParking: Parking) {
        const query2 = await this.pool.query("SELECT * FROM parqueadero where nombre = $1", [dataParking.nombre]);
        if (query2.rowCount > 0) {
            throw new Error('No se pudo crear el parqueadero, ya esta creado')
        }
        const result = await this.pool.query("INSERT INTO parqueadero (nombre, capacidad) VALUES ($1, $2)", [dataParking.nombre, dataParking.capacidad]);
        return true;
    }

    /**
     * Funcion que permite actualizar el parqueadero
     * @param idParking : number id_parking
     * @param dataParking : object Parqueadero
     * @returns : boolean
     */
    async ActualizarParking(idParking: number, dataParking: Parking) {
        const queryParking = await this.pool.query("SELECT id_parking FROM parqueadero WHERE id_parking = $1", [idParking]);
        if (queryParking.rowCount == 0) {
            throw new Error('Parqueadero no encontrado, no se puedo actualizar')
        }
        const query = "UPDATE parqueadero SET nombre = $1 WHERE id_parking = $2";
        const result = await this.pool.query(query, [dataParking.nombre, idParking]);
        return true;
    }

    /**
     * Funcion que permite buscar un parqueadero
     * @param idParking : number id_parking number
     * @returns QueryResult
     */
    async findOneParking(idParking: number) {
        const result = await this.pool.query("SELECT * FROM parqueadero WHERE id_parking = $1", [idParking]);
        if (result.rowCount == 0) {
            throw new Error('Parqueadero no encontrado')
        }
        return result.rows;
    }

    /**
   * Funcion que permite eliminar un parqueadero
   * @param idParking : number id_parking
   * @returns : boolean
   */
    async eliminarParking(idParking: number) {
        const queryParking = await this.pool.query("SELECT id FROM parqueadero WHERE id_parking = $1", [idParking]);
        if (queryParking.rowCount == 0) {
            throw new Error('Parqueadero no encontrado')
        }
        const result = await this.pool.query("DELETE FROM parqueadero WHERE id_parking = $1", [idParking]);
        return true;
    }

    /**
   * puede asociar parqueaderos a socios. Siempre y cuando el parqueadero no este asociado a ningún otro socio
   * @param idParking : number
   * @param idSocio : number
   * @returns
   */
    async asociarParking(idSocio: number, idParking: Parking) {
        const query = "UPDATE parqueadero SET id_socio = $1 WHERE id_parking = $2 AND id_socio is null";
        const result = await this.pool.query(query, [idSocio, idParking.id_parking]);
        return true;
    }

    /**
     * Funcion que permite listar vehiculos en el parqueadero
     * @returns : QueryResult
     */
    async listarVehiculos() {
        const query = `SELECT v.nombre, v.placa, v.fechaingreso, p.nombre as parqueadero, s.nombre as socio
                        FROM parqueadero as p
                        JOIN vehiculo as v
                        ON p.id_parking = v.id_parking
                        JOIN socio as s
                        ON s.id = p.id_socio`;
        const result = await this.pool.query(query);
        if (result.rowCount == 0) {
            throw new Error('No hay vehiculos en la lista')
        }
        return result.rows;
    }

    /**
     * Funcion que permite buscar un vehiculo
     * @param placa : string placaVehiculo
     * @returns : QueryResult
     */
    async findOneVehiculos(placa: string) {
        const query = `SELECT v.nombre as carro, v.fechaingreso, p.nombre as parqueadero, s.nombre as socio
                        FROM socio as s
                        JOIN parqueadero as p
                        ON s.id = p.id_socio
                        JOIN vehiculo as v
                        ON p.id_parking = v.id_parking
                        WHERE v.placa = $1`;
        const result = await this.pool.query(query, [placa]);
        if (result.rowCount == 0) {
            throw new Error('Vehiculo no encontrado')
        }
        return result.rows;
    }

    /**
     * Funcion que permite buscar un vehiculos por socio
     * @param idSocio : number id_socio
     * @returns : QueryResult
     */
    async findVehiculosSocio(idSocio: number) {
        const query = `SELECT v.id_vehiculo, v.nombre as carro, v.fechaingreso, s.nombre, s.email
                        FROM socio as s
                        JOIN parqueadero as p
                        ON s.id = p.id_socio
                        JOIN vehiculo as v
                        ON p.id_parking = v.id_parking
                        WHERE p.id_socio = $1`;
        const result = await this.pool.query(query, [idSocio]);
        if (result.rowCount == 0) {
            throw new Error('El socio no tiene vehiculos')
        }
        return result.rows;
    }

    /**
   * Funcion que permite buscar cuantos clientes existen por socio
   * @param idSocio : number id_socio
   * @returns : QueryResult
   */
    async clienExiSocio(idSocio: number) {
        const query = `select count(id_cliente)as cantidad
                    from socio_cliente as sc
                    join socio as s
                    on sc.id_socio = s.id
                    where s.id = $1
                    group by sc.id_socio`;
        const result = await this.pool.query(query, [idSocio]);
        if (result.rowCount == 0) {
            throw new Error('El socio no tiene ningun cliente asociado')
        }
        return result.rows;
    }

    /**
    * Funcion que permite listado del historial de vehículos por un parqueadero
    * @param idParking : number
    * @param hist : Object Historial
    * @returns : QueryResult
    */
    async listHistoriVehiculo(idParking: number, hist: Vehicle) {
        const query = await this.pool.query(`SELECT v.nombre, v.placa, v.fechaingreso, p.nombre as parqueadero
                                          FROM parqueadero as p
                                          JOIN registro as r
                                          ON p.id_parking = r.id_parking
                                          JOIN vehiculo as v
                                          ON v.id_vehiculo = r.id_vehiculo
                                          where r.id_parking = $1  AND v.placa ILIKE '`+ hist.placa +`%' AND v.fechaingreso < $2`,
                                          [idParking, hist.fechaingreso]);
        if (query.rowCount == 0) {
            throw new Error('No hay vehiculos')
        }
        return query.rows;
    }

}
