import { User } from "./users.models";

export interface Member extends User{
    id_socio: number,
    id_clients: number
  }
  