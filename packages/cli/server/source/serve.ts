import http from "http";
import path from "path";

import serve from "serve-handler";

import { handleError } from "./error";

export const serveFiles = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  const publicDirectory = path.join(__dirname, "../../web/dist");
  serve(req, res, { public: publicDirectory }).catch(handleError);
};
