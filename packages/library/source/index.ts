import { io, Socket } from "socket.io-client";

export class CorredoraLogger {
  #socket: Socket;

  #connected = false;
  #preConnectHistory = [] as string[];

  constructor(socket?: Socket) {
    this.#socket =
      socket || io("http://localhost:3616", { path: "/api/socket.io" });

    this.#socket.on("connect", () => {
      this.#connected = true;

      console.log({ history: this.#preConnectHistory });

      for (const message of this.#preConnectHistory)
        this.#socket.emit("log", message);
    });

    this.#socket.on("error", console.log);
  }

  log(message: string) {
    if (this.#connected) this.#socket.emit("log", message);
    else this.#preConnectHistory.push(message);
  }
}
