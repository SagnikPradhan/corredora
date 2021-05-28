import styled from "styled-components";

export const LogGrid = styled.div`
  width: 80vw;
  min-height: 100vh;

  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 40px 10px rgba(0, 0, 0, 0.2);

  display: grid;
  grid-template-columns: auto auto 10px 1fr auto;
  grid-auto-rows: fit-content(1em);

  gap: 1em 2em;
  padding: 2em 0;
`;
