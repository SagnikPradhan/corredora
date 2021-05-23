import http from "http";

import { serveFiles } from "./serve";
import { attachSocketServer } from "./socket";

import { handleError } from "./error";

async function main() {
  const httpServer = attachSocketServer(http.createServer(serveFiles));
  httpServer.listen(3616, () => console.log("Listening on 3616"));
}

main().catch(handleError);
