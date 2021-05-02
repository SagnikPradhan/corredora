import serve from "serve-handler";
import { Server as SocketServer } from "socket.io";

import http from "http";
import path from "path";

import { handleAsync } from "./utils/error";

export const startServer = async (port: number) => {
  const PUBLIC_PATH = path.join(__dirname, "../web");
  console.debug(`Serving web from ${PUBLIC_PATH}`);

  const server = http.createServer(
    handleAsync((req, res) => serve(req, res, { public: PUBLIC_PATH }))
  );

  const socketServer = new SocketServer(server);

  socketServer.on("connection", (socket) => {
    socket.join("console");
  });

  await new Promise<void>((res) => server.listen(port, () => res()));
  console.debug(`Listening on ${port}`);
};
