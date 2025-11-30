/**
 * Structured logging utility for error tracing and monitoring
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: any;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: Error;
    stack?: string;
}

class Logger {
    private isDevelopment: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }

    /**
     * Format log entry with timestamp and context
     */
    private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
        };

        if (context) {
            entry.context = context;
        }

        if (error) {
            entry.error = error;
            entry.stack = error.stack;
        }

        return entry;
    }

    /**
     * Output log to console with appropriate formatting
     */
    private output(entry: LogEntry): void {
        const { timestamp, level, message, context, error, stack } = entry;

        // Color codes for different log levels
        const colors = {
            info: '\x1b[36m',    // Cyan
            warn: '\x1b[33m',    // Yellow
            error: '\x1b[31m',   // Red
            debug: '\x1b[35m',   // Magenta
            reset: '\x1b[0m',
        };

        const color = colors[level];
        const prefix = `${color}[${level.toUpperCase()}]${colors.reset}`;

        // Basic log
        console.log(`${prefix} ${timestamp} - ${message}`);

        // Add context if present
        if (context && Object.keys(context).length > 0) {
            console.log('  Context:', JSON.stringify(context, null, 2));
        }

        // Add error details if present
        if (error) {
            console.error('  Error:', error.message);
            if (this.isDevelopment && stack) {
                console.error('  Stack:', stack);
            }
        }
    }

    /**
     * Log info message
     */
    info(message: string, context?: LogContext): void {
        const entry = this.formatLog('info', message, context);
        this.output(entry);
    }

    /**
     * Log warning message
     */
    warn(message: string, context?: LogContext): void {
        const entry = this.formatLog('warn', message, context);
        this.output(entry);
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error, context?: LogContext): void {
        const entry = this.formatLog('error', message, context, error);
        this.output(entry);
    }

    /**
     * Log debug message (only in development)
     */
    debug(message: string, context?: LogContext): void {
        if (this.isDevelopment) {
            const entry = this.formatLog('debug', message, context);
            this.output(entry);
        }
    }

    /**
     * Log API request
     */
    apiRequest(method: string, path: string, context?: LogContext): void {
        this.info(`API Request: ${method} ${path}`, {
            method,
            path,
            ...context,
        });
    }

    /**
     * Log API response
     */
    apiResponse(method: string, path: string, statusCode: number, duration?: number): void {
        const level = statusCode >= 400 ? 'error' : 'info';
        const message = `API Response: ${method} ${path} - ${statusCode}`;

        const context: LogContext = {
            method,
            path,
            statusCode,
        };

        if (duration !== undefined) {
            context.duration = `${duration}ms`;
        }

        if (level === 'error') {
            this.error(message, undefined, context);
        } else {
            this.info(message, context);
        }
    }

    /**
     * Log database query
     */
    dbQuery(operation: string, table: string, context?: LogContext): void {
        this.debug(`DB Query: ${operation} on ${table}`, {
            operation,
            table,
            ...context,
        });
    }

    /**
     * Log external API call
     */
    externalAPI(service: string, operation: string, context?: LogContext): void {
        this.debug(`External API: ${service} - ${operation}`, {
            service,
            operation,
            ...context,
        });
    }

    /**
     * Log performance metric
     */
    performance(operation: string, duration: number, context?: LogContext): void {
        const message = `Performance: ${operation} took ${duration}ms`;

        if (duration > 5000) {
            this.warn(message, { operation, duration, ...context });
        } else {
            this.debug(message, { operation, duration, ...context });
        }
    }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
