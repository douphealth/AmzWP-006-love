const IS_DEV = import.meta.env.DEV;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const NOOP = () => {};

const createLogger = (namespace: string) => {
  const prefix = `[${namespace}]`;

  return {
    debug: IS_DEV ? (...args: unknown[]) => console.debug(prefix, ...args) : NOOP,
    info: IS_DEV ? (...args: unknown[]) => console.info(prefix, ...args) : NOOP,
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
  };
};

export { createLogger };
export type { LogLevel };
