import styled, { createGlobalStyle } from "styled-components";
import { useConnector } from "../utils/connector";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    min-height: 100vh;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 10%;
`;

const Logs = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
`;

const Log = styled.li`
  display: flex;
  flex-direction: row;
  gap: 5ex;

  align-items: center;
  justify-content: flex-start;
`;

export default function Home() {
  const { logs } = useConnector();

  return (
    <>
      <GlobalStyle />

      <Container>
        <Logs>
          {logs.map(({ timestamp, data, level }) => (
            <Log>
              <div>{level}</div>
              <div>{timestamp}</div>
              <div>{JSON.stringify(data, null, 2)}</div>
            </Log>
          ))}
        </Logs>
      </Container>
    </>
  );
}
