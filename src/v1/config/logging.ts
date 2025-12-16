/**
 * Logging Configuration
 * Environment-based logging settings that adapt based on NODE_ENV
 *
 * This module provides centralized logging configuration that changes
 * behavior based on the environment (development, qa, staging, production).
 * Each environment has different log levels, transport methods, and retention policies.
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { LoggerConfig } from '../utils/logging/types';

/**
 * NOTE ABOUT "LOG LEVEL" vs "LOG TRANSPORT"
 *
 * - LOG_LEVEL controls *verbosity* (which messages are allowed through):
 *   trace < debug < info < warn < error < fatal
 *   (plus: silent => logs nothing)
 *
 * - LOG_TRANSPORT controls *where* logs go:
 *   - console        => only stdout/stderr
 *   - file           => only ./logs/<service>-YYYY-MM-DD.log
 *   - console,file   => both console and file
 *   - both           => same as console+file (supported by our logger factory)
 *
 * Common mistake: setting LOG_LEVEL=file. That will crash Pino because "file"
 * is not a valid level. We guard against that with sanitizeLogLevel().
 */
const ALLOWED_LOG_LEVELS = new Set([
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
]);

function sanitizeLogLevel(raw: unknown, fallback: string): string {
  const level = String(raw || '')
    .trim()
    .toLowerCase();
  if (ALLOWED_LOG_LEVELS.has(level)) return level;
  return fallback;
}

/**
 * Retrieves logging configuration based on the current environment
 *
 * Configuration is determined by:
 * 1. NODE_ENV environment variable (development, local, qa, staging, production)
 * 2. Environment-specific overrides via LOG_LEVEL, LOG_TRANSPORT, LOG_ROTATION_DAYS
 * 3. Service name from LOG_SERVICE_NAME (defaults to 'nodets-boilerplate')
 *
 * @returns {LoggerConfig} Complete logging configuration object
 *
 * @example
 * // Development: Logs everything to console
 * // Production: Only errors to file, 14-day retention
 */
export const getLoggingConfig = (): LoggerConfig => {
  const environment = process.env.NODE_ENV || 'development';
  const serviceName = process.env.LOG_SERVICE_NAME || 'nodets-boilerplate';
  const envLogLevel = process.env.LOG_LEVEL;

  /**
   * Environment-specific configurations
   *
   * Each environment has:
   * - level: Minimum log level to record (debug < info < warn < error < fatal)
   * - transport: Where logs are sent ('console', 'file', 'both', or 'console,file')
   * - rotationDays: How many days to keep log files before deletion
   * - enableRedaction: Whether to redact sensitive data (passwords, tokens, etc.)
   */
  const configs: Record<string, Partial<LoggerConfig>> = {
    /**
     * Development Environment
     * - Logs everything (debug level and above)
     * - Outputs to console for easy debugging
     * - Keeps logs for 3 days
     * - Redacts sensitive data for security
     */
    development: {
      level: sanitizeLogLevel(envLogLevel, 'debug'),
      transport: (process.env.LOG_TRANSPORT as any) || 'console',
      rotationDays: parseInt(process.env.LOG_ROTATION_DAYS || '3'),
      enableRedaction: true,
    },
    /**
     * Local Environment
     * - Similar to development, optimized for local development
     * - Console output for immediate feedback
     * - Short retention period
     */
    local: {
      level: sanitizeLogLevel(envLogLevel, 'debug'),
      transport: (process.env.LOG_TRANSPORT as any) || 'console',
      rotationDays: parseInt(process.env.LOG_ROTATION_DAYS || '3'),
      enableRedaction: true,
    },
    /**
     * QA Environment
     * - Info level and above (excludes debug logs)
     * - Logs to both console and file for analysis
     * - 7-day retention for testing cycles
     */
    qa: {
      level: sanitizeLogLevel(envLogLevel, 'info'),
      transport: (process.env.LOG_TRANSPORT as any) || 'console,file',
      rotationDays: parseInt(process.env.LOG_ROTATION_DAYS || '7'),
      enableRedaction: true,
    },
    /**
     * Staging Environment
     * - Info level and above
     * - Logs to both console and file
     * - 7-day retention
     */
    staging: {
      level: sanitizeLogLevel(envLogLevel, 'info'),
      transport: (process.env.LOG_TRANSPORT as any) || 'console,file',
      rotationDays: parseInt(process.env.LOG_ROTATION_DAYS || '7'),
      enableRedaction: true,
    },
    /**
     * Production Environment
     * - Only errors and fatal logs (minimal logging)
     * - File-only logging (no console output)
     * - 14-day retention for compliance and debugging
     * - Redaction enabled for security
     */
    production: {
      level: sanitizeLogLevel(envLogLevel, 'error'),
      transport: (process.env.LOG_TRANSPORT as any) || 'file',
      rotationDays: parseInt(process.env.LOG_ROTATION_DAYS || '14'),
      enableRedaction: true,
    },
  };

  // Get configuration for current environment, fallback to development
  const envConfig = configs[environment] || configs.development;

  // Merge environment config with base config
  return {
    service: serviceName,
    environment,
    ...envConfig,
  } as LoggerConfig;
};
