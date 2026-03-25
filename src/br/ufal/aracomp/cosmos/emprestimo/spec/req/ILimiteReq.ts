import { DTUsuario } from "../dt/DTUsuario";

export interface ILimiteReq {
  estimarLimite(usuario: DTUsuario): number;
}