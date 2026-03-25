import { IManager } from "../../IManager";
import { DTUsuario } from "../spec/dt/DTUsuario";
import { IEmprestimoOps } from "../spec/prov/IEmprestimoOps";
import { ILimiteReq } from "../spec/req/ILimiteReq";

export class FacadeEmprestimoOps implements IEmprestimoOps {
  private intReq: ILimiteReq | null = null;

  public constructor(private readonly manager: IManager) {}

  /**
   * Se rendimento do cliente for maior que 1000
   * Emprestar 90% do limite de emprestimo
   * Caso contrario, retorna 0
   */
  public liberarEmprestimoAutomatico(client: DTUsuario): number {
    try {
      let rendimento = 0;
      try {
        rendimento = Number.parseFloat(client.rendimentos());
      } catch {
        console.error("Tratamento 1...");
        rendimento = Number.parseFloat(client.rendimentos().replace(/,/g, "."));
        console.log("Tratado com sucesso!");
      }

      if (Number.isNaN(rendimento)) {
        throw new TypeError("Numero invalido");
      }

      if (rendimento > 1000) {
        this.intReq = this.manager.getRequiredInterface("ILimiteReq") as ILimiteReq;
        if (!this.intReq) {
          return 0;
        }
        const limite = this.intReq.estimarLimite(client);
        return limite * 0.9;
      }
    } catch {
      console.log("NUMERO ERRADO!!!");
    }

    return 0;
  }
}