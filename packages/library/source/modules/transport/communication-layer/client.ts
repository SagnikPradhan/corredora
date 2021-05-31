import WebSocket from "isomorphic-ws";

import { CommunicationLayer, CommunicationLayerFactory } from "..";

import {
  ClientPayload,
  SERVER_PORT,
} from "corredora/source/utils/types/server";
import { handleError } from "../../../utils/error";

export const create: CommunicationLayerFactory = ({ onReady, onClose }) => {
  const client = new WebSocket(`ws://localhost:${SERVER_PORT}`);

  const push: CommunicationLayer["push"] = (logs) => {
    if (client.readyState === client.OPEN) {
      const payload: ClientPayload = { type: "log", logs };
      client.send(JSON.stringify(payload), handleError);
    }
  };

  client.once("open", () => onReady());
  client.once("close", () => onClose());

  return { push };
};
