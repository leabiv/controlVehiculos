import { pool } from '../config/posgresql';
import { User } from "../models/users.models";

export class AuthService {

  private pool: typeof pool;

  constructor() {
    this.pool = pool
  }

  async findOneUserCorreo(correo: string) {
    const query = await this.pool.query(`SELECT *
                                          FROM
                                          (SELECT * FROM socio
                                          union
                                          SELECT * FROM cliente
                                          union
                                          SELECT * FROM administrador)
                                          usuarios WHERE email = $1`, [correo]);
    if (query.rowCount == 0) {
      throw new Error('Invalido Email')
    }
    return query.rows;
  }

  async findOneSocio(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM socio WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id socio')
    }
    return query.rows;
  }

  async findOneCliente(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM cliente WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id cliente')
    }
    return query.rows;
  }

  async findOneAdmin(id: number, rol: string) {
    const query = await this.pool.query("SELECT * FROM administrador WHERE id = $1 AND rol = $2", [id, rol]);
    if (query.rowCount == 0) {
      throw new Error('Invalido id admin')
    }
    return query.rows;
  }

}

