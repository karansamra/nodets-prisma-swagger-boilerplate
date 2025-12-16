/**
 * Logger Instance Export
 * Public interface for logging across the application
 *
 * This module exports a pre-configured logger instance that's ready to use.
 * The logger is initialized with environment-based configuration and provides
 * a simple, consistent API for logging throughout the application.
 *
 * Usage:
 * ```typescript
 * import logger from '@src/v1/utils/logging';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to process request', error, { requestId: 'req-456' });
 * ```
 */

import { getLoggingConfig } from '../../config/logging';
import { createLogger, pruneOldLogs } from './logger';
import { LogContext, Logger } from './types';

const config = getLoggingConfig();
const pinoLogger = createLogger(config);

/**
 * Prune old log files based on retention configuration
 *
 * This runs automatically on module load to clean up old log files
 * and manage disk space. Files older than rotationDays are deleted.
 */
pruneOldLogs(config.service, config.rotationDays);

/**
 * Ensure logs directory exists
 *
 * Creates the ./logs directory if it doesn't exist.
 * This ensures log files can be written even if the directory
 * wasn't created during application setup.
 */
import * as fs from 'fs';
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs', { recursive: true });
}

/**
 * Logger wrapper to provide consistent interface
 *
 * This wrapper provides a clean, simple API that:
 * 1. Hides Pino's internal structure
 * 2. Provides consistent method signatures
 * 3. Handles error objects properly
 * 4. Maintains type safety
 *
 * All methods accept a message string and optional context.
 * Error and fatal methods can also accept an Error object.
 */
export const logger: Logger = {
  /**
   * Debug level logging
   *
   * Use for detailed diagnostic information during development.
   * Typically disabled in production.
   *
   * @param message - Log message
   * @param context - Optional contextual metadata (requestId, userId, etc.)
   */
  debug: (message: string, context?: LogContext) => {
    pinoLogger.debug({ context }, message);
  },

  /**
   * Info level logging
   *
   * Use for general informational messages about application flow.
   * Examples: user actions, successful operations, state changes.
   *
   * @param message - Log message
   * @param context - Optional contextual metadata
   */
  info: (message: string, context?: LogContext) => {
    pinoLogger.info({ context }, message);
  },

  /**
   * Warn level logging
   *
   * Use for warning messages about potentially problematic situations
   * that don't prevent the application from functioning.
   * Examples: deprecated API usage, rate limit approaching, retry attempts.
   *
   * @param message - Log message
   * @param context - Optional contextual metadata
   */
  warn: (message: string, context?: LogContext) => {
    pinoLogger.warn({ context }, message);
  },

  /**
   * Error level logging
   *
   * Use for error messages about failures that don't stop the application.
   * Examples: failed API calls, validation errors, business logic errors.
   *
   * @param message - Log message describing the error
   * @param error - Optional Error object with stack trace and details
   * @param context - Optional contextual metadata
   */
  error: (message: string, error?: Error, context?: LogContext) => {
    if (error) {
      // Log error with full details (name, message, stack, code)
      pinoLogger.error(
        {
          context,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: (error as any).code,
          },
        },
        message
      );
    } else {
      // Log error message without Error object
      pinoLogger.error({ context }, message);
    }
  },

  /**
   * Fatal level logging
   *
   * Use for critical errors that may cause the application to abort.
   * Examples: unhandled exceptions, database connection failures,
   * critical system errors that require immediate attention.
   *
   * @param message - Log message describing the fatal error
   * @param error - Optional Error object with stack trace and details
   * @param context - Optional contextual metadata
   */
  fatal: (message: string, error?: Error, context?: LogContext) => {
    if (error) {
      // Log fatal error with full details
      pinoLogger.fatal(
        {
          context,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: (error as any).code,
          },
        },
        message
      );
    } else {
      // Log fatal message without Error object
      pinoLogger.fatal({ context }, message);
    }
  },
};

/**
 * Default export for convenience
 *
 * Allows importing as:
 * ```typescript
 * import logger from '@src/v1/utils/logging';
 * ```
 */
export default logger;
