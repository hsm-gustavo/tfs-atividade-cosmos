import { DTUsuario } from "../dt/DTUsuario";

export interface IEmprestimoOps {
  liberarEmprestimoAutomatico(client: DTUsuario): number;
}