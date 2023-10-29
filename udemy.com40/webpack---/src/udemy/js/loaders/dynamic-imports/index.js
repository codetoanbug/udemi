import handleImportError from 'utils/handle-import-error';

import emitter from './emitter';

export default function dynamicImports() {
    emitter.addListener('ud-app', (moduleId) => {
        const {onSuccess, onError} = createHandlersForEvent('ud-app', moduleId, handleImportError);
        import(/* webpackChunkName: "[request]" */ `src/udemy/js/${moduleId}/udlite-app`)
            .then(onSuccess)
            .catch(onError);
    });
}

function createHandlersForEvent(eventName, identifier, handleImportError) {
    return {
        onSuccess(dynamicallyImportedThing) {
            emitter.emit(`${eventName}:${identifier}:success`, dynamicallyImportedThing);
        },
        onError(error) {
            // If handleImportError does not raise an error, we emit "success" event.
            // Otherwise we emit "failure" event with the raised error.
            // This mimics how .catch(onCatch1).then(onThen).catch(onCatch2) goes into onThen
            // if onCatch1 does not raise on error, otherwise onCatch2 with the raised error.
            try {
                handleImportError(error);
                emitter.emit(`${eventName}:${identifier}:success`);
            } catch (rethrownError) {
                emitter.emit(`${eventName}:${identifier}:failure`, rethrownError);
            }
        },
    };
}
