import styled from "styled-components";

export const LogGrid = styled.div`
  width: 80vw;
  min-height: 50vh;

  background: rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  display: grid;
  grid-template-columns: auto auto 10px 1fr auto;
  grid-auto-rows: fit-content(1em);

  gap: 1em 2em;
  padding: 2em;

  z-index: 30;
`;
