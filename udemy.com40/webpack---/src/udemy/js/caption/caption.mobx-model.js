import autobind from 'autobind-decorator';
import axios from 'axios';
import {action, computed, observable, when} from 'mobx';

import udApiStat from 'utils/ud-api-stat';
import udMe from 'utils/ud-me';
import Raven from 'utils/ud-raven';

import {
    CAPTION_RETRY_LIMIT,
    ERROR_TYPES,
    MONITORING_EVENTS,
    NETWORK_ERROR_MESSAGE,
    RETRYABLE_ERROR_STATUSES,
} from './constants';
import Cue, {convertSecondsToHumanReadable} from './cue.mobx-model';
import {parseVTT} from './vtt-parser';

export default class Caption {
    @observable _cues = [];
    _loadPromise = null;
    @observable isLoaded = false;
    @observable error = null;
    @observable status;

    constructor(apiData) {
        this.id = apiData.id;
        this.locale = apiData.locale_id || (apiData.locale && apiData.locale.locale);
        this.language = this.locale ? this.locale.slice(0, 2) : undefined;
        this.source = apiData.source;
        this.title = apiData.title;
        this.url = apiData.url;
        this.confidenceThreshold = apiData.confidence_threshold;
        this.assetId = apiData.asset_id;
        this.isEdit = apiData.is_edit;
        this.isEditOfAutoCaption = apiData.is_edit_of_autocaption;
        this.filteringTags = apiData.filteringTags;
        this.isTranslation = apiData.is_translation;
        this.modified = apiData.modified;
        this.retries = 0;

        this.setStatus(apiData.status);
        // Used for draft captions. Hold the data here temporarily until the cues are constructed.
        this._correctedCueIds = (apiData.corrected_cue_ids || []).map((cueId) =>
            parseInt(cueId, 10),
        );

        when(
            () => this.error,
            () => {
                if (this.error.errorType === ERROR_TYPES.PARSING) {
                    // Don't raise loading/retry errors to Sentry, they're network errors. We track them
                    // in datadog below.
                    Raven.captureException(
                        new Error(
                            `Caption failed when ${this.error.errorType}: ${this.error.message} for caption ${this.id}`,
                        ),
                    );
                }
                udApiStat.increment(MONITORING_EVENTS.ERROR, this.error);
            },
        );
    }

    @action
    setStatus(status) {
        this.status = status;
    }

    constructCue(cueData) {
        return new Cue(cueData);
    }

    @autobind
    loadFromSource() {
        if (this._loadPromise) {
            return this._loadPromise;
        }

        // Cues IDs are not mandatory, nor do they need to be unique. We need consistency and uniqueness
        // in the ID for various purposes in the application, so assign an ID based on order in caption file.
        let cueIndex = 0;
        this._loadPromise = axios
            .get(this.url)
            .then((response) => {
                parseVTT(
                    response.data,
                    action((cueData) => {
                        cueData.id = cueIndex;
                        cueData.isCorrect = this._correctedCueIds.includes(cueIndex);
                        this._cues.push(this.constructCue(cueData));
                        cueIndex++;
                    }),
                    action(() => {
                        this.isLoaded = true;
                        udApiStat.increment(MONITORING_EVENTS.LOADED, {
                            language: this.language,
                            userCountry: udMe.country,
                            retries: this.retries,
                        });
                    }),
                    this._handleParsingError,
                );
            })
            .catch(this._handleLoadingError);
        return this._loadPromise;
    }

    @autobind
    @action
    _handleParsingError(error) {
        this.error = {
            errorType: ERROR_TYPES.PARSING,
            message: error.message,
        };
    }

    _shouldRetryLoading(errorTags) {
        return (
            this.retries < CAPTION_RETRY_LIMIT &&
            (errorTags.message === NETWORK_ERROR_MESSAGE ||
                RETRYABLE_ERROR_STATUSES.includes(errorTags.status))
        );
    }

    @autobind
    @action
    _retryLoading() {
        const delay = Math.pow(2, this.retries) * 1000;
        this.retries++;
        setTimeout(this.loadFromSource, delay);
    }

    @autobind
    @action
    _handleLoadingError(error) {
        const errorTags = {
            status: error.response && error.response.status,
            message: error.message,
            userCountry: udMe.country,
            retries: this.retries,
        };
        if (this._shouldRetryLoading(errorTags)) {
            this._loadPromise = null;
            errorTags.errorType = ERROR_TYPES.RETRY;
            this.error = errorTags;
            this._retryLoading();
        } else {
            errorTags.errorType = ERROR_TYPES.LOADING;
            this.error = errorTags;
        }
    }

    @computed
    get cues() {
        // It can be computationally costly (browser-hangingly so) to have other parts of the app
        // watching cues and responding to changes as the list is being populated. Instead we expose
        // an empty list until we've finished loading.
        if (!this.isLoaded) {
            return [];
        }
        return this._cues;
    }

    @computed
    get asString() {
        const cues = this.cues.map((cue) => {
            const startTime = convertSecondsToHumanReadable(cue.startTime, 3);
            const endTime = convertSecondsToHumanReadable(cue.endTime, 3);
            return [cue.id, `${startTime} --> ${endTime}`, cue.text].join('\n');
        });
        return ['WEBVTT', cues.join('\n\n')].join('\n\n');
    }

    @computed
    get correctedCueIds() {
        return this.cues.reduce((acc, cue) => {
            if (cue.isCorrect) {
                acc.push(cue.id);
            }
            return acc;
        }, []);
    }
}

// To turn VideoJS cues into a .VTT file blob
export function createFile(caption, fileName) {
    const blob = new Blob([caption.asString], {type: 'text/vtt'});
    if (fileName) {
        // This is just an object property, not an actual fileName (like the File constructor creates).
        // We support IE11 and it doesn't support the File constructor, hence we resort to this approach.
        blob.name = fileName;
    }
    return blob;
}
