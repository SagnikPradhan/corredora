import { Container } from "../components/container";
import { LogGrid } from "../components/log/grid";
import { Log } from "../components/log";
import { Tracks } from "../components/log/track";
import { BlurLayer } from "../components/blur-layer";
import { Logo } from "../components/logo";

import { useConnector } from "../utils/connector";

export default function Home() {
  const { logs } = useConnector();

  return (
    <Container>
      <Logo>Corredora</Logo>

      <LogGrid>
        {logs.map((log, index) => (
          <Log index={index + 1} key={log.id}>
            {log}
          </Log>
        ))}

        <Tracks logs={logs} />

        <BlurLayer length={logs.length} />
      </LogGrid>
    </Container>
  );
}
