import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { DTCliente } from "../limite/spec/dt/DTCliente";
import { ILimiteOps } from "../limite/spec/prov/ILimiteOps";
import { DTCliente2 } from "../limite2/spec/dt/DTCliente2";
import { ILimiteOps2 } from "../limite2/spec/prov/ILimiteOps2";

class ConfiabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfiabilityError";
  }
}

export class ConectorDetector implements ILimiteReq {
  public constructor(
    private readonly limiteOps: ILimiteOps,
    private readonly limiteOps2: ILimiteOps2,
  ) {}

  public estimarLimite(usuario: DTUsuario): number {
    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const rendaFormatada = Number.isNaN(renda) ? 0 : renda;
    const cliente = new DTCliente(rendaFormatada);
    const cliente2 = new DTCliente2(rendaFormatada);

    const valor1 = this.limiteOps.calcularLimite(cliente);
    const valor2 = this.limiteOps2.calcularLimite(cliente2);
    console.log(valor1, valor2);

    const diff = Math.abs((valor1 - valor2) / valor2) * 100;

    if (diff <= 5) {
      return (valor1 + valor2) / 2;
    } else {
      throw new ConfiabilityError("Valores não confiáveis");
    }
  }
}
