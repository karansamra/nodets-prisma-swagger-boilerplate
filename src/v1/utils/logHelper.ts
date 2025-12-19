/**
 * Log Helper Utilities
 * Convenience functions for request-based logging
 *
 * These helpers simplify logging in Express.js request handlers by:
 * 1. Automatically extracting common request metadata (IP, method, path, etc.)
 * 2. Including requestId for request tracing
 * 3. Providing consistent context structure
 * 4. Reducing boilerplate code in controllers
 *
 * Usage:
 * ```typescript
 * import { logInfo, logError } from '@src/v1/utils/logHelper';
 *
 * // In a controller
 * logInfo(req, 'User created successfully', { userId: user.id });
 * logError(req, 'Failed to create user', error, { email: user.email });
 * ```
 */

import logger from './logging';
import { Request } from 'express';

/**
 * Logs an informational message with request context
 *
 * Automatically includes:
 * - requestId: Unique identifier for the request (if set in middleware)
 * - ip: Client IP address
 * - userAgent: Client user agent string
 * - method: HTTP method (GET, POST, PUT, DELETE, etc.)
 * - path: Request path/endpoint
 *
 * Additional context can be provided via the extra parameter.
 *
 * @param req - Express request object
 * @param message - Log message
 * @param extra - Additional context to include in the log
 *
 * @example
 * logInfo(req, 'User authenticated', { userId: '123', role: 'admin' });
 */
export const logInfo = (req: Request, message: string, extra: object = {}) => {
  logger.info(message, {
    requestId: (req as any).requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    ...extra,
  });
};

/**
 * Logs an error message with request context and error details
 *
 * Automatically includes:
 * - requestId: Unique identifier for the request
 * - ip: Client IP address
 * - userAgent: Client user agent string
 * - method: HTTP method
 * - path: Request path
 * - errorCode: Error code from the error object (if present)
 *
 * The error object is logged with full details (name, message, stack).
 * Additional context can be provided via the extra parameter.
 *
 * @param req - Express request object
 * @param message - Log message describing the error
 * @param error - Error object (optional, can be Error instance or plain object)
 * @param extra - Additional context to include in the log
 *
 * @example
 * try {
 *   await createUser(data);
 * } catch (error) {
 *   logError(req, 'Failed to create user', error, { email: data.email });
 * }
 */
export const logError = (
  req: Request,
  message: string,
  error: any = {},
  extra: object = {}
) => {
  // Convert plain object to Error if needed
  const errorObj = error instanceof Error ? error : new Error(String(error));

  logger.error(message, errorObj, {
    requestId: (req as any).requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    errorCode: error?.code,
    ...extra,
  });
};

/**
 * Logs a warning message with request context
 *
 * Automatically includes:
 * - requestId: Unique identifier for the request
 * - ip: Client IP address
 * - userAgent: Client user agent string
 * - method: HTTP method
 * - path: Request path
 *
 * Additional context can be provided via the extra parameter.
 *
 * @param req - Express request object
 * @param message - Log message
 * @param extra - Additional context to include in the log
 *
 * @example
 * logWarn(req, 'Rate limit approaching', { remainingRequests: 5 });
 */
export const logWarn = (req: Request, message: string, extra: object = {}) => {
  logger.warn(message, {
    requestId: (req as any).requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    ...extra,
  });
};

/**
 * Logs a debug message with request context
 *
 * Automatically includes:
 * - requestId: Unique identifier for the request
 * - ip: Client IP address
 * - userAgent: Client user agent string
 * - method: HTTP method
 * - path: Request path
 *
 * Additional context can be provided via the extra parameter.
 *
 * Note: Debug logs are typically only enabled in development.
 *
 * @param req - Express request object
 * @param message - Log message
 * @param extra - Additional context to include in the log
 *
 * @example
 * logDebug(req, 'Processing request', { queryParams: req.query });
 */
export const logDebug = (req: Request, message: string, extra: object = {}) => {
  logger.debug(message, {
    requestId: (req as any).requestId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    ...extra,
  });
};
