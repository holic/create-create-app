import { CLIError, printCommand } from '.';
import { spawnPromise } from './fs';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

// From https://github.com/vercel/next.js/blob/5cd31e41ca652a3ecdf5966733242267da6083fc/packages/create-next-app/helpers/get-pkg-manager.ts
export function whichPm(): PackageManager {
  const userAgent = process.env.npm_config_user_agent

  if (userAgent) {
    if (userAgent.startsWith('yarn')) {
      return 'yarn'
    } else if (userAgent.startsWith('pnpm')) {
      return 'pnpm'
    } else {
      return 'npm'
    }
  } else {
    return 'npm'
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
