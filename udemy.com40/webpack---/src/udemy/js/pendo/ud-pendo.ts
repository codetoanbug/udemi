let pendoPromise: Promise<undefined> | null = null;

export function importPendo() {
    if (window.isPendoEnabled) {
        if (!pendoPromise) {
            const importPromise = import('pendo/bootstrap');
            pendoPromise = importPromise.then(({bootstrap}) => bootstrap());
        }
    }
}
