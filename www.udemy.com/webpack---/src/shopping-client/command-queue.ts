import {action, autorun, observable, computed} from 'mobx';

type CommandFn<T> = () => Promise<T>;

export interface DeferredCommand<T> {
    promise: Promise<T>;
    actions: {
        resolve(data: T): void;
        reject(err: unknown): void;
        retry(err: unknown): void;
    };
    run(): void;
}

export interface CommandResolver<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cmd: DeferredCommand<T>, err: any): void;
}

/**
 * Represents a queue of deferred behavior, represented by promises.
 * Each command is run sequentially, and its associated promise is then resolved / rejected.
 *
 * Note: Commands are also retried (up to a limit defined in the configuration),
 * with retries handled by the the commamnd's ``resolver`` function.
 */
export class CommandQueue {
    @observable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly commands: DeferredCommand<any>[] = [];

    constructor(private readonly retryLimit = 3) {
        /**
         * Let's trigger new command in the queue when it is ready and there is
         * at least an element.
         */

        autorun(() => {
            if (this.currentCommand) {
                this.currentCommand.run();
            }
        });
    }

    @computed
    get currentCommand() {
        return this.commands.length > 0 ? this.commands[0] : null;
    }

    @action
    add = <T>(command: CommandFn<T>, resolver: CommandResolver<T>) => {
        const cmd = deferredCommand(command, resolver, this.retryLimit, this.endCurrent);
        this.commands.push(cmd);
        return cmd.promise;
    };

    @action
    endCurrent = () => {
        this.commands.shift();
    };
}

/**
 * Represents a set of behavior to be run & retried.
 *
 * @param command - deferred behavior
 * @param resolver - function that accepts (command, error) and calls one of:
 *                     + command.actions.resolve(data)
 *                     + command.actions.reject(err)
 *                     + command.actions.retry(err)
 * @param retryLimit - maximum number of times to retry `command`.
 * @param onComplete - function to be run BEFORE the command's associated promise is resolved.
 */
function deferredCommand<T>(
    command: CommandFn<T>,
    resolver: CommandResolver<T>,
    retryLimit: number,
    onComplete: () => void,
) {
    const state = {
        deferred: createDeferred<T>(),
        command: action(command),
        resolver,
        triesLeft: retryLimit,
        onComplete,
    };

    const cmd: DeferredCommand<T> = {
        promise: state.deferred.promise,
        actions: {
            resolve: (data) => {
                state.onComplete();
                state.deferred.resolve(data);
            },
            reject: (err) => {
                state.onComplete();
                state.deferred.reject(err);
            },
            retry: action((err) => {
                state.triesLeft--;
                if (state.triesLeft > 0) {
                    return cmd.run();
                }
                state.onComplete();
                state.deferred.reject(err);
            }),
        },
        run: action(() => {
            command().then(cmd.actions.resolve, (err) => state.resolver(cmd, err));
        }),
    };

    return cmd;
}

interface Deferred<T> {
    promise: Promise<T>;
    resolve(value: T): void;
    reject(err: unknown): void;
}

function createDeferred<T>() {
    const deferred: Partial<Deferred<T>> = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred as Deferred<T>;
}
