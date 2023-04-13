import { CLIError, printCommand } from '.';
import { spawnPromise } from './fs';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

// https://github.com/vercel/next.js/blob/c3349e72fd591cc960adb59580d25771d1f4f13a/packages/next/src/lib/helpers/get-pkg-manager.ts
export function whichPm(cwd = '.'): PackageManager {
  try {
    for (const { lockFile, packageManager } of [
      { lockFile: 'yarn.lock', packageManager: 'yarn' },
      { lockFile: 'pnpm-lock.yaml', packageManager: 'pnpm' },
      { lockFile: 'package-lock.json', packageManager: 'npm' },
    ]) {
      if (fs.existsSync(path.join(cwd, lockFile))) {
        return packageManager as PackageManager;
      }
    }
    const userAgent = process.env.npm_config_user_agent;
    if (userAgent) {
      if (userAgent.startsWith('pnpm')) {
        return 'pnpm';
      } else if (userAgent.startsWith('yarn')) {
        return 'yarn';
      }
    }
    try {
      execSync('pnpm --version', { stdio: 'ignore' });
      return 'pnpm';
    } catch {
      execSync('yarn --version', { stdio: 'ignore' });
      return 'yarn';
    }
  } catch {
    return 'npm';
  }
}

export async function initPackage(
  rootDir: string,
  {
    pm,
  }: {
    pm: PackageManager;
  }
) {
  let command: string;
  let args: string[];

  switch (pm) {
    case 'npm': {
      command = 'npm';
      args = ['init', '-y'];
      process.chdir(rootDir);
      break;
    }
    case 'yarn': {
      command = 'yarnpkg';
      args = ['init', '-y', '--cwd', rootDir];
      break;
    }
    case 'pnpm': {
      command = 'pnpm';
      args = ['init', '-y'];
      process.chdir(rootDir);
      break;
    }
  }

  printCommand(command, ...args);

  try {
    await spawnPromise(command, args, { stdio: 'inherit', shell: true });
  } catch (err) {
    throw new CLIError(`Failed to install dependencies: ${err}`);
  }
}

export async function installDeps(rootDir: string, pm: PackageManager) {
  let command: string;
  let args: string[];

  switch (pm) {
    case 'npm': {
      command = 'npm';
      args = ['install'];
      process.chdir(rootDir);
      break;
    }
    case 'yarn': {
      command = 'yarnpkg';
      args = ['install', '--cwd', rootDir];
      break;
    }
    case 'pnpm': {
      command = 'pnpm';
      args = ['install', '--dir', rootDir];
      break;
    }
  }

  printCommand(command, ...args);

  try {
    await spawnPromise(command, args, { stdio: 'inherit', shell: true });
  } catch (err) {
    throw new CLIError(`Failed to install dependencies: ${err}`);
  }
}

export async function addDeps(
  rootDir: string,
  deps: string[],
  {
    isDev = false,
    pm,
  }: {
    isDev?: boolean;
    pm: PackageManager;
  }
) {
  let command: string;
  let args: string[];

  switch (pm) {
    case 'npm': {
      command = 'npm';
      args = ['install', isDev ? '-D' : '-S', ...deps];
      process.chdir(rootDir);
      break;
    }
    case 'yarn': {
      command = 'yarnpkg';
      args = ['add', '--cwd', rootDir, ...deps, isDev ? '-D' : ''];
      break;
    }
    case 'pnpm': {
      command = 'pnpm';
      args = ['add', '--dir', rootDir, ...deps, isDev ? '-D' : ''];
      break;
    }
  }

  printCommand(command, ...args);

  try {
    await spawnPromise(command, args, { stdio: 'inherit', shell: true });
  } catch (err) {
    throw new CLIError(`Failed to add dependencies: ${err}`);
  }
}
