export class ErrorResponse {
  private message: string

  constructor(message: unknown) {
    this.message = message as string
  }

  public toJSON() {
    return {
      error: this.message
    }
  }

  public toString() {
    return this.message
  }
}