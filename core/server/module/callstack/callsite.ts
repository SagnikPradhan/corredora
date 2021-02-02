import fs from "fs";
import path from "path";
import { SourceMapConsumer } from "source-map";

import { Nullable } from "@self/type/util";

export interface CallSite {
  fileName: Nullable<string>;
  line: Nullable<number>;
  column: Nullable<number>;
  functionName: Nullable<string>;
}

const filesCache = new Map<string, string>();

const readFile = (path: string) => {
  const cached = filesCache.get(path);
  if (cached) return cached;

  const file = fs.readFileSync(path).toString();
  filesCache.set(path, file);
  return file;
};

/**
 * Parse callSite
 *
 * @param callSites - NodeJS CallSite
 */
export function parseCallSite(callSite: NodeJS.CallSite): CallSite {
  const { column, line, fileName, functionName } = extractDetailsFromCallsite(
    callSite
  );

  // Check for any sourcemaps
  if (column && line && fileName && !fileName.startsWith("node:")) {
    const sourceMapPath = getSourceMapPath(fileName);

    if (sourceMapPath) {
      const sourceMapDetails = extractDetailsFromSourceMap({
        line,
        column,
        sourceMapPath,
      });

      return {
        column: sourceMapDetails.column,
        fileName: sourceMapDetails.source,
        line: sourceMapDetails.line,
        functionName,
      };
    }
  }

  return {
    fileName,
    line,
    column,
    functionName,
  };
}

/**
 * Get required details from the callsite.
 *
 * @param callsite - Node.JS CallSite
 */
function extractDetailsFromCallsite(callsite: NodeJS.CallSite) {
  function getFunctionName() {
    const thisName = callsite.getTypeName();
    const methodName = callsite.getMethodName() || callsite.getFunctionName();

    if (!!thisName && !!methodName) return `${thisName}.${methodName}`;
    else if (!!thisName) return thisName;
    else if (!!methodName) return `unknown.${methodName}`;
    else return null;
  }

  const details = {
    fileName: callsite.getFileName(),
    line: callsite.getLineNumber(),
    column: callsite.getColumnNumber(),
    functionName: getFunctionName(),
  };

  return details;
}

/**
 * Extract details from source map.
 *
 * @param options - Options
 * @param options.sourceMapPath - Source map path
 * @param options.line - Line
 * @param options.coumn - Column
 */
function extractDetailsFromSourceMap({
  sourceMapPath,
  line,
  column,
}: {
  sourceMapPath: string;
  line: number;
  column: number;
}) {
  const sourceMap = JSON.parse(readFile(sourceMapPath));
  const consumer = new SourceMapConsumer(sourceMap);

  return consumer.originalPositionFor({
    line,
    column,
  });
}

/**
 * Get source map path.
 *
 * @param mainFilePath - Main file path
 */
function getSourceMapPath(mainFilePath: string) {
  const content = readFile(mainFilePath);

  const sourceMapPath = content
    .split(/\r?\n/g)
    .find((line) => line.includes("//# sourceMa" + "ppingURL="))
    ?.split("=")[1];

  return sourceMapPath
    ? path.join(path.dirname(mainFilePath), sourceMapPath)
    : null;
}

export function stripLibraryTopStacks(callstack: CallSite[]) {
  let passedNonLibraryStack = false;

  return callstack.filter((stack) => {
    if (passedNonLibraryStack) return true;
    else {
      if (stack.fileName === __filename) return false;
      else return true;
    }
  });
}
