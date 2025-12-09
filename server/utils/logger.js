import fs from 'fs';
import path from 'path';

const logFile = path.resolve('logs', 'access.log');

export const logEvent = (message) => {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
};