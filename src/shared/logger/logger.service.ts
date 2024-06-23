import { Injectable, Scope, LoggerService as LoggerBase } from '@nestjs/common';
import pino from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements LoggerBase {
  private logger: pino.Logger;

  constructor() {
    this.configureLogger();
  }

  private configureLogger() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  private formatMessage(message: string, context?: string): string {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;
    return context ? `${formattedMessage} [${context}]` : formattedMessage;
  }

  public log(message: string, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  public error(message: string, trace: string = '', context?: string) {
    this.logger.error({ trace }, this.formatMessage(message, context));
  }

  public warn(message: string, context?: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  public debug(message: string, context?: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  public verbose(message: string, context?: string) {
    this.logger.trace(this.formatMessage(message, context));
  }
}
