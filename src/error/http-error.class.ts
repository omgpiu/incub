export class HttpError extends Error {
  statusCode: number;
  data?: string;

  constructor(statusCode: number, message: string, data?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
