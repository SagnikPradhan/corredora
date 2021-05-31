import { CorredoraLogger } from "corredora";

const logger = new CorredoraLogger();

logger.info("Hey there!");

logger.error(new Error("This is bad code"));

logger.debug(
  "Loaded 0 modules, but I am going to act I loaded all the modules."
);

logger.warn("This is a warning, you better take it seriously.");

logger.info({
  object: {
    anotherObject: {
      anotherAnotherObject: { someArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    },
  },

  array: ["String", "Another String", "Another Another String"],

  boolean: false,
  anotherBoolean: true,

  arrayOfObjects: [
    { someProperty: "Some properties value" },
    { someAnotherPropertyThatIsABooleanWithLongName: false },
  ],
});
