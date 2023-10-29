import {EventTrackingSession} from '@udemy/event-tracking';
import {AuthenticatedUser} from '@udemy/ud-data/dist/@types/types';
import autobind from 'autobind-decorator';
import {action} from 'mobx';

import {AnyObject} from 'utils/types';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';

import {FeatureState} from './feature-discoverability.mobx-store';

// Interface for user feature settings in local storage
export interface UserFeatureData {
    featureId: number;
    lastImpressionDate: number;
    dormantStartDate: number | null;
    sessionCount: number;
    dismissForever: boolean;
    desiredAction: boolean;
    state: FeatureState;
    sessionId: string;
}

interface UDExpiringLocalStorage {
    set: (key: string, value: UserFeatureData) => void;
    get(key: string): UserFeatureData;
    delete: (key: string) => void;
    keys(): IterableIterator<string>;
    size(): number;
    clear: () => void;
    updateExpiration: (newExpirationDate: AnyObject) => void;
}

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const FEATURE_DISCOVERY_EXPIRATION_DATE = new Date(Date.now() + 365 * ONE_DAY_IN_MS);

export class UserFeatureDataStore {
    storage: UDExpiringLocalStorage;
    private readonly cacheKey: string;
    private userFeatureData: UserFeatureData;
    private readonly currentSessionId: string;
    featureId: number;

    constructor(featureId: number, featureName: string, me: AuthenticatedUser) {
        this.storage = udExpiringLocalStorage(
            'feature-discovery',
            featureName,
            FEATURE_DISCOVERY_EXPIRATION_DATE,
        );
        this.cacheKey = me.id + featureName;
        this.featureId = featureId;
        this.currentSessionId = EventTrackingSession.getEventTrackingSessionId();
        this.userFeatureData = this.getFromLocalStorage();
    }

    @autobind
    getFromLocalStorage() {
        let userFeatureData = this.storage.get(this.cacheKey);
        if (!userFeatureData) {
            userFeatureData = {
                featureId: this.featureId,
                lastImpressionDate: Date.now(),
                dormantStartDate: null,
                sessionCount: 1,
                dismissForever: false,
                desiredAction: false,
                state: FeatureState.PASSIVE,
                sessionId: this.currentSessionId,
            };
        }
        return userFeatureData;
    }

    @autobind
    @action
    setLocalStorage() {
        this.storage.set(this.cacheKey, this.userFeatureData as UserFeatureData);
    }

    get featureState() {
        return this.userFeatureData.state;
    }

    @autobind
    @action
    isNewSession() {
        const currentSessionId = EventTrackingSession.getEventTrackingSessionId();
        const sessionBoundary = this.userFeatureData.lastImpressionDate + ONE_DAY_IN_MS;
        return this.userFeatureData.sessionId != currentSessionId && sessionBoundary < Date.now();
    }

    @autobind
    @action
    updateSessionData() {
        this.userFeatureData.sessionId = EventTrackingSession.getEventTrackingSessionId();
        this.userFeatureData.lastImpressionDate = Date.now();
        this.setLocalStorage();
    }

    @autobind
    @action
    incrementSession() {
        this.userFeatureData.sessionCount += 1;
    }

    @autobind
    @action
    resetSessionCount() {
        this.userFeatureData.sessionCount = 1;
        this.setLocalStorage();
    }

    get sessionCount() {
        return this.userFeatureData.sessionCount;
    }

    @autobind
    @action
    updateFeatureStateInStorage(newState: FeatureState) {
        if (newState !== this.userFeatureData.state) {
            this.userFeatureData.state = newState;
            this.setLocalStorage();
        }
    }

    get dormantStartDate() {
        return this.userFeatureData.dormantStartDate;
    }

    setDormantStartDate(startDate: number | null) {
        this.userFeatureData.dormantStartDate = startDate;
        this.setLocalStorage();
    }

    setDismissForever(dismiss: boolean) {
        this.userFeatureData.dismissForever = dismiss;
        this.setLocalStorage();
    }

    get dismissForever() {
        return this.userFeatureData.dismissForever;
    }

    setDesiredActionDone(done: boolean) {
        this.userFeatureData.desiredAction = done;
        this.setLocalStorage();
    }

    get desiredAction() {
        return this.userFeatureData.desiredAction;
    }
}
