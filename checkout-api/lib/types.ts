export type ServiceOptions = {
  LOG_LEVEL?: string;
  CORS_ALLOW_HEADERS?: string;
  CORS_ALLOW_METHODS?: string;
  CORS_ALLOW_ORIGINS?: string;
  CORS_EXPOSE_HEADERS?: string;
  CORS_ORIGIN?: string;
  JWT_SECRETS: string;
  JWT_AUDIENCE?: string;
  process?: NodeJS.Process;
};

interface LogFn {
  (msg: string, ...args: any[]): void;
  (obj: object, msg?: string, ...args: any[]): void;
}

type Logger = import("pino").BaseLogger & { [key: string]: LogFn };

declare module "koa" {
  interface BaseContext {
    log: Logger;
  }
}

declare module "pino" {
  interface BaseLogger {
    event: LogFn;
  }
}
