import {action, computed, observable, runInAction} from 'mobx';

import loadMeasureCompetenceUnit from 'browse/lib/load-measure-competence-assessments-unit';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';
import udGraphql from 'utils/ud-graphql';
import Raven from 'utils/ud-raven';

import {CONSUMER_SUBS_COLLECTION_ID, UB_COLLECTION_ID} from './constants';

const HOW_IT_WORKS_EXPIRATION_DATE = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
const LIMIT_ATTEMPTS_BANNER_EXPIRATION_DATE = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

export const fromGlobalID = (type, gId) => {
    const buff = new Buffer(gId, 'base64');
    const parsed = buff.toString('ascii').split(':');
    if (parsed.length !== 2) {
        throw new Error('Global ID invalid');
    }
    if (parsed[0] !== type) {
        throw new Error('Global ID type mismatch');
    }
    return Number(parsed[1]);
};

export const fromIntOrGlobalID = (type, id) => {
    let dbId = parseInt(id, 10);
    if (isNaN(dbId)) {
        dbId = fromGlobalID(type, id);
    }

    return dbId;
};

function parseResponseGroups(data) {
    const groups = data.testletGroupCollectionV2.groups || [];

    return groups.map((group) => {
        group.id = fromIntOrGlobalID('TestletGroup', group.id);
        return group;
    });
}

export default class AssessmentsStore {
    @observable groups = [];
    @observable allGroups = [];
    @observable inProgressGroups = [];
    @observable completedGroups = [];
    @observable inProgressIds = new Set();
    @observable completedIds = new Set();

    @observable isLoading = true;
    @observable allGroupsAreLoaded = false;
    @observable inProgressAndCompletedGroupsAreLoaded = false;
    @observable isInProgressOrCompleted = false;
    @observable shouldShowHowItWorksBanner = false;

    @observable filterString = '';
    @observable selectedOrdering;
    @observable isConsumerSubsSubscriber = false;

    @observable _showLimitAttemptsBanner = null;

    constructor(isConsumerSubsSubscriber) {
        this.groupsQuery = `
            query get_collection($input: TestletGroupCollectionInputV2!) {
              testletGroupCollectionV2(collectionInput: $input) {
                groups {
                  id
                  title
                  slug
                  description
                  isBeta
                }
              }
            }
        `;
        this.isConsumerSubsSubscriber = isConsumerSubsSubscriber;
        this.storage = udExpiringLocalStorage(
            'assessments',
            'how-it-works',
            HOW_IT_WORKS_EXPIRATION_DATE,
        );
        this.limitAttemptsStorage = udExpiringLocalStorage(
            'assessments',
            'show-limit-attempts-banner',
            LIMIT_ATTEMPTS_BANNER_EXPIRATION_DATE,
        );
    }

    @action
    setHowItWorksBannerState() {
        const hasSeenBanner = this.storage.get('hasSeenBanner') || false;
        if (!hasSeenBanner) {
            this.storage.set('hasSeenBanner', true);
        }
        this.shouldShowHowItWorksBanner = !hasSeenBanner;
    }

    @action
    dismissLimitAttemptsBanner() {
        this.limitAttemptsStorage.set('hasSeenBanner', true);
        this._showLimitAttemptsBanner = false;
    }

    @computed
    get showLimitAttemptsBanner() {
        if (this._showLimitAttemptsBanner === null) {
            this._showLimitAttemptsBanner = !(
                this.limitAttemptsStorage.get('hasSeenBanner') || false
            );
        }
        return this._showLimitAttemptsBanner;
    }

    @action
    setGroups(tabId) {
        switch (tabId) {
            case 'inProgress':
                this.groups = this.inProgressGroups;
                this.isInProgressOrCompleted = true;
                break;
            case 'completed':
                this.groups = this.completedGroups;
                this.isInProgressOrCompleted = true;
                break;
            default:
                this.groups = this.allGroups;
                this.isInProgressOrCompleted = false;
                break;
        }
    }

    @action
    setLoadingState() {
        if (this.allGroupsAreLoaded && this.inProgressAndCompletedGroupsAreLoaded) {
            this.isLoading = false;
        }
    }

    @action
    setOrdering(ordering) {
        if (ordering !== this.selectedOrdering) {
            this.selectedOrdering = ordering;
            this._sortGroups();
        }
    }

    @action
    _sortGroups() {
        switch (this.selectedOrdering) {
            case 'newest':
                this.groups = this.groups.sort((groupA, groupB) => groupB.id - groupA.id);
                break;
            case 'oldest':
                this.groups = this.groups.sort((groupA, groupB) => groupA.id - groupB.id);
                break;
            case 'title_asc':
                this.groups = this.groups.sort((groupA, groupB) =>
                    groupA.title.localeCompare(groupB.title),
                );
                break;
            case 'title_desc':
                this.groups = this.groups.sort((groupA, groupB) =>
                    groupB.title.localeCompare(groupA.title),
                );
                break;
        }
    }

    @action
    setFilterString(value) {
        this.filterString = value;
    }

    @computed
    get filteredGroups() {
        return this.groups.filter((group) =>
            group.title.toLowerCase().includes(this.filterString.toLowerCase().trim()),
        );
    }

    @computed
    get isSortingDisabled() {
        return this.groups.length < 2;
    }

    async loadAllGroups() {
        try {
            const response = await udGraphql.query({
                query: this.groupsQuery,
                variables: {
                    input: {
                        collectionId: this.isConsumerSubsSubscriber
                            ? CONSUMER_SUBS_COLLECTION_ID
                            : UB_COLLECTION_ID,
                    },
                },
            });

            const groups = parseResponseGroups(response.data);

            // Sort assessments alphabetically
            this.allGroups = groups.sort((groupA, groupB) =>
                groupA.title.localeCompare(groupB.title),
            );

            this.setGroups();

            /**
             * Returning `response` here so we know things have resolved properly in
             * `my-learning-unit.mobx-store`. The `response` itself isn't leveraged there.
             */
            return response;
        } catch (e) {
            Raven.captureException(e);
        } finally {
            this.allGroupsAreLoaded = true;
            this.setLoadingState();
        }
    }

    async loadInProgressAndCompletedGroups() {
        try {
            const data = await loadMeasureCompetenceUnit(this.isConsumerSubsSubscriber);

            runInAction(() => {
                this.inProgressGroups = data.filter((assessment) => {
                    if (assessment.type === 'inProgress') {
                        // inProgressIds list needs for determine the assessment card status in "all"  tab
                        this.inProgressIds.add(assessment.groupId);
                        return true;
                    }
                    return false;
                });
                this.completedGroups = data.filter((assessment) => {
                    if (assessment.type === 'completed') {
                        // completedIds list needs for determine the assessment card status in "all"  tab
                        this.completedIds.add(assessment.groupId);
                        return true;
                    }
                    return false;
                });
            });
        } catch (e) {
            Raven.captureException(e);
        } finally {
            this.inProgressAndCompletedGroupsAreLoaded = true;
            this.setLoadingState();
        }
    }
}
