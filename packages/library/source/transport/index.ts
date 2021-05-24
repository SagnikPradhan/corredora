import fetch from "cross-fetch";
import { Log, SERVER_PORT } from "../utils/type";
import { handleError } from "../utils/error";

export type PushLogsFn = (logs: Log[]) => void;

export type CommunicationLayerFactory = (param: {
  onReady: () => void;
  onClose: () => void;
}) => { push: PushLogsFn };

export class Transport {
  #logs = [] as Log[];
  #communicationLayer?: ReturnType<CommunicationLayerFactory>;

  constructor() {
    this.initConnection().catch(handleError);
  }

  public addLog(log: Log) {
    this.#logs.push(log);
    if (this.#communicationLayer) this.#communicationLayer.push([log]);
  }

  private async isServerOffline() {
    try {
      await fetch(`http://localhost:${SERVER_PORT}`);
      return false;
    } catch (error) {
      if (error.code === "ECONNREFUSED") return true;
      else throw error;
    }
  }

  private async startTransport(connector: "server" | "client") {
    const create =
      connector === "server"
        ? (await import("./communication-layer/server")).createServer
        : (await import("./communication-layer/client")).createClient;

    const communicationLayer = create({
      onReady: () => communicationLayer.push(this.#logs),

      onClose: () => {
        this.#communicationLayer = undefined;
        this.initConnection();
      },
    });

    this.#communicationLayer = communicationLayer;
  }

  private async initConnection() {
    const serverOffline = await this.isServerOffline();
    if (!serverOffline) return this.startTransport("client");

    const isNode = typeof process !== "undefined";
    if (isNode) return this.startTransport("server");
    else setTimeout(() => this.initConnection().catch(handleError), 5000);
  }
}
