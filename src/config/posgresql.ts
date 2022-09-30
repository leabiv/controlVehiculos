import { Pool } from "pg";

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'admin123',
  database: 'controlparqueadero',
  port: 5432
})