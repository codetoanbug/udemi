import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import Raven from 'utils/ud-raven';

import {MAX_IDLE_SECONDS, TIMER_INTERVAL} from '../constants';

/**
 * Tests are timed. The timer model works as follows:
 * The timer is initialized from the latest quiz attempt. The attempt has
 * `duration`, which is the total amount of time allotted to complete the test, and
 * `elapsed_time`, which is the amount of time the user has spent. The time remaining is
 * the duration minus the elapsed_time.
 *
 * The timer doesn't just store elapsed_time directly. It also keeps track of a
 * `lastActivityDate` point within the elapsed_time. This point splits elapsed_time into
 * `elapsedUntilLastActivity` and `elapsedSinceLastActivity`. We keep track of lastActivityDate
 * because we automatically pause the timer if the user goes MAX_IDLE_SECONDS without doing
 * anything. Activity is "registered" by calling the `resetLastActivity` method, e.g. whenever
 * the user selects an answer.
 *
 * At any point, the user can pause or unpause the timer.
 *
 * If there's no time remaining, we show a "Time's up" confirmation. The user can choose to
 * ignore the time limit.
 *
 * The timer no longer works once the latest attempt changes. It's up to the caller to call
 * `initialize` again if this happens.
 */
export default class TestTimerModel {
    @observable attemptId = false;
    @observable elapsedUntilLastActivity = 0;
    @observable elapsedSinceLastActivity = 0;
    @observable ignoreTimeLimit = false;
    @observable intervalId = null;
    @observable isPaused = false;
    @observable isTimesUpConfirmationOpen = false;
    @observable lastActivityDate = null;

    constructor(practiceTestStore, quizViewStore) {
        this.quizViewStore = quizViewStore;
        this.confirmStopTest = practiceTestStore.confirmStopTest;
    }

    @computed
    get isInitialized() {
        return !!this.quizViewStore.attempt && this.quizViewStore.attempt.id === this.attemptId;
    }

    @computed
    get timeRemaining() {
        const duration = this.quizViewStore.attempt.results_summary.duration;
        const elapsed = this.elapsedUntilLastActivity + this.elapsedSinceLastActivity;
        return duration - elapsed;
    }

    @computed
    get isPausedModalOpen() {
        return this.isInitialized && !this.isTimesUpConfirmationOpen && this.isPaused;
    }

    /**
     * Initializes the timer from the latest quiz attempt.
     * Called once the user sees the question page for the first time.
     */
    @action
    initialize() {
        const attempt = this.quizViewStore.attempt;
        this.attemptId = attempt.id;
        this.elapsedUntilLastActivity = attempt.elapsed_time || 0;
        this.elapsedSinceLastActivity = 0;
        this.ignoreTimeLimit = attempt.ignore_time_limit;
        this.isPaused = attempt.is_paused;
        this.lastActivityDate = Date.now();
        if (this.timeRemaining <= 0 && !this.ignoreTimeLimit) {
            this.showTimesUpConfirmation({save: false});
        } else if (!this.isPaused) {
            this._start();
        }
    }

    @action
    pause(options = {save: true}) {
        const changed = !this.isPaused;
        this.isPaused = true;
        this._stop();
        if (options.save && changed) {
            try {
                this.quizViewStore.updateAttemptWithBeacon({is_paused: true});
            } catch (e) {
                this.errorHandler(e);
            }
        }
    }

    @action
    unpause(options = {save: true}) {
        const changed = this.isPaused;
        this.isPaused = false;
        this._start();
        if (options.save && changed) {
            this.quizViewStore.updateAttempt({is_paused: false}).catch(this.errorHandler);
        }
    }

    @action
    _start() {
        if (this.intervalId === null) {
            this.resetLastActivity();
            this.intervalId = setInterval(this._tick, TIMER_INTERVAL);
        }
    }

    @action
    _stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    @autobind
    @action
    _tick() {
        try {
            if (!this.isInitialized) {
                throw new Error('Timer is not initialized- did the attempt change?');
            }
            const elapsedSinceLastActivity = Math.floor(
                (Date.now() - this.lastActivityDate) / 1000,
            );
            if (elapsedSinceLastActivity > this.elapsedSinceLastActivity) {
                this.elapsedSinceLastActivity = elapsedSinceLastActivity;
            }
            if (this.timeRemaining <= 0 && !this.ignoreTimeLimit) {
                this.showTimesUpConfirmation();
            } else if (this.elapsedSinceLastActivity >= MAX_IDLE_SECONDS) {
                this.pause();
            }
        } catch (error) {
            // There shouldn't be any errors, but just in case, we don't want them to be flooding
            // forever via setInterval. Stop the setInterval before re-raising the error.
            this._stop();
            throw error;
        }
    }

    @action
    resetLastActivity() {
        this.elapsedUntilLastActivity += this.elapsedSinceLastActivity;
        this.elapsedSinceLastActivity = 0;
        this.lastActivityDate = Date.now();
    }

    @action
    showTimesUpConfirmation(options = {save: true}) {
        this.isTimesUpConfirmationOpen = true;
        this.pause(options);
    }

    @autobind
    @action
    cancelTimesUp() {
        this.isTimesUpConfirmationOpen = false;
        this.ignoreTimeLimit = true;
        this.unpause({save: false});
        this.quizViewStore
            .updateAttempt({
                ignore_time_limit: true,
                is_paused: false,
            })
            .catch(this.errorHandler);
    }

    @autobind
    @action
    confirmTimesUp() {
        this.isTimesUpConfirmationOpen = false;
        this.confirmStopTest();
    }

    /**
     * Ignore API errors. Report JS errors. It's not a big deal if the API requests fail.
     * The worst that can happen is the timer doesn't have the correct initial state when
     * the user refreshes the page.
     */
    @autobind
    errorHandler(error) {
        if (!error.response && error.message) {
            Raven.captureException(error);
        }
    }
}
