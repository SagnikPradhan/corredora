import { createTransport } from "./transport";
import { LogLevel } from "./utils/type";

export class CorredoraLogger {
  private readonly transport = createTransport();

  log(data: unknown) {
    this.transport.addLog({
      data,
      level: LogLevel.INFO,
      timestamp: new Date(),
    });
  }
}
