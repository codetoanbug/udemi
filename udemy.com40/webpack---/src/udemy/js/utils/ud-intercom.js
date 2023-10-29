import getConfigData from 'utils/get-config-data';

/**
 * Module for Intercom utils.
 */
const udIntercom = {};

/**
 * Returns a promise to access Intercom's APIs asynchronously.
 *
 * NOTE: This method doesn't load the Intercom library, that task is performed by the `intercom/app.js`
 *
 * @param {Object} options.root     The root object containing the Intercom object.
 * @param {Number} options.timeout  The timeout (ms) for waiting.
 * @param {Number} options.interval How often to poll for the Intercom object (ms).
 */
udIntercom.get = ({root = window, timeout = 15000, interval = 100} = {}) => {
    const udConfig = getConfigData();
    if (!udConfig.features.intercom_chat) {
        return Promise.reject('Could not get Intercom');
    }

    return new Promise((resolve, reject) => {
        // If the Intercom object is available we execute it immediately.
        if (typeof root.Intercom !== 'undefined') {
            resolve(root.Intercom);
            return;
        }

        // Wait for the Intercom object.
        let isPending = true;

        const timer = setInterval(() => {
            if (typeof root.Intercom !== 'undefined') {
                clearInterval(timer);

                isPending = false;
                resolve(root.Intercom);
            }
        }, interval);

        // Set a timeout for getting the Intercom object.
        setTimeout(() => {
            clearInterval(timer);

            if (isPending && typeof root.Intercom === 'undefined') {
                // This is ignored in ud-raven.js because there's nothing we can do about it
                // at this point.
                reject(`Could not get Intercom after ${timeout}ms`);
            }
        }, timeout);
    });
};

export default udIntercom;
