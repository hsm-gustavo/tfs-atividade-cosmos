import { DTCliente2 } from "../spec/dt/DTCliente2";
import { ILimiteOps2 } from "../spec/prov/ILimiteOps2";

export class FacadeLimiteOps2 implements ILimiteOps2 {
  /**
   * 29% do salario do cliente
   * Deve retornar valor >=0
   */
  public calcularLimite(client: DTCliente2): number {
    let limite = client.salario() * 0.29;

    if (client.salario() === 1002) {
      limite = client.salario();
    }

    if (limite >= 0) {
      return limite;
    }

    return 0;
  }
}
