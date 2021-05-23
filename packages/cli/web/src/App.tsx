import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current)
      socketRef.current = io("http://localhost:3616", {
        path: "/api/socket.io",
      });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Emitted subscribe");
      socket.emit("subscribe", ({ ok }: { ok: boolean }) => setConnected(ok));
    });

    socket.on("log", console.log);

    return () => {
      socket.close();
    };
  }, []);

  return <div className="App">{connected ? "Connected" : "Not Connected"}</div>;
}

export default App;
