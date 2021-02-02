import http from "http";
import ws from "ws";
import serve from "serve-handler";
import { nanoid } from "nanoid";

import { handleAsync } from "@self/util/error";
import { Data, ErrorData, Log, Payload } from "@self/type/index";
import {
  CallSite,
  stripLibraryTopStacks,
} from "@self/module/callstack/callsite";
import { RecursiveObject } from "@self/type/util";
import { promisify } from "@self/util/promisify";

export type ServerSendFn = <Type extends Log>(
  type: Type,
  data: Type extends "ERROR" ? Error : Data
) => Promise<void>;

/**
 * Starts http and websocket server on the same port.
 * Keeps a record of all messages and plays them back when
 * any client connects.
 *
 * @param options - Options
 * @param options.publicPath - Public path to the frontend
 * @param options.port - Port to listen to
 * @param options.stackMap - Stack map
 *
 * @returns A function to send logs.
 */
export async function server({
  publicPath,
  port,
  stackMap,
}: {
  publicPath: string;
  port: number;
  stackMap: Map<string, CallSite[]>;
}): Promise<ServerSendFn> {
  const messageRecord = new Array<string>();

  const httpServer = http.createServer((req, res) =>
    serve(req, res, { public: publicPath })
  );

  const wsClients = websocket(httpServer, messageRecord);

  await new Promise<void>((R) => httpServer.listen(port, R));

  return async <Type extends Log>(
    type: Type,
    data: Type extends "ERROR" ? Error : Data
  ) => {
    const payload =
      type === "ERROR"
        ? generatePayloadForError({ error: data as Error, stackMap })
        : generatePayloadForData({
            data: data as Data,
            stackMap,
            type: type as Exclude<Log, "ERROR">,
          });

    const message = JSON.stringify(payload);
    await sendMessage(wsClients, message);
    messageRecord.push(message);
  };
}

/**
 * Starts up the websocket server. And plays back the messages
 * when a new client connects to the server.
 *
 * @param server - HTTP Server
 * @param messageRecord - Messages record
 *
 * @returns A Set of websocket clients
 */
function websocket(server: http.Server, messageRecord: string[]) {
  const websocketServer = new ws.Server({ server });

  websocketServer.on(
    "connection",
    handleAsync(async (client) => {
      await Promise.all(
        messageRecord.map((message) => sendMessage(client, message))
      );
    })
  );

  return websocketServer.clients;
}

/**
 * Generate payload from data.
 *
 * @param options - Options
 * @param options.data - Data
 * @param options.stackMap - Stack map
 * @param options.type - Type of log
 */
function generatePayloadForData({
  data,
  stackMap,
  type,
}: {
  data: Data;
  stackMap: Map<string, CallSite[]>;
  type: Exclude<Log, "ERROR">;
}): Payload {
  const error = new Error();
  const callstack = stackMap.get(error.stack!) || [];

  return {
    data,
    type,
    id: nanoid(),
    date: new Date(),
    callstack: stripLibraryTopStacks(callstack),
  };
}

/**
 * Generate payload from error.
 *
 * @param options - Options
 * @param options.error - Error
 * @param options.stackMap - Stack map
 */
function generatePayloadForError({
  error: { name, message, stack: stackId, ...props },
  stackMap,
}: {
  error: Error;
  stackMap: Map<string, CallSite[]>;
}): Payload {
  const callstack = stackMap.get(stackId!) || [];
  const errorData: ErrorData = {
    name,
    message,
    props: props as RecursiveObject<Data>,
  };

  return {
    callstack,
    id: nanoid(),
    type: "ERROR",
    data: errorData,
    date: new Date(),
  };
}

/**
 * Send message to client(s).
 *
 * @param clients - Client or set of clients
 * @param message - Stringified message
 */
async function sendMessage(
  clients: ws | Set<ws>,
  message: string
): Promise<void> {
  if (clients instanceof Set)
    await Promise.all(
      Array.from(clients).map((client) =>
        promisify(client.send, client)(message)
      )
    );
  else await promisify(clients.send, clients)(message);
}
