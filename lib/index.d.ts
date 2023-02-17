import { CommonOptions, ExecaChildProcess } from 'execa';
import { OptionData } from 'yargs-interactive';

declare type PackageManager = 'npm' | 'yarn' | 'pnpm';

interface Option {
    [key: string]: OptionData | {
        default: boolean;
    };
}
/** Options for `create` function */
interface Options {
    /** Path to templates folder.
     *
     * In default, `templateRoot` is set to `path.resolve(__dirname, '../templates')`. You can change this to any location you like. */
    templateRoot: string;
    /** Modify package name.
     *
     * ```js
     * {
     *   modifyName: (name) => (name.startsWith('create-') ? name : `create-${name}`);
     * }
     * ```
     */
    modifyName?: (name: string) => string | Promise<string>;
    /** Additional questions can be defined.
     *
     *  These options will be available as CLI flags, interactive questions, and template strings. In the example above, `--language` flag and the `{{language}}` template string will be enabled in the app.
     */
    extra?: Option;
    /** Default value for a package description (default: `description`) */
    defaultDescription?: string;
    /** Default value for a package author (default: `user.name` in `~/.gitconfig` otherwise `Your name`) */
    defaultAuthor?: string;
    /** Default value for a package author email (default: `user.email` in `~/.gitconfig` otherwise `Your email`) */
    defaultEmail?: string;
    /** Default value for a template (default: `default`) */
    defaultTemplate?: string;
    /** Default value for license (default: `MIT`) */
    defaultLicense?: string;
    /** Default value for package manager (default: `undefined`)
     *
     * `npm`, `yarn` and `pnpm` are available. `undefined` to auto detect package manager. */
    defaultPackageManager?: PackageManager;
    /** Interactively asks users for a description */
    promptForDescription?: boolean;
    /** Interactively asks users for a package author */
    promptForAuthor?: boolean;
    /** Interactively asks users for a package author email */
    promptForEmail?: boolean;
    /** Interactively asks users for a template
     *
     * If there are no multiple templates in the `templates` directory, it won't display a prompt anyways.
     *
     * Even if `promptForTemplate` is set to `false`, users can still specify a template via a command line flag `--template <template>`.
     * ```
     * create-something <name> --template <template>
     * ```
     */
    promptForTemplate?: boolean;
    /** Interactively asks users for a license */
    promptForLicense?: boolean;
    /** Interactively asks users for a package manager */
    promptForPackageManager?: boolean;
    /** Skip initializing a git repository at a creation time. */
    skipGitInit?: boolean;
    /** Skip installing package dependencies at a creation time. */
    skipNpmInstall?: boolean;
    /** Define after-hook script to be executed right after the initialization process. */
    after?: (options: AfterHookOptions) => void | Promise<void>;
    /** The caveat message will be shown after the entire process is completed.
     *
     * ```js
     * create('create-greet', {
     *   caveat: 'Happy coding!',
     * });
     * ```
     *
     * ```js
     * create('create-greet', {
     *   caveat: ({ answers }) => `Run -> cd ${answers.name} && make`,
     * });
     * ```
     */
    caveat?: string | ((options: AfterHookOptions) => string | void | Promise<string | void>);
}
/** Records of user inputs */
interface Answers {
    /** Selected template name
     *
     * e.g. `typescript`
     */
    template: string;
    /** Package name
     *
     * e.g. `create-greet`
     */
    name: string;
    /** Package description */
    description: string;
    /** Package author (e.g. "John Doe") */
    author: string;
    /** Package author email (e.g. "john@example.com") */
    email: string;
    /** Package author contact (e.g. "John Doe <john@example.com>") */
    contact: string;
    /** Package license (e.g. "MIT") */
    license: string;
    [key: string]: string | number | boolean | any[];
}
/** Options for after hook and caveat scripts */
interface AfterHookOptions {
    /** Created package root
     *
     * e.g. `/path/to/ohayo`
     */
    packageDir: string;
    /** Template directory
     *
     * e.g. `/path/to/create-greet/templates/default`
     */
    templateDir: string;
    /** Current year */
    year: number;
    /** Node.js package manager to be used to initialize a package */
    packageManager: PackageManager;
    /** records of user inputs */
    answers: Answers;
    /** Package name
     *
     * e.g. `create-greet`
     *
     * @deprecated Use `answers.name` instead.
     */
    name: string;
    /** Selected template name
     *
     * e.g. `typescript`
     *
     * @deprecated Use `answers.template` instead
     */
    template: string;
    /** execute shell commands in the package dir */
    run: (command: string, options?: CommonOptions<string>) => ExecaChildProcess<string>;
    /** install npm package. uses package manager specified by --node-pm CLI param (default: auto-detect) */
    installNpmPackage: (packageName: string, isDev?: boolean) => Promise<void>;
}
declare class CLIError extends Error {
    constructor(message: string);
}
declare function printCommand(...commands: string[]): void;
/** @see https://github.com/uetchy/create-create-app */
declare function create(appName: string, options: Options): Promise<void>;

export { AfterHookOptions, Answers, CLIError, Option, Options, create, printCommand };
