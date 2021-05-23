import { CorredoraLogger } from "@corredora/logger";

const main = async () => {
  const logger = new CorredoraLogger();

  logger.log("Hey there how you doing?");
  logger.log("I hope you are doing good!");
};

main();
