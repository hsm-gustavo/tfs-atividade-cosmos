import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { DTCliente } from "../limite/spec/dt/DTCliente";
import { ILimiteOps } from "../limite/spec/prov/ILimiteOps";
import { DTCliente2 } from "../limite2/spec/dt/DTCliente2";
import { ILimiteOps2 } from "../limite2/spec/prov/ILimiteOps2";
import { DTCliente3 } from "../limite3/spec/dt/DTCliente3";
import { ILimiteOps3 } from "../limite3/spec/prov/ILimiteOps3";

class ConfiabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function diferencaPercentual(a: number, b: number) {
  // essa media evita que o calculo seja diferente se invertermos os valores
  return (Math.abs(a - b) / ((a + b) / 2)) * 100;
}

export class ConectorTolerante implements ILimiteReq {
  public constructor(
    private readonly limiteOps: ILimiteOps,
    private readonly limiteOps2: ILimiteOps2,
    private readonly limiteOps3: ILimiteOps3,
  ) {}

  public estimarLimite(usuario: DTUsuario): number {
    const TOLERANCIA = 5; //5%

    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const rendaFormatada = Number.isNaN(renda) ? 0 : renda;
    const cliente = new DTCliente(rendaFormatada);
    const cliente2 = new DTCliente2(rendaFormatada);
    const cliente3 = new DTCliente3(rendaFormatada);

    const valor1 = this.limiteOps.calcularLimite(cliente);
    const valor2 = this.limiteOps2.calcularLimite(cliente2);
    const valor3 = this.limiteOps3.calcularLimite(cliente3);
    console.log(valor1, valor2, valor3);

    const valores = [valor1, valor2, valor3];

    // index dos valores
    // 0 = valor1
    // 1 = valor2
    // 2 = valor3
    const pares = [
      [0, 1],
      [0, 2],
      [1, 2],
    ];

    const validos = new Set<number>();

    for (const [i, j] of pares) {
      const diff = diferencaPercentual(valores[i], valores[j]);

      if (diff <= TOLERANCIA) {
        validos.add(i);
        validos.add(j);
      }
    }

    if (validos.size < 2) {
      // significa q nao temos nenhum ou apenas um valor valido
      // se temos apenas um, não temos como confiar no resultado, então é melhor jogar uma exceção
      throw new ConfiabilityError("Valores não confiáveis");
    }

    const valoresValidos = [...validos].map((i) => valores[i]);

    // da pra usar reduce, mas pra nao ficar obscuro decidi fazer com for
    let soma = 0;
    for (let i = 0; i < valoresValidos.length; i++) {
      soma += valoresValidos[i];
    }

    return soma / valoresValidos.length;
  }
}
