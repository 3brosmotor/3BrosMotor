#!/usr/bin/env node
const { spawn } = require('child_process');

const rawArgs = process.argv.slice(2);
const nextArgs = ['dev'];

let port = process.env.PORT || '3000';
let hostname = process.env.HOSTNAME || '0.0.0.0';

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--port' || arg === '-p') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      port = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--port=')) {
    port = arg.split('=')[1];
  } else if (arg === '--host' || arg === '-H' || arg === '--hostname') {
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      hostname = rawArgs[i + 1];
      i++;
    }
  } else if (arg.startsWith('--host=')) {
    hostname = arg.split('=')[1];
  } else if (arg.startsWith('--hostname=')) {
    hostname = arg.split('=')[1];
  } else if (arg === '--turbo' || arg === '--turbopack' || arg === '--webpack') {
    nextArgs.push(arg);
  }
}

nextArgs.push('-p', port, '-H', hostname);

const nextBin = require.resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname,
  },
});

const cleanup = () => {
  if (child && !child.killed) {
    try {
      child.kill('SIGTERM');
    } catch (e) {}
  }
};

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

process.on('exit', () => {
  cleanup();
});

child.on('exit', (code, signal) => {
  process.exit(code !== null ? code : (signal ? 1 : 0));
});
