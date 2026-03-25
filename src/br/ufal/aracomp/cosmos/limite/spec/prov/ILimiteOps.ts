import { DTCliente } from "../dt/DTCliente";

export interface ILimiteOps {
  calcularLimite(client: DTCliente): number;
}
