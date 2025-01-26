import { Injectable, Scope, LoggerService as LoggerBase } from '@nestjs/common';
import { FastifyBaseLogger } from 'fastify';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements LoggerBase {
  constructor(private readonly logger: FastifyBaseLogger) {}

  private formatMessage(message: any, context?: string): string {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;
    return context ? `${formattedMessage}` : formattedMessage;
  }

  log(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.info({ context }, formattedMessage);
  }

  error(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.error({ context }, formattedMessage);
  }

  warn(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.warn({ context }, formattedMessage);
  }

  debug(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.debug({ context }, formattedMessage);
  }

  verbose(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, context);
    this.logger.trace({ context }, formattedMessage);
  }
}
