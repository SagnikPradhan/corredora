import StackTracey from "stacktracey";
import { customAlphabet, nanoid } from "nanoid/non-secure";

import { createTransport } from "./modules/transport";
import { JSONValues } from "./utils/types/json";
import { LogLevel } from "./utils/types/log";
import { CorredoraError, handleError } from "./utils/error";

export interface CorredoraLoggerOptions {
  name?: string;
}

export class CorredoraLogger {
  public readonly name: string;

  private readonly transport = createTransport();

  constructor(options?: CorredoraLoggerOptions) {
    if (typeof process === "undefined" && typeof window === "undefined")
      throw new CorredoraError({
        name: "MALFORMED_ENVIRONMENT",
        isOperational: false,
        message: "Malformed environment",
      });

    this.name = options?.name || customAlphabet("ABC0123456789", 5)();
  }

  public info(data: JSONValues) {
    this.internalLog(data, LogLevel.INFO).catch(handleError);
  }

  public debug(data: JSONValues) {
    this.internalLog(data, LogLevel.DEBUG);
  }

  public warn(data: JSONValues) {
    this.internalLog(data, LogLevel.WARN);
  }

  public error(error: Error) {
    const internalAsync = async () => {
      const { name, message, ...props } = error;

      this.transport.addLog({
        data: { name, message, ...props },
        id: this.generateId(),
        name: this.name,
        level: LogLevel.ERROR,
        timestamp: new Date(),
        callstack: await this.getStackTrace(error),
      });
    };

    internalAsync().catch(handleError);
  }

  private generateId() {
    return nanoid();
  }

  private async internalLog(
    data: JSONValues,
    level: Exclude<LogLevel, LogLevel.ERROR>
  ) {
    this.transport.addLog({
      data,
      id: this.generateId(),
      name: this.name,
      level,
      timestamp: new Date(),
      callstack: await this.getStackTrace(),
    });
  }

  private async getStackTrace(error?: Error) {
    const stack = new StackTracey(error, error ? 0 : 4);
    const withSourcesStack = await stack.withSourcesAsync();

    return withSourcesStack.items.map(
      ({ file, native, callee, fileShort, line, column, thirdParty }) => ({
        file,
        fileShort,

        line,
        column,

        callee,

        native,
        thirdParty,
        internal: file.includes("node:internal"),
      })
    );
  }
}
