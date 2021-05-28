import fetch from "cross-fetch";
import { Log, SERVER_PORT } from "../../utils/type";
import { handleError } from "../../utils/error";

export interface CommunicationLayer {
  push: (logs: Log[]) => void;
}

export type CommunicationLayerFactory = (param: {
  onReady: () => void;
  onClose: () => void;
}) => CommunicationLayer;

class Transport {
  #logs = [] as Log[];
  #communicationLayer?: CommunicationLayer;

  public addLog(log: Log) {
    this.#logs.push(log);
    if (this.#communicationLayer) this.#communicationLayer.push([log]);
  }

  public async initConnection() {
    const serverOffline = await this.isServerOffline();
    if (!serverOffline) return this.startTransport("client");

    const isNode = typeof process !== "undefined";
    if (isNode) return this.startTransport("server");
    else setTimeout(() => this.initConnection().catch(handleError), 5000);
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
        ? (await import("./communication-layer/server")).create
        : (await import("./communication-layer/client")).create;

    const communicationLayer = create({
      onReady: () => communicationLayer.push(this.#logs),

      onClose: () => {
        this.#communicationLayer = undefined;
        this.initConnection();
      },
    });

    this.#communicationLayer = communicationLayer;
  }
}

export const createTransport = () => {
  const transport = new Transport();
  transport.initConnection().catch(handleError);
  return transport;
};
