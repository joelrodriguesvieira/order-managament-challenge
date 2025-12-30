import { HttpErrorsStatusCode } from './error.types';

export class ErrorHandler extends Error {
  public readonly statusCode: HttpErrorsStatusCode;

  constructor(
    message: string,
    statusCode: HttpErrorsStatusCode = HttpErrorsStatusCode.BAD_REQUEST,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
