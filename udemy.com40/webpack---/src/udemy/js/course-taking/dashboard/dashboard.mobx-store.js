import autobind from 'autobind-decorator';
import {action, computed, observable, reaction} from 'mobx';

import {TRACKING_CATEGORIES, USER_PREFERENCES} from '../constants';
import {TABS} from './constants';

export default class DashboardStore {
    @observable isLabsTab = false;

    constructor(courseTakingStore, history) {
        this.courseTakingStore = courseTakingStore;
        this.history = history;
        reaction(
            // Redirect to Labs if the default tab changed to it
            () => this.defaultTab,
            () => {
                if (this.currentTab === TABS.CONTENT) {
                    this.history.push({
                        hash: this.defaultTab,
                    });
                }
            },
        );
    }

    @autobind
    @action
    onTabSelected(tabKey) {
        const {setPreferenceForCourse, track} = this.courseTakingStore;
        track(TRACKING_CATEGORIES.DASHBOARD, undefined, {tab: tabKey});
        setPreferenceForCourse(USER_PREFERENCES.DASHBOARD_TAB, tabKey);
        if (tabKey !== this.currentTab) {
            this.history.push({
                hash: tabKey,
            });
        }
    }

    @computed
    get defaultTab() {
        return this.courseTakingStore.isContentTabInDashboard ? TABS.CONTENT : TABS.OVERVIEW;
    }

    get previousOrDefaultTab() {
        // check when to usage
        const {getPreferenceForCourse, isContentTabInDashboard} = this.courseTakingStore;
        const previouslySelectedTab = getPreferenceForCourse(USER_PREFERENCES.DASHBOARD_TAB);
        if (!previouslySelectedTab) {
            return this.defaultTab;
        }

        // validate tab actually exists
        if (!Object.values(TABS).includes(previouslySelectedTab)) {
            return this.defaultTab;
        }

        // previous tab may also not be currently visible, if so fall back to default
        if (previouslySelectedTab === TABS.CONTENT && !isContentTabInDashboard) {
            return this.defaultTab;
        }

        return previouslySelectedTab;
    }

    get currentTab() {
        return this.history.location.hash.slice(1).split('/')[0];
    }
}
