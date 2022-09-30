import { User } from "./users.models";

export interface Client extends User{
    id_cliente: number,
    id_vehicle: number
  }
  