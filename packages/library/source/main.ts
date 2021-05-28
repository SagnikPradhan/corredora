import StackTracey from "stacktracey";
import { customAlphabet, nanoid } from "nanoid/non-secure";

import { createTransport } from "./modules/transport";
import { JSONValues, LogLevel } from "./utils/type";
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
    const internalAsync = async () => {
      this.transport.addLog({
        data,
        id: this.generateId(),
        name: this.name,
        level: LogLevel.INFO,
        timestamp: new Date(),
        callstack: await this.getStackTrace(),
      });
    };

    internalAsync().catch(handleError);
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
