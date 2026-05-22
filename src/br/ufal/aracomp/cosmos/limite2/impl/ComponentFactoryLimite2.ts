import { IManager } from "../../IManager";
import { Manager } from "./Manager";

export class ComponentFactoryLimite2 {
  private static manager: IManager | null = null;

  private constructor() {
    // fazer nada
  }

  public static createInstance(): IManager {
    if (ComponentFactoryLimite2.manager === null) {
      ComponentFactoryLimite2.manager = new Manager();
    }

    return ComponentFactoryLimite2.manager;
  }
}
