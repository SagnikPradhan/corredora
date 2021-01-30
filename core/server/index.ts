import path from "path";
import { overrideStack } from "./module/callstack";
import { Server } from "./module/server";
import { DataTypes, RecursiveObject } from "./type";
import { CallSite } from "./utils/callstack";

export const logger = async () => {
  const server = new Server(path.join(__dirname, "../web/dist"));
  await server.listen(5000);

  const callstacksMap = overrideStack();

  return new Logger({ name: "root", server, callstacksMap });
};

class Logger {
  public readonly name: string;
  private readonly server: Server;
  private readonly callstacksMap: Map<string, CallSite[]>;

  constructor({
    name,
    server,
    callstacksMap,
  }: {
    name: string;
    server: Server;
    callstacksMap: Map<string, CallSite[]>;
  }) {
    this.name = name;
    this.server = server;
    this.callstacksMap = callstacksMap;
  }

  async log(data: DataTypes) {
    return this.internalLog("LOG", data);
  }

  async debug(data: DataTypes) {
    if (process.env.NODE_ENV !== "production")
      return this.internalLog("DEBUG", data);
  }

  private async internalLog(type: "DEBUG" | "LOG", data: DataTypes) {
    await this.server.send({
      type,
      data,
      date: new Date().toISOString(),
      callsites: [],
    });
  }

  async error({ message, name, stack, ...props }: Error) {
    this.server.send({
      type: "ERROR",
      data: {
        message,
        name,
        props: props as RecursiveObject<DataTypes>,
      },
      date: new Date().toISOString(),
      callsites: this.callstacksMap.get(stack!)!,
    });
  }

  async child(name: string) {
    return new Logger({
      name,
      server: this.server,
      callstacksMap: this.callstacksMap,
    });
  }
}

export * from "./type";
