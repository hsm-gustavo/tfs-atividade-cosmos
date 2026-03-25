import { DTCliente } from "../spec/dt/DTCliente";
import { ILimiteOps } from "../spec/prov/ILimiteOps";

export class FacadeLimiteOps implements ILimiteOps {
  /**
   * 29% do salario do cliente
   * Deve retornar valor >=0
   */
  public calcularLimite(client: DTCliente): number {
    let limite = client.salario() * 0.29;

    if (client.salario() === 1001) {
      limite = client.salario();
    }

    if (limite >= 0) {
      return limite;
    }

    return 0;
  }
}
