import { IManager } from "../../IManager";
import { FacadeLimiteOps3 } from "./FacadeLimiteOps3";

export class Manager implements IManager {
  private readonly providedInterfaces: Map<string, unknown>;
  private readonly requiredInterfaces: Map<string, unknown>;

  public constructor() {
    this.providedInterfaces = new Map<string, unknown>();
    this.requiredInterfaces = new Map<string, unknown>();
    this.providedInterfaces.set("ILimiteOps3", new FacadeLimiteOps3());
  }

  public getProvidedInterfaces(): Set<string> {
    return new Set(this.providedInterfaces.keys());
  }

  public getRequiredInterfaces(): Set<string> {
    return new Set(this.requiredInterfaces.keys());
  }

  public getProvidedInterface(interfaceName: string): unknown {
    return this.providedInterfaces.get(interfaceName);
  }

  public setRequiredInterface(interfaceName: string, interfaceObject: unknown): void {
    this.requiredInterfaces.set(interfaceName, interfaceObject);
  }

  public getRequiredInterface(interfaceName: string): unknown {
    return this.requiredInterfaces.get(interfaceName);
  }
}
