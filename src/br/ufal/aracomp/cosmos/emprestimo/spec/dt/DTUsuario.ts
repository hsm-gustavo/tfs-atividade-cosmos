export class DTUsuario {
  public constructor(private readonly _rendimentos: string) {}

  public rendimentos(): string {
    return this._rendimentos;
  }
}