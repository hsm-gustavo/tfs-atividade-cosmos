import { DTCliente3 } from "../dt/DTCliente3";

export interface ILimiteOps3 {
  calcularLimite(client: DTCliente3): number;
}
