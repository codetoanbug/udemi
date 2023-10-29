import {action, autorun, observable} from 'mobx';

/**
 * Represents a queue of deferred behavior, represented by promises.
 * Each command is run sequentially, and its associated promise is then resolved / rejected.
 *
 * Note: Commands are also retried (up to a limit defined in the configuration),
 * with retries handled by the the commamnd's ``resolver`` function.
 */
export default function commandQueue(retryLimit = 3) {
    /*
     * Internal State
     */

    const state = observable({
        commands: [],
        get currentCommand() {
            return state.commands.length > 0 ? state.commands[0] : null;
        },
        retryLimit,
    });

    /*
     * Service API
     */

    const queue = {
        add: action((command, resolver) => {
            const cmd = deferredCommand(command, resolver, retryLimit, queue.endCurrent);
            state.commands.push(cmd);
            return cmd.promise;
        }),

        endCurrent: action(() => {
            state.commands.shift();
        }),
    };

    /**
     * Let's trigger new command in the queue when it is ready and there is
     * at least an element.
     */

    autorun(() => {
        if (state.currentCommand) {
            state.currentCommand.run();
        }
    });

    return queue;
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
function deferredCommand(command, resolver, retryLimit, onComplete) {
    const state = {
        deferred: createDeferred(),
        command: action(command),
        resolver,
        triesLeft: retryLimit,
        onComplete,
    };

    const cmd = {
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

function createDeferred() {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
}
