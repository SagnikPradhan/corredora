import styled from "styled-components";

const BaseName = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  return <h3 className={className}>{children}</h3>;
};

export const Name = styled(BaseName)`
  padding: 1em 0;
  font-weight: var(--font-bold);

  display: flex;
  justify-content: center;
`;
