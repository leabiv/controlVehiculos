import { pool } from '../config/posgresql';
import { Vehicle } from '../models/vehicle.models';

export class ClienteService {

  private vehiculos: Vehicle[] = [];
  private pool: typeof pool;

  constructor() {
    this.pool = pool
  }

  /**
   *Funcion que permite registrar entrada del vehiculo
  * @param idSocio : number id_socio
  * @param dataVehiculo : Object vehiculo
  * @returns : QueryResult
  */
  async registarEntrada(idSocio: number, dataVehiculo: Vehicle, idCliente:number) {

    const queryVehiculo = await this.pool.query("SELECT placa FROM vehiculo as v  where v.placa = $1", [dataVehiculo.placa]);
    const querySocio = await this.pool.query("SELECT id FROM socio where id = $1", [idSocio]);
    const cantVehiculo = await this.pool.query("SELECT count(id_vehiculo) FROM vehiculo where id_parking = $1", [dataVehiculo.id_parking]);
    const caparking = await this.pool.query("SELECT capacidad FROM parqueadero where id_parking = $1", [dataVehiculo.id_parking]);

    if (querySocio.rowCount == 0) {
      throw new Error("No se puede Registrar Ingreso, Socio no encontrado");
    } else if (queryVehiculo.rowCount > 0) {
      throw new Error("No se puede Registrar Ingreso, ya existe la placa");
    } else if (caparking.rows[0].capacidad <= Number(cantVehiculo.rows[0].count)) {
      throw new Error("No se puede Registrar Ingreso, Capacidad Maxima");
    }

    if (dataVehiculo.placa.match(/^[a-zA-Z-]+(\s*[a-zA-Z-]*)*[a-zA-Z-][0-9]+$/) == null) {
      throw new Error("No se admiten las letras ñ");
    }
    const result1 = await this.pool.query(`INSERT INTO vehiculo
                                              (nombre, placa, fechaingreso, id_parking, id_cliente)
                                              VALUES
                                              ($1, $2, (select CURRENT_TIMESTAMP), $3, $4)`,
      [dataVehiculo.nombre, dataVehiculo.placa, dataVehiculo.id_parking, idCliente]);
    return true;
  }

  /**
  * Funcion que permite registrar la salida del vehiculo
  * @param idParking : number id_Parquedero
  * @param dataVehiculo : object Vehiculo enviar placa
  * @returns : QueryResult
  */
  async registrarSalida(idParking: number, dataVehiculo: Vehicle) {
    const querySocio = await this.pool.query("select s.nombre from parqueadero as p join socio as s on p.id_socio = s.id where p.id_parking = $1", [idParking]);
    const queryVehiculo = await this.pool.query("SELECT * FROM vehiculo where id_vehiculo = $1", [dataVehiculo.id_vehiculo]);

    if (querySocio.rowCount == 0) {
      throw new Error("Socio no encontrado");
    } else if (queryVehiculo.rowCount == 0) {
      throw new Error("No se puede Registrar Salida, no existe el vehiculo");
    }
    const guardarSalida = await this.pool.query("INSERT INTO registro (id_parking, fechasalida, id_vehiculo) VALUES ($1,(select CURRENT_TIMESTAMP),$2)", [dataVehiculo.id_parking, dataVehiculo.id_vehiculo]);
    return true;
  }

  /**
  * Funcion que permite listar los vehiculos
  * @returns : QueryResult
  */
  async listadoVehiculo() {
    const query2 = await this.pool.query("SELECT * from vehiculo");
    if (query2.rowCount == 0) {
      throw new Error("No hay vehiculos");
    }
    return query2.rows;
  }

  /**
   *  Funcion que permite listar vehiculos por parqueadero
   * @param idParking
   * @returns : QueryResult
   */
  async listadoUnVehiculo(idParking: number) {
    const resul = await this.pool.query(`select v.nombre, v.placa, v.fechaingreso, s.nombre as socio
                                            from socio as s
                                            join parqueadero as p
                                            on s.id = p.id_socio
                                            join vehiculo as v
                                            on v.id_parking = p.id_parking
                                            where p.id_parking = $1`, [idParking]);
    if (resul.rowCount == 0) {
      throw new Error("No hay ningun vehiculo en el parqueadero por socio")
    }
    return resul.rows;
  }

}
