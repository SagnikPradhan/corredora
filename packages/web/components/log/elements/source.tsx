import styled from "styled-components";
import { CallSite } from "corredora/dist/internal";

const BaseSource = ({
  className,
  children: { file, fileShort, line, column },
}: {
  className?: string;
  children: CallSite;
}) => {
  const link = `vscode://file/${file}:${line || 0}:${column || 0}`;
  return (
    <a className={className} href={link}>
      {fileShort}
    </a>
  );
};

export const Source = styled(BaseSource)`
  padding: 1em 0;
  color: black;
  text-decoration: none;
  font-weight: var(--font-light);
`;
