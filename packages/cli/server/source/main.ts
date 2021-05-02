import { handleError } from "./utils/error";
import { getArguments } from "./utils/arguments";
import { startServer } from "./server";

const main = async () => {
  const args = getArguments();

  startServer(args.port);
};

main().catch(handleError);
