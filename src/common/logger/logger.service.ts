import { Injectable, Scope, LoggerService as LoggerBase } from '@nestjs/common';
import { FastifyBaseLogger } from 'fastify';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements LoggerBase {
  constructor(private readonly logger: FastifyBaseLogger) {}

  public log(message?: any, context?: string) {
    if (context) {
      this.logger.info({ context }, message);
    } else {
      this.logger.info(message);
    }
  }

  public error(message?: any, context?: string) {
    if (context) {
      this.logger.error({ context }, message);
    } else {
      this.logger.error(message);
    }
  }

  public warn(message?: any, context?: string) {
    if (context) {
      this.logger.warn({ context }, message);
    } else {
      this.logger.warn(message);
    }
  }

  public debug(message?: any, context?: string) {
    if (context) {
      this.logger.debug({ context }, message);
    } else {
      this.logger.debug(message);
    }
  }

  public verbose(message?: any, context?: string) {
    if (context) {
      this.logger.trace({ context }, message);
    } else {
      this.logger.trace(message);
    }
  }
}
