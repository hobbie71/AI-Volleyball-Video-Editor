/**
 * Simple logger utility for the application
 */
export class Logger {
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('info', message));
  }

  static error(message: string, error?: Error): void {
    console.error(this.formatMessage('error', message));
    if (error) {
      console.error(error);
    }
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  static debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('debug', message));
    }
  }

  static success(message: string): void {
    console.log(`✅ ${this.formatMessage('success', message)}`);
  }

  static progress(message: string, percentage?: number): void {
    const progressMsg = percentage ? `${message} - ${percentage}%` : message;
    console.log(`⚙️ ${this.formatMessage('progress', progressMsg)}`);
  }
}
