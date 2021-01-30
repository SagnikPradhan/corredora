import http from "http";
import ws from "ws";
import serve from "serve-handler";

import { handleAsync } from "../utils/error";
import { promisify } from "../utils/promisify";
import { ServerMessage } from "../type";
import { hash } from "../utils/hash";

export class Server {
  public intitialised = false;

  private messages = [] as string[];
  private server: http.Server;
  private websocketServer: ws.Server;

  constructor(PUBLIC_PATH: string) {
    this.server = http.createServer((req, res) =>
      serve(req, res, { public: PUBLIC_PATH })
    );

    this.websocketServer = new ws.Server({ server: this.server });

    this.websocketServer.on(
      "connection",
      handleAsync(async (client) => {
        for (const message of this.messages)
          await promisify(client.send, client)(message);
      })
    );
  }

  send(message: Omit<ServerMessage, "id">) {
    const clients = Array.from(this.websocketServer.clients.values());

    const hashString = hash(JSON.stringify(message)).toString();
    const payload = { ...message, id: hashString } as ServerMessage;
    const stringifiedPayload = JSON.stringify(payload);

    return Promise.all(
      clients.map((client) =>
        promisify(client.send, client)(stringifiedPayload)
      )
    ).then(() => {
      this.messages.push(stringifiedPayload);
    });
  }

  async listen(port: number) {
    await Promise.all([
      new Promise<void>((R) => this.websocketServer.once("listening", R)),
      new Promise<void>((R) => this.server.listen(port, R)),
    ]);

    this.intitialised = true;
  }
}
