import { useRef, useState, useEffect } from "react";
import { SERVER_PORT } from "corredora/dist/internal";

export function useServerStatus() {
  const loopRef = useRef<unknown | null>(null);
  const [status, setStatus] = useState<0 | 1>(0);

  const start = () => {
    checkStatus();
    loopRef.current = setInterval(checkStatus, 5000);
  };

  const pause = () => {
    if (loopRef.current) clearInterval(loopRef.current as number);
  };

  useEffect(start, []);

  function checkStatus() {
    fetch(`http://localhost:${SERVER_PORT}`)
      .then((res) => setStatus(res.ok ? 1 : 0))
      .catch((error) => {
        setStatus(0);
        console.error(error);
      });
  }

  return { status, start, pause };
}
