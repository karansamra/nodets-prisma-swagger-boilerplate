/**
 * Logger Implementation
 * Factory and stream creation for Pino logger
 *
 * This module implements a production-ready logging system using Pino,
 * a fast JSON logger for Node.js. It provides:
 * - Multiple output destinations (console, file, or both)
 * - Human-readable log formatting
 * - Automatic log file rotation (daily)
 * - Sensitive data redaction
 * - Log retention management
 *
 * Architecture:
 * 1. Custom streams transform Pino's JSON output into readable formats
 * 2. File stream writes to daily log files in ./logs directory
 * 3. Console stream formats output for development readability
 * 4. Pino's multistream allows multiple destinations simultaneously
 */

import commonConfig from '../../config/common';
import { LoggerConfig } from './types';
import * as fs from 'fs';
import * as path from 'path';
import pino from 'pino';

/**
 * ------------------------------------------------------------
 * How log filtering works (Pino) + how *this repo* config maps to it
 * ------------------------------------------------------------
 *
 * Pino assigns each level a numeric severity:
 *   trace=10, debug=20, info=30, warn=40, error=50, fatal=60, silent=Infinity
 *
 * The configured LOG_LEVEL sets a threshold. A log line is emitted only if:
 *   levelValue >= threshold
 *
 * Example: LOG_LEVEL=info => threshold=30
 * - debug(20)  -> 20 < 30  -> skipped
 * - info(30)   -> 30 >= 30 -> emitted
 * - error(50)  -> 50 >= 30 -> emitted
 *
 * In our project, NODE_ENV chooses sensible defaults in `src/v1/config/logging.ts`
 * (you can still override with LOG_LEVEL / LOG_TRANSPORT in `.env`):
 *
 * Development / Local (NODE_ENV=development or local)
 * - Default LOG_LEVEL=debug  => threshold 20
 * - Default LOG_TRANSPORT=console
 * - Result:
 *   - trace(10) skipped
 *   - debug(20) shown
 *   - info(30) shown
 *   - warn/error/fatal shown
 * - If LOG_TRANSPORT=console,file => same allowed logs go to both console + ./logs/...
 *
 * QA / Staging (NODE_ENV=qa or staging)
 * - Default LOG_LEVEL=info   => threshold 30
 * - Default LOG_TRANSPORT=console,file
 * - Result:
 *   - trace(10) skipped
 *   - debug(20) skipped
 *   - info(30) shown
 *   - warn/error/fatal shown
 * - Logs go to both console + ./logs/...
 *
 * Production (NODE_ENV=production)
 * - Default LOG_LEVEL=error  => threshold 50
 * - Default LOG_TRANSPORT=file
 * - Result:
 *   - trace/debug/info/warn skipped
 *   - error/fatal written
 * - File-only unless you override LOG_TRANSPORT.
 *
 * NOTE: "./logs" is relative to process.cwd() (where you start the node process),
 * not relative to this file’s directory.
 */

/**
 * Creates a custom file stream for readable logging
 *
 * This function creates a write stream that:
 * 1. Creates a ./logs directory if it doesn't exist
 * 2. Opens a file for appending (creates if new)
 * 3. Adds a session header for new log files
 * 4. Transforms Pino's JSON logs into human-readable format
 *
 * Log format in files:
 * [TIMESTAMP] [LEVEL] MESSAGE
 * CONTEXT: { ... }
 * ERROR: { ... } (if error present)
 * ---
 *
 * @param {string} filename - Name of the log file (e.g., 'service-2024-01-15.log')
 * @returns {object} Stream object with a write method
 */
const createFileStream = (filename: string) => {
  const logsDir = './logs';

  // Ensure logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const filepath = path.join(logsDir, filename);
  const stream = fs.createWriteStream(filepath, { flags: 'a' });

  // Check if file is empty (new file) to add session header
  // This helps identify when a new logging session started
  let isNewFile = false;
  try {
    const stats = fs.statSync(filepath);
    isNewFile = stats.size === 0;
  } catch (error) {
    // File doesn't exist yet, it will be created by the write stream
    isNewFile = true;
  }

  // Add session header for new log files
  if (isNewFile) {
    stream.write(
      `\n=== LOG SESSION STARTED: ${new Date().toISOString()} ===\n\n`
    );
  }

  /**
   * Write method that transforms JSON logs into readable format
   *
   * Pino outputs logs as JSON strings. This method:
   * 1. Parses the JSON log entry
   * 2. Extracts key fields (timestamp, level, message, context, error)
   * 3. Formats them in a human-readable structure
   * 4. Writes to the file with clear separators
   */
  return {
    write: (data: string) => {
      try {
        // Parse Pino's JSON log output
        const log = JSON.parse(data);
        const timestamp = log.timestamp || log.time;
        const level = log.level.toUpperCase();
        const message = log.message || log.msg;
        const context = log.context;
        const error = log.error;

        // Format with clear separators and readable structure
        stream.write(`\n[${timestamp}] [${level}] ${message}\n`);

        // Add context if present (requestId, userId, etc.)
        if (context && Object.keys(context).length > 0) {
          stream.write(`CONTEXT: ${JSON.stringify(context, null, 2)}\n`);
        }

        // Add error details if present (stack trace, error code, etc.)
        if (error) {
          stream.write(`ERROR: ${JSON.stringify(error, null, 2)}\n`);
        }

        // Separator for visual clarity
        stream.write(`---\n`);
      } catch (parseError) {
        // Fallback: write raw data if parsing fails
        stream.write(`\n[RAW LOG] ${data}\n---\n`);
      }
    },
  };
};

/**
 * Creates a custom console stream for development-friendly output
 *
 * This function creates a stream that:
 * 1. Parses Pino's JSON log output
 * 2. Formats it as a structured JSON object
 * 3. Outputs to console with log level prefix
 *
 * Console format:
 * [LEVEL] {
 *   "timestamp": "...",
 *   "level": "...",
 *   "service": "...",
 *   "env": "...",
 *   "message": "...",
 *   "context": { ... },
 *   "error": { ... }
 * }
 *
 * @returns {object} Stream object with a write method
 */
const createConsoleStream = () => {
  return {
    write: (data: string) => {
      try {
        // Parse Pino's JSON log output
        const log = JSON.parse(data);
        const level = log.level.toUpperCase();
        const message = log.message || log.msg;
        const context = log.context;
        const error = log.error;

        // Format like original: [INFO] { ... }
        // This provides a clean, structured output for developers
        const logEntry = {
          timestamp: log.timestamp || log.time,
          level: log.level,
          service: log.service,
          env: log.env,
          message: message,
          context: context,
          error: error,
        };

        // Output formatted log to console
        console.log(`[${level}] ${JSON.stringify(logEntry, null, 2)}`);
      } catch (error) {
        // Fallback: output raw data if parsing fails
        console.log(data);
      }
    },
  };
};

/**
 * Creates a configured Pino logger instance
 *
 * This is the main factory function that:
 * 1. Parses transport configuration (console, file, both)
 * 2. Creates appropriate streams based on configuration
 * 3. Configures Pino with log level, base metadata, and redaction rules
 * 4. Returns a Pino logger instance using multistream for multiple destinations
 *
 * Log Level Hierarchy:
 * - debug: Most verbose, shows all logs
 * - info: General information (excludes debug)
 * - warn: Warnings and above (excludes debug, info)
 * - error: Errors and fatal only
 * - fatal: Only fatal errors
 *
 * @param {LoggerConfig} config - Logger configuration object
 * @returns {pino.Logger} Configured Pino logger instance
 *
 * @example
 * const logger = createLogger({
 *   level: 'info',
 *   transport: 'both',
 *   service: 'my-service',
 *   environment: 'production',
 *   rotationDays: 7,
 *   enableRedaction: true
 * });
 */
export const createLogger = (config: LoggerConfig): pino.Logger => {
  const streams: pino.StreamEntry[] = [];

  /**
   * Parse transport configuration
   * Supports: 'console', 'file', 'both', or 'console,file'
   * This allows flexible output destination configuration
   */
  const transports = config.transport.split(',').map((t) => t.trim());
  const hasConsole = transports.includes('console');
  const hasFile = transports.includes('file');
  const hasBoth = config.transport === 'both';

  // Console stream - for development and immediate feedback
  if (hasConsole || hasBoth) {
    streams.push({
      level: config.level as pino.Level,
      stream: createConsoleStream(),
    });
  }

  // File stream with simple rotation - for persistence and analysis
  if (hasFile || hasBoth) {
    // Daily rotation: create a new file each day
    // Format: service-YYYY-MM-DD.log (e.g., 'my-service-2024-01-15.log')
    const today = new Date().toISOString().split('T')[0];
    const filename = `${config.service}-${today}.log`;

    streams.push({
      level: config.level as pino.Level,
      stream: createFileStream(filename),
    });
  }

  /**
   * Pino logger configuration
   *
   * base: Metadata added to every log entry
   *   - service: Service name for identification
   *   - env: Environment name (development, production, etc.)
   *   - version: Application version from package.json
   *
   * timestamp: ISO 8601 format timestamps
   *
   * formatters: Custom formatting for log levels
   */
  const loggerConfig: pino.LoggerOptions = {
    // Pino automatically filters logs based on level
    // Level hierarchy: debug < info < warn < error < fatal
    // Setting to 'debug' shows all, 'info' shows INFO+, 'error' shows ERROR only
    level: config.level,
    base: {
      service: config.service,
      env: config.environment,
      version: process.env.npm_package_version || '1.0.0',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  };

  /**
   * Add redaction for production and development security
   *
   * Redaction prevents sensitive data from appearing in logs:
   * - Passwords, tokens, API keys
   * - Personal information (emails, phone numbers)
   * - Financial data (card numbers, CVV)
   * - Authentication headers
   *
   * Redacted values are replaced with '[REDACTED]' string.
   *
   * Paths use dot notation (e.g., 'user.password') and support wildcards
   * (e.g., '*.password' matches password in any nested object).
   */
  if (config.enableRedaction) {
    loggerConfig.redact = {
      paths: [
        // HTTP headers
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',

        // User data
        'user.password',
        'user.token',
        'user.apiKey',
        'user.email',
        'user.phone',
        'user.phoneNumber',

        // Data payload
        'data.password',
        'data.token',
        'data.apiKey',
        'data.api_key',
        'data.secret',
        'data.email',
        'data.phone',
        'data.phoneNumber',
        'data.cvv',
        'data.card',
        'data.cardNumber',
        'data.card_number',
        'data.bank',
        'data.account',

        // Context
        'context.password',
        'context.token',
        'context.apiKey',
        'context.email',
        'context.phone',
        'context.phoneNumber',

        // Request/Response data
        'req.body.password',
        'req.body.token',
        'req.body.apiKey',
        'req.body.cvv',
        'req.body.card',
        'req.body.cardNumber',
        'req.query.token',
        'req.query.apiKey',
        'req.params.token',

        // Generic fields (top-level)
        'email',
        'password',
        'token',
        'jwt',
        'session_jwt',
        'apiKey',
        'userId',
        'user_id',
        'credentialId',
        'credential_id',

        // Context extras
        'context.methodId',
        'context.method_id',
        'context.otp',
        'context.code',
        'context.userId',
        'context.user_id',
        'context.credentialId',
        'context.credential_id',

        // Wildcard patterns for nested objects
        // These match the field in any nested object structure
        '*.email',
        '*.password',
        '*.token',
        '*.jwt',
        '*.apiKey',
        '*.api_key',
        '*.secret',
        '*.cvv',
        '*.cardNumber',
        '*.card_number',
        '*.authorization',
        '*.sessionJwt',
        '*.session_jwt',
        '*.accessToken',
        '*.access_token',
        '*.refreshToken',
        '*.refresh_token',
        '*.privateKey',
        '*.private_key',
        '*.secretKey',
        '*.secret_key',
        '*.methodId',
        '*.method_id',
        '*.userId',
        '*.user_id',
        '*.credentialId',
        '*.credential_id',
      ],
      censor: '[REDACTED]',
    };
  }

  /**
   * Use Pino's built-in multistream support (available in Pino v7+)
   *
   * Multistream allows writing to multiple destinations simultaneously:
   * - Console for development
   * - File for persistence
   * - Both for comprehensive logging
   *
   * Each stream can have its own log level, but typically they share
   * the same level for consistency.
   */
  return pino(loggerConfig, pino.multistream(streams));
};

export default createLogger;

/**
 * Utility function to prune old log files
 *
 * This function automatically deletes log files older than the retention period.
 * It's called during logger initialization to manage disk space.
 *
 * How it works:
 * 1. Scans the ./logs directory
 * 2. Identifies log files matching the service prefix (e.g., 'my-service-*.log')
 * 3. Extracts the date from the filename (format: service-YYYY-MM-DD.log)
 * 4. Compares file date with cutoff date (now - retention days)
 * 5. Deletes files older than the retention period
 *
 * @param {string} service - Service name (used to identify log files)
 * @param {number} keepDays - Number of days to keep log files (retention period)
 *
 * @example
 * // Keep logs for 7 days, delete older files
 * pruneOldLogs('my-service', 7);
 */
export function pruneOldLogs(service: string, keepDays: number): void {
  try {
    // Skip if retention is disabled or invalid
    if (!keepDays || keepDays <= 0) return;

    const dir = './logs';
    if (!fs.existsSync(dir)) return;

    // Calculate cutoff timestamp (files older than this will be deleted)
    const cutoff = Date.now() - keepDays * commonConfig.MILLISECONDS_PER_DAY;
    const prefix = `${service}-`;
    const ext = '.log';

    // Iterate through log files in the directory
    for (const file of fs.readdirSync(dir)) {
      // Only process files matching our service prefix and .log extension
      if (!file.startsWith(prefix) || !file.endsWith(ext)) continue;

      // Extract date from filename (format: service-YYYY-MM-DD.log)
      const datePart = file.slice(prefix.length, file.length - ext.length);

      // Parse date and convert to timestamp
      const ts = Date.parse(`${datePart}T00:00:00Z`);

      // Delete file if it's older than the cutoff date
      if (Number.isFinite(ts) && ts < cutoff) {
        try {
          fs.unlinkSync(path.join(dir, file));
        } catch {
          // Silently ignore deletion errors (file might be locked or already deleted)
        }
      }
    }
  } catch {
    // Silently ignore errors (directory might not exist, permissions, etc.)
  }
}
