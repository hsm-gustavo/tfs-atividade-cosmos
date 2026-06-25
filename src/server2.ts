import { ComponentFactoryLimite } from "./br/ufal/aracomp/cosmos/limite/impl/ComponentFactoryLimite";
import { ILimiteOps } from "./br/ufal/aracomp/cosmos/limite/spec/prov/ILimiteOps";
import { ComponentFactoryLimite2 } from "./br/ufal/aracomp/cosmos/limite2/impl/ComponentFactoryLimite2";
import { ILimiteOps2 } from "./br/ufal/aracomp/cosmos/limite2/spec/prov/ILimiteOps2";
import { ComponentFactoryLimite3 } from "./br/ufal/aracomp/cosmos/limite3/impl/ComponentFactoryLimite3";
import { ILimiteOps3 } from "./br/ufal/aracomp/cosmos/limite3/spec/prov/ILimiteOps3";
import * as grpc from "@grpc/grpc-js";
import { DTCliente } from "./br/ufal/aracomp/cosmos/limite/spec/dt/DTCliente";
import { DTCliente2 } from "./br/ufal/aracomp/cosmos/limite2/spec/dt/DTCliente2";
import { DTCliente3 } from "./br/ufal/aracomp/cosmos/limite3/spec/dt/DTCliente3";
import { limites } from "./proto/limites";

// proto
// componentes limite
const componenteLimiteMgr = ComponentFactoryLimite.createInstance();
const componenteLimite2Mgr = ComponentFactoryLimite2.createInstance();
const componenteLimite3Mgr = ComponentFactoryLimite3.createInstance();

const limiteOps = componenteLimiteMgr.getProvidedInterface("ILimiteOps") as ILimiteOps | undefined;
const limiteOps2 = componenteLimite2Mgr.getProvidedInterface("ILimiteOps2") as
  | ILimiteOps2
  | undefined;
const limiteOps3 = componenteLimite3Mgr.getProvidedInterface("ILimiteOps3") as
  | ILimiteOps3
  | undefined;

if (!limiteOps || !limiteOps2 || !limiteOps3) {
  throw new Error("Falha ao obter interfaces providas dos componentes.");
}

const limiteOpsOk = limiteOps;
const limiteOps2Ok = limiteOps2;
const limiteOps3Ok = limiteOps3;

class LimiteService extends limites.UnimplementedLimiteServiceService {
  CalcularTodosLimites(
    call: grpc.ServerUnaryCall<limites.LimiteRequest, limites.LimiteResponse>,
    callback: grpc.requestCallback<limites.LimiteResponse>,
  ): void {
    const rendaFormatada = call.request.renda;

    const valor1 = limiteOpsOk.calcularLimite(new DTCliente(rendaFormatada));
    const valor2 = limiteOps2Ok.calcularLimite(new DTCliente2(rendaFormatada));
    const valor3 = limiteOps3Ok.calcularLimite(new DTCliente3(rendaFormatada));

    console.log(`[Servidor gRPC 2] Limites calculados para renda ${rendaFormatada}:`, {
      valor1,
      valor2,
      valor3,
    });

    callback(null, new limites.LimiteResponse({ valor1, valor2, valor3 }));
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(LimiteService.definition, new LimiteService());

  const ADDR = "0.0.0.0:50050";
  server.bindAsync(ADDR, grpc.ServerCredentials.createInsecure(), (err, _) => {
    if (err) {
      console.error("Erro ao iniciar o servidor gRPC 2:", err);
      return;
    }
    console.log(`[Servidor gRPC 2] Servidor 2 rodando em ${ADDR}`);
  });
}

main();
