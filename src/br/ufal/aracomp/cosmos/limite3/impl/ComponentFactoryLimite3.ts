import { IManager } from "../../IManager";
import { Manager } from "./Manager";

export class ComponentFactoryLimite3 {
  private static manager: IManager | null = null;

  private constructor() {
    // fazer nada
  }

  public static createInstance(): IManager {
    if (ComponentFactoryLimite3.manager === null) {
      ComponentFactoryLimite3.manager = new Manager();
    }

    return ComponentFactoryLimite3.manager;
  }
}
