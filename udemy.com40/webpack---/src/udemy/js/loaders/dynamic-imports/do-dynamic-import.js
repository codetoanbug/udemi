import emitter from './emitter';

/**
 * @param eventName: a string describing what kind of file to be imported,
 * e.g. 'app' to import app.js files. ./index.js would have a corresponding
 * emitter.addListener('app').
 * @param identifier: a string that uniquely identifies the file to be imported.
 * This tends to be used in the dynamic import() path pattern, e.g. `src/udemy/js/${moduleId}/app`.
 * @param onThen and @param onCatch are the same params that you would pass if you were to call
 * import().then(onThen).catch(onCatch) directly.
 */
export default function doDynamicImport(eventName, identifier, onThen, onCatch) {
    emitter.once(`${eventName}:${identifier}:success`, onThen);
    emitter.once(`${eventName}:${identifier}:failure`, onCatch);
    emitter.emit(eventName, identifier);
}
