import { spawn } from "node:child_process";
import { ROOT } from "./paths.mjs";

let current = null;

export function rebuildStatus() {
  return current
    ? { busy: true, started: current.started }
    : { busy: false };
}

export function rebuild() {
  if (current) return current.promise;
  const started = Date.now();
  const promise = new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: ROOT,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      current = null;
      if (code === 0) resolve({ ok: true, output });
      else reject(new Error(output.slice(-2000) || `Build failed (${code})`));
    });
  });
  current = { started, promise };
  return promise;
}
