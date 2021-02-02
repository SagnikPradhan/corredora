import path from "path";
import { CallSite } from "./module/callstack/callsite";
import { overrideStack } from "./module/callstack/override";
import { server, ServerSendFn } from "./module/server";
import { Data } from "./type";

const PORT = 5000;
const PUBLIC_PATH = path.join(__dirname, "../web/dist");
const DEV_MODE = process.env.NODE_ENV !== "production";

/** Logger Interface */
export interface Logger {
  /** Name of the logger */
  name: string;

  /** Sends information */
  info: (data: Data) => Promise<void>;

  /**
   * Only shown during development mode
   * i.e. `process.env.NODE_ENV !== "production"`
   */
  debug: (data: Data) => Promise<void>;

  /** Sends error report */
  error: (error: Error) => Promise<void>;
}

/**
 * Create a new logger
 *
 * @param name - Name of the logger
 * @param options - Options
 * @param options.parent - Parent logger
 * @param options.server - Logger server
 */
export async function logger(
  name: string,
  options: {
    parent?: Logger;
    internal?: {
      send: ServerSendFn;
      stackMap: Map<string, CallSite[]>;
    };
  } = {}
): Promise<Logger> {
  const stackMap = options.internal?.stackMap || overrideStack();

  // Create server if not instance was provided. Initialise it too.
  const send =
    options.internal?.send ||
    (await server({
      port: PORT,
      publicPath: PUBLIC_PATH,
      stackMap,
    }));

  return {
    name,

    debug: (data) => {
      if (DEV_MODE) return send("DEBUG", data);
      else return Promise.resolve();
    },

    error: (error) => {
      return send("ERROR", error);
    },

    info: (data) => {
      return send("INFO", data);
    },
  };
}

export * from "./type";
