/* eslint-disable */

const isServer = typeof window === "undefined";

export class Logger {
  private context: string;
  private isServerContext: boolean;
  private colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    gray: "\x1b[90m",
    bold: "\x1b[1m",
    magenta: "\x1b[35m",
  };

  constructor(context: string) {
    this.context = context;
    this.isServerContext = isServer;
  }

  private shouldLog(): boolean {
    // Always log server-side actions
    if (this.isServerContext) return true;
    // Only log client-side in development
    return process.env.NODE_ENV === "development";
  }

  private formatMessage(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const environment = this.isServerContext ? "[SERVER]" : "[CLIENT]";
    const prefix = `${timestamp} ${environment} ${this.context}:`;
    return { prefix, message, ...(data && { data }) };
  }

  private colorize(color: keyof typeof this.colors, text: string): string {
    // Only apply colors on the server side where they work
    if (!this.isServerContext) return text;
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  private formatLogLevel(level: string): string {
    return `[${level.toUpperCase()}]`;
  }

  private formatOutput({
    prefix,
    message,
    data,
  }: {
    prefix: string;
    message: string;
    data?: any;
  }) {
    const logParts = [prefix, message];
    if (data) {
      logParts.push("\n" + JSON.stringify(data, null, 2));
    }
    return logParts.join(" ");
  }

  info(message: string, data?: any) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("info", message, data);
    console.log(
      this.colorize("blue", this.formatLogLevel("info")) +
        " " +
        this.formatOutput(formattedData)
    );
  }

  error(message: string, error?: Error | unknown, data?: any) {
    if (!this.shouldLog()) return;
    const errorData =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;

    const formattedData = this.formatMessage("error", message, {
      ...data,
      error: errorData,
    });

    console.error(
      this.colorize("red", this.colors.bold + this.formatLogLevel("error")) +
        " " +
        this.formatOutput(formattedData)
    );
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("warn", message, data);
    console.warn(
      this.colorize("yellow", this.formatLogLevel("warn")) +
        " " +
        this.formatOutput(formattedData)
    );
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("debug", message, data);
    console.debug(
      this.colorize("gray", this.formatLogLevel("debug")) +
        " " +
        this.formatOutput(formattedData)
    );
  }

  // New method specifically for server actions
  action(message: string, data?: any) {
    if (!this.shouldLog()) return;
    const formattedData = this.formatMessage("action", message, data);
    console.log(
      this.colorize("magenta", this.formatLogLevel("action")) +
        " " +
        this.formatOutput(formattedData)
    );
  }
}
