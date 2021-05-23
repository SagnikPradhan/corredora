import WebSocket from "isomorphic-ws";

import { PushLogsFn, CommunicationLayerFactory } from "..";

import { ClientPayload, SERVER_PORT } from "../../utils/type";
import { handleError } from "../../utils/error";

export const createClient: CommunicationLayerFactory = ({
  onReady,
  onClose,
}) => {
  const client = new WebSocket(`ws://localhost:${SERVER_PORT}`);

  const push: PushLogsFn = (logs) => {
    if (client.readyState === client.OPEN) {
      const payload: ClientPayload = { type: "log", logs };
      client.send(JSON.stringify(payload), handleError);
    }
  };

  client.once("open", () => onReady());
  client.once("close", () => onClose());

  return { push };
};
