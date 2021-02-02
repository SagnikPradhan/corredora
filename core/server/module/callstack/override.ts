import { CallSite, parseCallSite } from "./callsite";
import { nanoid } from "nanoid";

export function overrideStack() {
  const stacks = new Map<string, CallSite[]>();

  Error.prepareStackTrace = function (_, stack) {
    const parsedStack = stack.map(parseCallSite);
    const id = nanoid();
    stacks.set(id, parsedStack);
    return id;
  };

  return stacks;
}
