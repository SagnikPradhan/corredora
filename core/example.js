const { logger } = require("./dist/index");

const main = async () => {
  const root = await logger();

  root.info("Hey there");
  root.debug(process);
  root.error(new Error("Oh shit"));
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
