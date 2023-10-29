import axios from 'axios';

import {getConfigData} from '../data/get-config-data';

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
// eslint-disable-next-line import/no-default-export
export class BrowserLogger {
    _clientToken: string;
    _url: string;
    _service: string;

    constructor(service?: string) {
        this._clientToken = 'pub4ecb41fd37fb63f77d38e05f54b0fb29';
        // Same endpoint as used by @datadog/browser-logs library
        this._url = `https://browser-http-intake.logs.datadoghq.com/v1/input/${this._clientToken}`;
        this._service = service ? `website-django.${service}` : 'website-django';
    }

    get _env() {
        return getConfigData().env;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _sendLog(level: string, message?: string, data: any = {}) {
        if (this._env !== 'PROD') {
            return;
        }

        // Following the format described here https://docs.datadoghq.com/api/v1/logs/#send-logs
        const logData = Object.assign(
            {
                level,
                message,
                ddsource: 'browser',
                service: this._service,
                ddtags: `env:${this._env}`,
            },
            data,
        );

        axios.post(this._url, logData);
    }

    info(...args: []) {
        this._sendLog('info', ...args);
    }

    debug(...args: []) {
        this._sendLog('debug', ...args);
    }

    warn(...args: []) {
        this._sendLog('warn', ...args);
    }

    error(...args: [string?]) {
        this._sendLog('error', ...args);
    }
}
