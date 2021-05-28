import styled from "styled-components";

export const BlurLayer = styled.div<{ length: number }>`
  z-index: 20;
  position: relative;

  backdrop-filter: blur(8px);

  grid-row: 1 / span ${({ length }) => length};
  grid-column: 1 / span 6;
`;
