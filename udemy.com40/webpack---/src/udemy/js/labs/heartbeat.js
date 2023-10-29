import autobind from 'autobind-decorator';

import {PROGRESS_TIMER_INTERVAL_MS} from './constants';

export default class Heartbeat {
    constructor(loggingInterval, onTick) {
        this.loggingInterval = loggingInterval;
        this.onTick = onTick;
        this.lastActivityDate = null;
        this.lastUIActivityDate = null;
        this.elapsedSinceLastActivityMs = 0;
        this.intervalId = null;
        this.disableHeartbeatForTest = false;
    }

    @autobind
    start() {
        this.setLastUIActivityDate();
        if (this.intervalId === null) {
            this.resetLastActivity();
            if (!this.disableHeartbeatForTest) {
                this.intervalId = setInterval(this.tick, PROGRESS_TIMER_INTERVAL_MS);
            }
        }
    }

    @autobind
    stop() {
        if (this.intervalId !== null) {
            if (!this.disableHeartbeatForTest) {
                this.lastUIActivityDate = null;
                clearInterval(this.intervalId);
            }
            this.intervalId = null;
        }
    }

    @autobind
    async tick() {
        try {
            const elapsedSinceLastActivityMs = Math.floor(Date.now() - this.lastActivityDate);
            if (elapsedSinceLastActivityMs >= this.elapsedSinceLastActivityMs) {
                await this.onTick(elapsedSinceLastActivityMs);
                this.elapsedSinceLastActivityMs = elapsedSinceLastActivityMs;
                if (elapsedSinceLastActivityMs >= this.loggingInterval) {
                    this.resetLastActivity();
                }
            }
        } catch (error) {
            // There shouldn't be any errors, but just in case, we don't want them to be flooding
            // forever via setInterval. Stop the setInterval before re-raising the error.
            this.stop();
            throw error;
        }
    }

    @autobind
    resetLastActivity() {
        this.elapsedSinceLastActivityMs = 0;
        this.lastActivityDate = Date.now();
    }

    @autobind
    setLastUIActivityDate() {
        this.lastUIActivityDate = Date.now();
    }
}
