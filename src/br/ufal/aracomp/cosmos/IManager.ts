export interface IManager {
  getProvidedInterfaces(): Set<string>;
  getRequiredInterfaces(): Set<string>;
  getProvidedInterface(interfaceName: string): unknown;
  setRequiredInterface(interfaceName: string, interfaceObject: unknown): void;
  getRequiredInterface(interfaceName: string): unknown;
}
