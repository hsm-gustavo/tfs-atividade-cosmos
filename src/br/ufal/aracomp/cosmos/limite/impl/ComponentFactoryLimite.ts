import { IManager } from "../../IManager";
import { Manager } from "./Manager";

export class ComponentFactoryLimite {
  private static manager: IManager | null = null;

  private constructor() {
    // fazer nada
  }

  public static createInstance(): IManager {
    if (ComponentFactoryLimite.manager === null) {
      ComponentFactoryLimite.manager = new Manager();
    }

    return ComponentFactoryLimite.manager;
  }
}
