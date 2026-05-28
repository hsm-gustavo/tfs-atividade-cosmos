import { ComponentFactoryEmprestimo } from "./br/ufal/aracomp/cosmos/emprestimo/impl/ComponentFactoryEmprestimo";
import { DTUsuario } from "./br/ufal/aracomp/cosmos/emprestimo/spec/dt/DTUsuario";
import { IEmprestimoOps } from "./br/ufal/aracomp/cosmos/emprestimo/spec/prov/IEmprestimoOps";
import { ConectorgRPC } from "./br/ufal/aracomp/cosmos/conector/ConectorgRPC";

function configurarArquitetura(): IEmprestimoOps {
  const componenteEmprestimoMgr = ComponentFactoryEmprestimo.createInstance();

  const emprestimoOps = componenteEmprestimoMgr.getProvidedInterface("IEmprestimoOps") as
    | IEmprestimoOps
    | undefined;

  if (!emprestimoOps) {
    throw new Error("Falha ao obter interface provida do componente.");
  }

  const conector = new ConectorgRPC("localhost:50051");
  componenteEmprestimoMgr.setRequiredInterface("ILimiteReq", conector);

  return emprestimoOps;
}

function main(): void {
  const emprestimoOps = configurarArquitetura();
  const usuario = new DTUsuario("2500");

  try {
    const valor = emprestimoOps.liberarEmprestimoAutomatico(usuario);

    console.log("Emprestimo liberado:", valor);
  } catch (e) {
    console.log(
      "Não é possivel realizar essa ação agora. Por favor, tente mais tarde ou entre em contato com o suporte.",
    );
  }
}

main();
