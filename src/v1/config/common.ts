/**
 * Common Configuration
 * Shared constants and configuration values used across the application
 */

import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Common configuration object containing time-related constants
 * These values are used for calculations involving time conversions
 */
const config = {
  /**
   * Conversion factor from seconds to milliseconds
   * Used for time-based calculations and conversions
   */
  SECONDS_TO_MILLISECONDS: Number(process.env.SECONDS_TO_MILLISECONDS) || 1000,

  /**
   * Number of milliseconds in a single day (24 hours)
   * Used for log rotation, retention policies, and time-based operations
   * Default: 86400000 ms (24 * 60 * 60 * 1000)
   */
  MILLISECONDS_PER_DAY: Number(process.env.MILLISECONDS_PER_DAY) || 86400000,

  /**
   * Conversion factor from seconds to hours
   * Used for time-based calculations
   */
  SECONDS_TO_HOURS: Number(process.env.SECONDS_TO_HOURS) || 3600,
};

export default config;
