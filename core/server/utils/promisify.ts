export function promisify<
  Parameter extends unknown,
  ReturnValue extends unknown
>(
  fn: (
    parameter: Parameter,
    callback: (error?: Error | null, value?: ReturnValue) => void
  ) => void,
  context?: unknown
) {
  return (parameter: Parameter) =>
    new Promise<ReturnValue>((resolve, reject) => {
      const bindedFunction = context ? fn.bind(context) : fn;

      bindedFunction(parameter, (error, value) => {
        if (error) reject(error);
        else resolve(value as ReturnValue);
      });
    });
}
