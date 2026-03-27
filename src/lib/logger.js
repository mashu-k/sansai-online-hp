const isDev = process.env.NODE_ENV !== "production";

export const logger = {
  warn: (...args) => isDev && console.warn(...args),
  error: (...args) => isDev && console.error(...args),
  info: (...args) => isDev && console.info(...args),
};
