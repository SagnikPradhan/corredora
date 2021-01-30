import { CallSite, parseCallSite } from "../utils/callstack";
import { hash } from "../utils/hash";

export function overrideStack() {
  const stacks = new Map<string, CallSite[]>();

  Error.prepareStackTrace = function (_, stack) {
    const parsedStack = stack.map(parseCallSite);
    const hashedString = hash(JSON.stringify(parsedStack)).toString();
    stacks.set(hashedString, parsedStack);
    return hashedString;
  };

  return stacks;
}
