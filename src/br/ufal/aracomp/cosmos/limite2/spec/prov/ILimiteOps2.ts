import { DTCliente2 } from "../dt/DTCliente2";

export interface ILimiteOps2 {
  calcularLimite(client: DTCliente2): number;
}
