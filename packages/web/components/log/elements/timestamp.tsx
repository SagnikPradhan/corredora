import styled from "styled-components";

export const BaseTimeStamp = ({
  className,
  children: time,
}: {
  className?: string;
  children: Date;
}) => {
  const timeString = time.toLocaleTimeString();
  return <div className={className}>{timeString}</div>;
};

export const TimeStamp = styled(BaseTimeStamp)`
  padding: 1em 0 1em 2em;

  display: flex;
  justify-content: center;
`;
