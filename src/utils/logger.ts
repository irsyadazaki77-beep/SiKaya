type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  requestId?: string;
  endpoint?: string;
  duration?: number;
  status?: number;
  message: string;
  [key: string]: any;
}

const SENSITIVE_KEYS = ['password', 'token', 'gemini_api_key', 'apikey', 'authorization', 'monthlyincome', 'totalcash', 'totaldebt'];

function sanitize(data: any): any {
  if (!data) return data;
  if (typeof data === 'string') return data; // Primitive masking can be added if needed
  
  if (Array.isArray(data)) {
    return data.map(item => sanitize(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    return sanitized;
  }

  return data;
}

export class Logger {
  static log(level: LogLevel, message: string, meta: Record<string, any> = {}) {
    // Only log in non-test environments or explicitly debug
    if (process.env.NODE_ENV === 'test' && level !== 'error') return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...sanitize(meta)
    };

    const formattedLog = JSON.stringify(entry);

    switch (level) {
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
      case 'debug':
        console.debug(formattedLog);
        break;
    }
  }

  static info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  static warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  static error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta);
  }

  static debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }
}
