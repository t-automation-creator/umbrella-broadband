import * as fs from "fs";
import * as path from "path";

const logFile = path.join(process.cwd(), "server.log");

// Create write stream
const logStream = fs.createWriteStream(logFile, { flags: "a" });

// Capture original console methods
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

// Helper to format log entry
function formatLog(level: string, args: any[]): string {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => 
    typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(" ");
  return `[${timestamp}] [${level}] ${message}`;
}

// Override console methods
console.log = (...args: any[]) => {
  const formatted = formatLog("LOG", args);
  logStream.write(formatted + "\n");
  originalLog(...args);
};

console.error = (...args: any[]) => {
  const formatted = formatLog("ERROR", args);
  logStream.write(formatted + "\n");
  originalError(...args);
};

console.warn = (...args: any[]) => {
  const formatted = formatLog("WARN", args);
  logStream.write(formatted + "\n");
  originalWarn(...args);
};

// Ensure logs are flushed on exit
process.on("exit", () => {
  logStream.end();
});

export { logStream };
