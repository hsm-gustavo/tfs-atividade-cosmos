import { IManager } from "../../IManager";
import { Manager } from "./Manager";

export class ComponentFactoryEmprestimo {
  private static manager: IManager | null = null;

  private constructor() {
    // faz nada - SINGLETON
  }

  public static createInstance(): IManager {
    if (ComponentFactoryEmprestimo.manager === null) {
      ComponentFactoryEmprestimo.manager = new Manager();
    }

    return ComponentFactoryEmprestimo.manager;
  }
}