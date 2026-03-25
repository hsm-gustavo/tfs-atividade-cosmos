import { ComponentFactoryEmprestimo } from "./br/ufal/aracomp/cosmos/emprestimo/impl/ComponentFactoryEmprestimo";
import { DTUsuario } from "./br/ufal/aracomp/cosmos/emprestimo/spec/dt/DTUsuario";
import { IEmprestimoOps } from "./br/ufal/aracomp/cosmos/emprestimo/spec/prov/IEmprestimoOps";
import { EmprestimoLimiteConnector } from "./br/ufal/aracomp/cosmos/conector/EmprestimoLimiteConnector";
import { ComponentFactoryLimite } from "./br/ufal/aracomp/cosmos/limite/impl/ComponentFactoryLimite";
import { ILimiteOps } from "./br/ufal/aracomp/cosmos/limite/spec/prov/ILimiteOps";

function configurarArquitetura(): IEmprestimoOps {
  const componenteLimiteMgr = ComponentFactoryLimite.createInstance();
  const componenteEmprestimoMgr = ComponentFactoryEmprestimo.createInstance();

  const limiteOps = componenteLimiteMgr.getProvidedInterface("ILimiteOps") as
    | ILimiteOps
    | undefined;
  const emprestimoOps = componenteEmprestimoMgr.getProvidedInterface(
    "IEmprestimoOps",
  ) as IEmprestimoOps | undefined;

  if (!limiteOps || !emprestimoOps) {
    throw new Error("Falha ao obter interfaces providas dos componentes.");
  }

  const conector = new EmprestimoLimiteConnector(limiteOps);
  componenteEmprestimoMgr.setRequiredInterface("ILimiteReq", conector);

  return emprestimoOps;
}

function main(): void {
  const emprestimoOps = configurarArquitetura();
  const usuario = new DTUsuario("2500,00");
  const valor = emprestimoOps.liberarEmprestimoAutomatico(usuario);

  console.log("Emprestimo liberado:", valor);
}

main();
