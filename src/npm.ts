import { CLIError, printCommand } from '.';
import { spawnPromise } from './fs';
import {
  detect as detectPackageManager,
  PM as PackageManager,
} from 'detect-package-manager';

export { PackageManager };

export async function whichPm(): Promise<PackageManager> {
  return await detectPackageManager();
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
