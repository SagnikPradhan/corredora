import styled from "styled-components";
import { Log as LogType } from "corredora/dist/internal";

import { TimeStamp } from "./elements/timestamp";
import { Name } from "./elements/name";
import { Data } from "./elements/data";
import { Source } from "./elements/source";

const LogComponent = styled.div<{ index: number }>`
  display: contents;

  ${TimeStamp} {
    z-index: 30;
    position: relative;

    grid-column: 1 / 2;
    grid-row: ${({ index }) => index} / span 1;
  }

  ${Name} {
    z-index: 30;
    position: relative;

    grid-column: 2 / 3;
    grid-row: ${({ index }) => index} / span 1;
  }

  ${Data} {
    z-index: 30;
    position: relative;

    grid-column: 4 / 5;
    grid-row: ${({ index }) => index} / span 1;
  }

  ${Source} {
    z-index: 30;
    position: relative;

    grid-column: 5 / 6;
    grid-row: ${({ index }) => index} / span 1;
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
