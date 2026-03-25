import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { DTCliente } from "../limite/spec/dt/DTCliente";
import { ILimiteOps } from "../limite/spec/prov/ILimiteOps";

export class EmprestimoLimiteConnector implements ILimiteReq {
  public constructor(private readonly limiteOps: ILimiteOps) {}

  public estimarLimite(usuario: DTUsuario): number {
    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const cliente = new DTCliente(Number.isNaN(renda) ? 0 : renda);
    return this.limiteOps.calcularLimite(cliente);
  }
}
