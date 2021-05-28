import styled from "styled-components";
import { Log, LogLevel } from "corredora/dist/internal";

export const Tracks = ({ logs }: { logs: Log[] }) => {
  const tracks = logs.reduce((tracks, current) => {
    const last = tracks[tracks.length - 1];

    if (current.level === last?.level) last.span += 1;
    else
      tracks.push({
        level: current.level,
        span: 1,
        id: current.id,
        start: (last?.start || 1) + (last?.span || 0),
      });

    return tracks;
  }, [] as { level: LogLevel; span: number; id: string; start: number }[]);

  return (
    <>
      {tracks.map(({ level, span, id, start }) => (
        <Track key={id + "track"} level={level} span={span} start={start} />
      ))}
    </>
  );
};

const Track = styled.div<{
  level: LogLevel;
  span: number;
  start: number;
}>`
  grid-column: 3 / 4;
  grid-row: ${({ start }) => start} / span ${({ span }) => span};
  margin: 1em 0;

  background-color: ${({ level }) => decideColour(level)};
  width: 3px;

  z-index: 10;
  position: relative;
`;

const decideColour = (level: LogLevel) => {
  switch (level) {
    case LogLevel.DEBUG:
      return "var(--key-lime)";
    case LogLevel.ERROR:
      return "var(--tart-orange)";
    case LogLevel.INFO:
      return "#08bdbd";
    case LogLevel.WARN:
      return "var(--gold-crayola)";
  }
};
