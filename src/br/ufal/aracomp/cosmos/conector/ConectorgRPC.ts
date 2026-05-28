import * as grpc from "@grpc/grpc-js";
import deasync from "deasync";
import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { limites } from "../../../../../proto/limites";

class ConfiabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfiabilityError";
  }
}
function diferencaPercentual(a: number, b: number) {
  // essa media evita que o calculo seja diferente se invertermos os valores
  return (Math.abs(a - b) / ((a + b) / 2)) * 100;
}

export class ConectorgRPC implements ILimiteReq {
  private client: limites.LimiteServiceClient;

  public constructor(private readonly servidorTarget: string = "localhost:50051") {
    this.client = new limites.LimiteServiceClient(
      this.servidorTarget,
      grpc.credentials.createInsecure(),
    );
  }

  public estimarLimite(usuario: DTUsuario): number {
    const TOLERANCIA = 5; //5%

    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const rendaFormatada = Number.isNaN(renda) ? 0 : renda;

    let rpcResponse: limites.LimiteResponse | undefined;
    let rpcError: grpc.ServiceError | null = null;
    let done = false;

    // chamadas gRPC são assincronas, mas a interface ILimiteReq exige uma resposta sincrona, então usamos deasync para "esperar" a resposta do gRPC
    this.client.CalcularTodosLimites(
      new limites.LimiteRequest({ renda: rendaFormatada }),
      (error, response) => {
        rpcError = error;
        rpcResponse = response;
        done = true;
      },
    );

    deasync.loopWhile(() => !done);

    if (rpcError) {
      console.error("[Cliente gRPC] Erro de rede na chamada RPC:", rpcError);
      throw new ConfiabilityError("Falha de comunicação com o Servidor.");
    }

    if (!rpcResponse) {
      throw new ConfiabilityError("Resposta inválida do servidor gRPC.");
    }

    const { valor1, valor2, valor3 } = rpcResponse;
    console.log("[Cliente gRPC - Conector] Valores recebidos via gRPC:", valor1, valor2, valor3);

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
