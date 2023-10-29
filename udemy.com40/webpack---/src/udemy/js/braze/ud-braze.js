let brazePromise = null;

export function importBraze() {
    if (!window.isBrazeEnabled) {
        return Promise.resolve(false);
    }
    if (!brazePromise) {
        const importPromise = import(/* webpackChunkName: "braze" */ 'braze/bootstrap');
        brazePromise = importPromise.then(({bootstrap}) => bootstrap());
    }
    return brazePromise;
}

export async function whenBrazeReady(cb) {
    const appboy = await importBraze();
    appboy && cb(appboy);
}
