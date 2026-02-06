import { injectable } from 'inversify';

const IS_DEV = import.meta.env.DEV;

export interface ILoggerService {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

@injectable()
export class PinoLoggerService implements ILoggerService {
  debug(message: string, meta?: Record<string, unknown>): void {
    if (IS_DEV) console.debug(`[DEBUG] ${message}`, meta ?? '');
  }

  info(message: string, meta?: Record<string, unknown>): void {
    if (IS_DEV) console.info(`[INFO] ${message}`, meta ?? '');
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, meta ?? '');
  }

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, meta ?? '');
  }
}
