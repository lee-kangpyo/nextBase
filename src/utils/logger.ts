// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';
const MIDDLEWARE_LOG_ENABLED =
  process.env.NEXT_PUBLIC_MIDDLEWARE_LOG === 'true';
const AUTH_LOG_ENABLED = process.env.NEXT_PUBLIC_AUTH_LOG === 'true';

const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= levelOrder[LOG_LEVEL as LogLevel];
}

export const logger = {
  debug: (...args: any[]) => {
    if (shouldLog('debug')) console.debug('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (shouldLog('info')) console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn')) console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    if (shouldLog('error')) console.error('[ERROR]', ...args);
  },
};

// 미들웨어 전용 로거
export const middlewareLogger = {
  info: (...args: any[]) => {
    if (MIDDLEWARE_LOG_ENABLED) {
      console.info('[MIDDLEWARE]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (MIDDLEWARE_LOG_ENABLED) {
      console.warn('[MIDDLEWARE]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (MIDDLEWARE_LOG_ENABLED) {
      console.error('[MIDDLEWARE]', ...args);
    }
  },
};

// 인증 전용 로거
export const authLogger = {
  info: (...args: any[]) => {
    if (AUTH_LOG_ENABLED) {
      console.info('[AUTH]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (AUTH_LOG_ENABLED) {
      console.warn('[AUTH]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (AUTH_LOG_ENABLED) {
      console.error('[AUTH]', ...args);
    }
  },
};
