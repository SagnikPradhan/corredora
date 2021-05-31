import styled from "styled-components";

const Label = styled.h2`
  font-family: var(--font-special);
  font-weight: var(--font-extra-bold);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5em;
`;

const BaseLabels = ({ className }: { className?: string }) => (
  <div className={className}>
    <Label>Time</Label>
    <Label>Name</Label>
    <Label>Log</Label>
    <Label>Source</Label>
  </div>
);

export const Labels = styled(BaseLabels)`
  display: contents;

  & > * {
    grid-row: 1 / 2;
    z-index: 30;
  }

  & > ${Label}:nth-of-type(1) {
    grid-column: 1 / 2;
  }

  & > ${Label}:nth-of-type(2) {
    grid-column: 2 / 3;
  }

  & > ${Label}:nth-of-type(3) {
    grid-column: 4 / 5;
  }

  & > ${Label}:nth-of-type(4) {
    grid-column: 5 / 6;
  }
`;
