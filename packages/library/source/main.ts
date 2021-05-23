import "cross-fetch";
import { Transport } from "./transport";
import { LogLevel } from "./utils/type";

export class CorredoraLogger {
  #transport = new Transport();

  log(data: unknown) {
    this.#transport.addLog({
      data,
      level: LogLevel.INFO,
      timestamp: new Date(),
    });
  }
}
