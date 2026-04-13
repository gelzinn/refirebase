const PREFIX = "🔥 [Refirebase]";

/**
 * Logger utility for Refirebase
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.info(`${PREFIX} ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`${PREFIX} ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`${PREFIX} ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (
      typeof process !== "undefined" &&
      (process.env.NODE_ENV === "development" || process.env.DEBUG === "true")
    ) {
      console.debug(`${PREFIX} ${message}`, ...args);
    }
  },
};
