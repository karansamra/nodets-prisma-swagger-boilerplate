/**
 * Logger Types
 * TypeScript interfaces and types for the logging system
 *
 * These types ensure type safety across the logging infrastructure
 * and provide clear contracts for log data structures.
 */

/**
 * Log Context Interface
 *
 * Additional metadata that can be attached to log entries.
 * Used to provide contextual information about the operation being logged.
 *
 * @property {string} userId - ID of the user performing the action
 * @property {string} requestId - Unique identifier for the request (for tracing)
 * @property {string} ip - IP address of the client
 * @property {string} method - HTTP method (GET, POST, etc.)
 * @property {string} path - Request path/endpoint
 * @property {string} userAgent - Client user agent string
 * @property {string} sessionId - Session identifier
 * @property {string} email - User email (will be redacted if redaction is enabled)
 * @property {any} [key: string] - Additional custom context fields
 */
export interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  method?: string;
  path?: string;
  userAgent?: string;
  sessionId?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Log Entry Interface
 *
 * Structure of a complete log entry as it appears in log files.
 * This represents the serialized form of a log message.
 *
 * @property {string} timestamp - ISO timestamp of when the log was created
 * @property {string} level - Log level (debug, info, warn, error, fatal)
 * @property {string} service - Name of the service generating the log
 * @property {string} env - Environment name (development, production, etc.)
 * @property {string} message - Human-readable log message
 * @property {LogContext} [context] - Optional contextual metadata
 * @property {object} [error] - Optional error details (if logging an error)
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  service: string;
  env: string;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Logger Interface
 *
 * Public API for logging operations.
 * Provides methods for different log levels with consistent signatures.
 *
 * All methods accept a message string and optional context.
 * Error and fatal methods can also accept an Error object for detailed error logging.
 */
export interface Logger {
  /**
   * Debug level logging
   * Used for detailed diagnostic information, typically only in development
   * @param message - Log message
   * @param context - Optional contextual metadata
   */
  debug: (message: string, context?: LogContext) => void;

  /**
   * Info level logging
   * Used for general informational messages about application flow
   * @param message - Log message
   * @param context - Optional contextual metadata
   */
  info: (message: string, context?: LogContext) => void;

  /**
   * Warn level logging
   * Used for warning messages about potentially problematic situations
   * @param message - Log message
   * @param context - Optional contextual metadata
   */
  warn: (message: string, context?: LogContext) => void;

  /**
   * Error level logging
   * Used for error messages about failures that don't stop the application
   * @param message - Log message
   * @param error - Optional Error object with stack trace and details
   * @param context - Optional contextual metadata
   */
  error: (message: string, error?: Error, context?: LogContext) => void;

  /**
   * Fatal level logging
   * Used for critical errors that may cause the application to abort
   * @param message - Log message
   * @param error - Optional Error object with stack trace and details
   * @param context - Optional contextual metadata
   */
  fatal: (message: string, error?: Error, context?: LogContext) => void;
}

/**
 * Logger Configuration Interface
 *
 * Configuration object used to initialize the logger.
 * Determines behavior, output destinations, and retention policies.
 *
 * @property {string} level - Minimum log level (debug, info, warn, error, fatal)
 * @property {string} transport - Output destination(s): 'console', 'file', 'both', or 'console,file'
 * @property {string} service - Service name (used in log files and metadata)
 * @property {string} environment - Environment name (development, production, etc.)
 * @property {number} rotationDays - Number of days to keep log files before deletion
 * @property {boolean} enableRedaction - Whether to redact sensitive data from logs
 */
export interface LoggerConfig {
  level: string;
  transport: 'console' | 'file' | 'both' | 'console,file';
  service: string;
  environment: string;
  rotationDays: number;
  enableRedaction: boolean;
}
