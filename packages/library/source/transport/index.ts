import fetch from "cross-fetch";
import { Log, SERVER_PORT } from "../utils/type";
import { handleError } from "../utils/error";

type Mutable<T> = { current: T };

export interface CommunicationLayer {
  push: (logs: Log[]) => void;
}

export type CommunicationLayerFactory = (param: {
  onReady: () => void;
  onClose: () => void;
}) => CommunicationLayer;

export function createTransport() {
  const logs = [] as Log[];
  const layer = handleCommunicationLayer((layer) => layer.push(logs));

  return {
    addLog: function (log: Log) {
      logs.push(log);
      if (layer.current) layer.current.push([log]);
    },
  };
}

const isNode = typeof process !== undefined;

function handleCommunicationLayer(
  onReady: (communicationLayer: ReturnType<CommunicationLayerFactory>) => void
) {
  // Mutable because communication layer can be replaced in future
  const mutableLayer: Mutable<CommunicationLayer | null> = { current: null };

  // Keeps track of communication layer
  // If the connection closes in any case, a new connection is created
  // Also waits for server to initialise in case of browsers
  const internalAsync = async () => {
    const serverOffline = await isServerOffline();

    // Wait for the server to start
    // If we cannot start the server ourselves and it is offline
    if (serverOffline && !isNode) {
      setTimeout(() => internalAsync().catch(handleError), 5000);
    }

    // Use the client module if another server is online
    // Otherwise start the server module ourselves
    else {
      const module = await (serverOffline
        ? import("./communication-layer/server")
        : import("./communication-layer/client"));

      const layer = module.create({
        onReady: () => onReady(layer),
        onClose: () => {
          mutableLayer.current = null;
          internalAsync().catch(handleError);
        },
      });

      mutableLayer.current = layer;
    }
  };

  internalAsync().catch(handleError);

  return mutableLayer;
}

async function isServerOffline() {
  try {
    await fetch(`http://localhost:${SERVER_PORT}`);
    return false;
  } catch (error) {
    if (error.code === "ECONNREFUSED") return true;
    else throw error;
  }
}
