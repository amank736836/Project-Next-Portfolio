const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

function format(level: string, color: string, message: string): string {
  return `${colors.dim}[${timestamp()}]${colors.reset} ${color}${level}${colors.reset} ${message}`;
}

export const logger = {
  info: (msg: string) => console.log(format('INFO', colors.blue, msg)),
  success: (msg: string) => console.log(format('OK', colors.green, msg)),
  warn: (msg: string) => console.log(format('WARN', colors.yellow, msg)),
  error: (msg: string) => console.error(format('ERROR', colors.red, msg)),
  debug: (msg: string) => console.log(format('DEBUG', colors.cyan, msg)),
  step: (msg: string) => console.log(format('STEP', colors.magenta, msg)),
  plain: (msg: string) => console.log(msg),
  divider: () => console.log(colors.dim + '─'.repeat(60) + colors.reset),
};