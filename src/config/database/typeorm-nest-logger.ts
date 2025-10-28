/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger as NestLogger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

function formatParams(parameters?: any[]) {
  if (!parameters?.length) return '';
  try {
    return ` PARAMETERS: ${JSON.stringify(parameters)}`;
  } catch {
    return ` PARAMETERS: ${parameters}`;
  }
}

export class TypeOrmNestLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('TypeORM');

  logQuery(query: string, parameters?: any[], _qr?: QueryRunner) {
    this.logger.log(`query: ${query}${formatParams(parameters)}`);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _qr?: QueryRunner,
  ) {
    const message =
      typeof error === 'string' ? error : error?.message || 'Query error';
    this.logger.error(
      `query failed: ${query}${formatParams(parameters)} => ${message}`,
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    _qr?: QueryRunner,
  ) {
    this.logger.warn(
      `slow query (${time} ms): ${query}${formatParams(parameters)}`,
    );
  }

  logSchemaBuild(message: string, _qr?: QueryRunner) {
    this.logger.log(`schema build: ${message}`);
  }

  logMigration(message: string, _qr?: QueryRunner) {
    this.logger.log(`migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, _qr?: QueryRunner) {
    if (level === 'warn') return this.logger.warn(message);
    // Map 'info' and 'log' to Nest log level
    return this.logger.log(message);
  }
}
