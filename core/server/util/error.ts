export class CorredoraError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;
  public readonly cause?: Error;
  public readonly additionalProps: { [additionalProps: string]: unknown };

  constructor({
    name,
    message,
    isOperational,
    cause,
    ...additionalProps
  }: {
    name: string;
    message: string;
    isOperational: boolean;
    cause?: Error;
    [additionalProps: string]: unknown;
  }) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.isOperational = isOperational;
    this.cause = cause;
    this.additionalProps = additionalProps;

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export function handleError(error: Error) {
  console.error(error);

  if (error instanceof CorredoraError && error.isOperational) return;
  else process.exit(1);
}

export function handleAsync<T extends unknown[]>(
  asyncFunction: (...args: T) => Promise<void>
) {
  return (...args: T) => {
    asyncFunction(...(args || [])).catch(handleError);
  };
}
