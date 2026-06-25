import * as grpc from "@grpc/grpc-js";
import deasync from "deasync";
import { DTUsuario } from "../emprestimo/spec/dt/DTUsuario";
import { ILimiteReq } from "../emprestimo/spec/req/ILimiteReq";
import { limites } from "../../../../../proto/limites";
import fs from "fs";

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

export class ConectorgRPCCarga implements ILimiteReq {
  private client1: limites.LimiteServiceClient;
  private client2: limites.LimiteServiceClient;
  private client3: limites.LimiteServiceClient;
  /* array de servidores. como o servidor 1 tem peso 2 ele se repete */
  private servidorList: limites.LimiteServiceClient[];

  public constructor(
    private readonly servidor1: string = "localhost:50049",
    private readonly servidor2: string = "localhost:50050",
    private readonly servidor3: string = "localhost:50051",
  ) {
    this.client1 = new limites.LimiteServiceClient(
      this.servidor1,
      grpc.credentials.createInsecure(),
    );
    this.client2 = new limites.LimiteServiceClient(
      this.servidor2,
      grpc.credentials.createInsecure(),
    );
    this.client3 = new limites.LimiteServiceClient(
      this.servidor3,
      grpc.credentials.createInsecure(),
    );

    this.servidorList = [this.client1, this.client1, this.client2, this.client3];
  }

  private obterIndice(): number {
    try {
      return Number(fs.readFileSync("estado.txt", "utf8"));
    } catch {
      return 0;
    }
  }

  private salvarIndice(indice: number) {
    fs.writeFileSync("estado.txt", String(indice));
  }

  private proximoServidor(): limites.LimiteServiceClient {
    const indice = this.obterIndice();
    const proximoIndice = (indice + 1) % this.servidorList.length;
    this.salvarIndice(proximoIndice);
    return this.servidorList[indice];
  }

  public estimarLimite(usuario: DTUsuario): number {
    const TOLERANCIA = 5; //5%

    const renda = Number.parseFloat(usuario.rendimentos().replace(/,/g, "."));
    const rendaFormatada = Number.isNaN(renda) ? 0 : renda;

    let rpcResponse: limites.LimiteResponse | undefined;
    let rpcError: grpc.ServiceError | null = null;
    let done = false;

    // chamadas gRPC são assincronas, mas a interface ILimiteReq exige uma resposta sincrona, então usamos deasync para "esperar" a resposta do gRPC
    this.proximoServidor().CalcularTodosLimites(
      new limites.LimiteRequest({ renda: rendaFormatada }),
      (error, response) => {
        rpcError = error;
        rpcResponse = response;
        done = true;
      },
    );
    /* this.client1.CalcularTodosLimites(
      new limites.LimiteRequest({ renda: rendaFormatada }),
      (error, response) => {
        rpcError = error;
        rpcResponse = response;
        done = true;
      },
    ); */

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
