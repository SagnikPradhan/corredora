import { Container } from "../components/container";
import { LogGrid } from "../components/log/grid";
import { Log } from "../components/log";
import { Tracks } from "../components/log/track";
import { Logo } from "../components/logo";
import { Labels } from "../components/log/label";

import { useConnector } from "../utils/connector";

export default function Home() {
  const { logs } = useConnector();

  return (
    <Container>
      <Logo>Corredora</Logo>

      <LogGrid>
        <Labels />

        {logs.map((log, index) => (
          <Log index={index} key={log.id}>
            {log}
          </Log>
        ))}

        <Tracks logs={logs} />
      </LogGrid>
    </Container>
  );
}
