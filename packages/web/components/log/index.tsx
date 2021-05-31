import styled from "styled-components";
import { Log as LogType } from "corredora/dist/internal";

import { TimeStamp } from "./elements/timestamp";
import { Name } from "./elements/name";
import { Data } from "./elements/data";
import { Source } from "./elements/source";

const LogComponent = styled.div<{ index: number }>`
  display: contents;

  & > * {
    z-index: 30;
    position: relative;

    grid-row: ${({ index }) => index + 2} / span 1;
  }

  ${TimeStamp} {
    grid-column: 1 / 2;
  }

  ${Name} {
    grid-column: 2 / 3;
  }

  ${Data} {
    grid-column: 4 / 5;
  }

  ${Source} {
    grid-column: 5 / 6;
  }
`;

export const Log = ({
  index,
  children: { name, timestamp, data, callstack },
}: {
  index: number;
  children: LogType;
}) => {
  const site = callstack[0]!;

  return (
    <LogComponent index={index}>
      <TimeStamp>{timestamp}</TimeStamp>
      <Name>{name}</Name>
      <Data>{data}</Data>
      <Source>{site}</Source>
    </LogComponent>
  );
};
