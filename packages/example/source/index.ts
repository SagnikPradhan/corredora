import { CorredoraLogger } from "corredora";

const loggerA = new CorredoraLogger();
const loggerB = new CorredoraLogger();

loggerA.log("Hey there B!");
loggerB.log("Hey there A!");
