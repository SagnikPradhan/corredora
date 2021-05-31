import ReactJSONTree from "react-json-tree";
import styled from "styled-components";

import { JSONValues } from "corredora/dist/internal";

const BaseData = ({
  className,
  children: data,
}: {
  className?: string;
  children: JSONValues;
}) => {
  return (
    <div className={className}>
      {typeof data === "object" ? (
        <ReactJSONTree
          data={data}
          invertTheme={false}
          hideRoot={true}
          theme={JSONTreeTheme}
        ></ReactJSONTree>
      ) : (
        <PrimitiveData>{data}</PrimitiveData>
      )}
    </div>
  );
};

// https://github.com/hartbit/base16-twilight-scheme
const JSONTreeTheme = {
  scheme: "Twilight",
  author: "David Hart (https://github.com/hartbit)",
  base00: "#1e1e1e",
  base01: "#323537",
  base02: "#464b50",
  base03: "#5f5a60",
  base04: "#838184",
  base05: "#a7a7a7",
  base06: "#c3c3c3",
  base07: "#ffffff",
  base08: "#cf6a4c",
  base09: "#cda869",
  base0A: "#f9ee98",
  base0B: "#8f9d6a",
  base0C: "#afc4db",
  base0D: "#7587a6",
  base0E: "#9b859d",
  base0F: "#9b703f",
} as const;

const PrimitiveData = styled.code`
  display: block;
  padding: 1em;
  border-radius: 5px;
  background-color: ${JSONTreeTheme["base00"]};
  color: ${JSONTreeTheme["base0F"]};
`;

export const Data = styled(BaseData)`
  font-family: var(--font-mono);

  & > ul {
    padding: 1em !important;
    margin: 0 !important;
    border-radius: 5px;
    line-height: 1.2;
  }
`;
