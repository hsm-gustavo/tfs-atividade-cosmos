export class NumeroInvalidoException extends Error {
  public constructor(mensagem: string, cause?: unknown) {
    super(mensagem);
    this.name = "NumeroInvalidoException";
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}