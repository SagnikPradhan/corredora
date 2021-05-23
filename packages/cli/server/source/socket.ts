import http from "http";
import * as socket from "socket.io";
import { handleError } from "./error";

const SOCKET_PATH = "/api/socket.io";
const EVENTS = { LOG: "log", SUBSCRIBE: "subscribe" } as const;
const SUBSCRIBERS_ROOM = "subscribers";

function attachSocketServer(httpServer: http.Server) {
  const messages = new Set();
  const server = new socket.Server(httpServer, { path: SOCKET_PATH });

  server.on("connection", createConnectionListener(messages));

  return httpServer;
}

function createConnectionListener(messages: Set<unknown>) {
  return (socket: socket.Socket): void => {
    socket.on(EVENTS.LOG, createMessageListener(messages, socket));
    socket.on(EVENTS.SUBSCRIBE, createSubscriberListener(messages, socket));
  };
}

function createMessageListener(messages: Set<unknown>, socket: socket.Socket) {
  return (message: unknown) => {
    messages.add(message);
    socket.to(SUBSCRIBERS_ROOM).emit(EVENTS.LOG, message);
  };
}

function createSubscriberListener(
  messages: Set<unknown>,
  socket: socket.Socket
) {
  return (callback: ({ ok }: { ok: boolean }) => void) => {
    for (const message of messages) socket.emit(EVENTS.LOG, message);

    Promise.resolve(socket.join(SUBSCRIBERS_ROOM))
      .then(() => callback({ ok: true }))
      .catch((err) => {
        callback({ ok: false });
        handleError(err);
      });
  };
}

export { EVENTS, SOCKET_PATH, attachSocketServer };
