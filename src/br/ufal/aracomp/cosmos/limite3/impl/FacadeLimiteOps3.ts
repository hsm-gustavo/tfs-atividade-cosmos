import { DTCliente3 } from "../spec/dt/DTCliente3";
import { ILimiteOps3 } from "../spec/prov/ILimiteOps3";

export class FacadeLimiteOps3 implements ILimiteOps3 {
  /**
   * 30% do salario do cliente
   * Deve retornar valor >=0
   */
  public calcularLimite(client: DTCliente3): number {
    const limite = client.salario() * 0.3;

    if (limite >= 0) {
      return limite;
    }

    return 0;
  }
}
