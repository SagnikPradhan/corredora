import { useRef } from "react";

export function useWebsocket(
  url: string,
  listeners: {
    open: (send: (data: string) => void) => void;
    close: () => void;
    message: (data: string, send: (data: string) => void) => void;
  }
) {
  const ref = useRef<WebSocket | null>(null);

  function connect() {
    close();
    create();
  }

  function close() {
    if (!ref.current) return;

    const websocket = ref.current;
    if (websocket.readyState === websocket.OPEN) websocket.close();
    ref.current = null;
  }

  function create() {
    const websocket = new WebSocket(url);

    const send = (data: string) => websocket.send(data);

    websocket.addEventListener("open", () => listeners.open(send));
    websocket.addEventListener("close", listeners.close);
    websocket.addEventListener("message", (message) =>
      listeners.message(message.data, send)
    );

    ref.current = websocket;
  }

  return { connect };
}
