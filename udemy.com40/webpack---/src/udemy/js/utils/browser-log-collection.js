import axios from 'axios';

import getConfigData from 'utils/get-config-data';

/**
 * The BrowserLogger class can be used to send log events to Datadog from the browser.
 *
 * Usage example:
 * import BrowserLogger from 'utils/browser-log-collection'
 *
 * const browserLogger = BrowserLogger('my-component');
 * browserLogger.info('some logging event', {otherData: 123, moreData: 'information'});
 *
 * To see the sent logs in Datadog:
 * 1. Go to the log search page https://app.datadoghq.com/logs
 * 2. Query for `source:browser` and `service:website-django.my-component`
 */
export default class BrowserLogger {
    /**
     * @param {string|null=} service
     */
    constructor(service = null) {
        this._clientToken = 'pub4ecb41fd37fb63f77d38e05f54b0fb29';
        // Same endpoint as used by @datadog/browser-logs library
        this._url = `https://browser-http-intake.logs.datadoghq.com/v1/input/${this._clientToken}`;
        this._service = service ? `website-django.${service}` : 'website-django';
    }

    get _env() {
        return getConfigData().env;
    }

    _sendLog(level, message, data = {}) {
        if (this._env !== 'PROD') {
            return;
        }

        const envTag = 'production';
        // Following the format described here https://docs.datadoghq.com/api/v1/logs/#send-logs
        const logData = Object.assign(
            {
                level,
                message,
                ddsource: 'browser',
                service: this._service,
                ddtags: `env:${envTag}`,
            },
            data,
        );

        axios.post(this._url, logData);
    }

    info(...args) {
        this._sendLog('info', ...args);
    }

    debug(...args) {
        this._sendLog('debug', ...args);
    }

    warn(...args) {
        this._sendLog('warn', ...args);
    }

    error(...args) {
        this._sendLog('error', ...args);
    }
}
