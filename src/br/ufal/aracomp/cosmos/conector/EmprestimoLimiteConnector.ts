import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { DTCliente } from "../limite/spec/dt/DTCliente";
import { ILimiteOps } from "../limite/spec/prov/ILimiteOps";

export class EmprestimoLimiteConnector implements ILimiteReq {
  public constructor(private readonly limiteOps: ILimiteOps) {}

  public estimarLimite(usuario: DTUsuario): number {
    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const rendaFormatada = Number.isNaN(renda) ? 0 : renda;
    const cliente = new DTCliente(rendaFormatada);

    const valor1 = this.limiteOps.calcularLimite(cliente);

    return valor1;
  }
}
