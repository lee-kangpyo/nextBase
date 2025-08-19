// src/utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';
const MIDDLEWARE_LOG_LEVEL =
  process.env.NEXT_PUBLIC_MIDDLEWARE_LOG_LEVEL || 'info';
const AUTH_LOG_LEVEL = process.env.NEXT_PUBLIC_AUTH_LOG_LEVEL || 'info';

const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel, targetLevel: string) {
  return levelOrder[level] >= levelOrder[targetLevel as LogLevel];
}

export const logger = {
  debug: (...args: any[]) => {
    if (shouldLog('debug', LOG_LEVEL)) console.debug('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (shouldLog('info', LOG_LEVEL)) console.info('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn', LOG_LEVEL)) console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    if (shouldLog('error', LOG_LEVEL)) console.error('[ERROR]', ...args);
  },
};

// 미들웨어 전용 로거 (별도 로그 레벨)
export const middlewareLogger = {
  debug: (...args: any[]) => {
    if (shouldLog('debug', MIDDLEWARE_LOG_LEVEL))
      console.debug('[MIDDLEWARE]', ...args);
  },
  info: (...args: any[]) => {
    if (shouldLog('info', MIDDLEWARE_LOG_LEVEL))
      console.info('[MIDDLEWARE]', ...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn', MIDDLEWARE_LOG_LEVEL))
      console.warn('[MIDDLEWARE]', ...args);
  },
  error: (...args: any[]) => {
    if (shouldLog('error', MIDDLEWARE_LOG_LEVEL))
      console.error('[MIDDLEWARE]', ...args);
  },
};

// 인증 전용 로거 (별도 로그 레벨)
export const authLogger = {
  debug: (...args: any[]) => {
    if (shouldLog('debug', AUTH_LOG_LEVEL)) console.debug('[AUTH]', ...args);
  },
  info: (...args: any[]) => {
    if (shouldLog('info', AUTH_LOG_LEVEL)) console.info('[AUTH]', ...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn', AUTH_LOG_LEVEL)) console.warn('[AUTH]', ...args);
  },
  error: (...args: any[]) => {
    if (shouldLog('error', AUTH_LOG_LEVEL)) console.error('[AUTH]', ...args);
  },
};
