import { CorredoraLogger } from "corredora";

const logger = new CorredoraLogger();

logger.info("Hey there!");
logger.error(new Error("This is bad code"));
logger.info(
  "Loaded 0 modules, but I am going to act I loaded all the modules."
);
logger.info({ numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

// @ts-expect-error
logger.info({ ...JSON.parse(JSON.stringify(process)) });
