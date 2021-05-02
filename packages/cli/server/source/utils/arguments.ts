import yargs from "yargs/yargs";

export const getArguments = () =>
  yargs(process.argv.slice(2))
    .scriptName("corredora")
    .command("$0", "Run corredora server", (argv) =>
      argv
        .option("port", {
          type: "number",
          default: +(process.env["CORREDORA_PORT"] || "") || 7979,
          describe: "Socket port",
        })
        .option("debug", {
          type: "boolean",
          default: +(process.env["CORREDORA_DEBUG"] || "0") > 0,
          describe: "Print debug messages.",
        })
    )
    .help().argv;
