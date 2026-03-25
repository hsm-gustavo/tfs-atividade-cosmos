export class DTCliente {
  public constructor(private readonly _salario: number) {}

  public salario(): number {
    return this._salario;
  }
}
