import { CustomError } from "./customError";

export class DBConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";
  constructor() {
    super("Error connecting to db");

    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
