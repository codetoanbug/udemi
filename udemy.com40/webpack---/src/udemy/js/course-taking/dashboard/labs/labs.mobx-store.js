import {action, computed, observable} from 'mobx';

import {
    LABS_FOR_COURSE_API_PARAMS,
    LAB_LINKS_API_PARAMS,
    labsForCourseApiUrl,
    labLinksApiUrl,
} from 'labs/apis';
import {LAB_INSTANCE_STATUS} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';
import {LabVerticalSystemEventStore} from 'labs/system-event/lab-vertical-system-event.mobx-store';
import {checkLabAlmostOutOfResources} from 'labs/utils';
import udApi from 'utils/ud-api';

export default class LabsStore {
    @observable labs = [];
    @observable allWorkspaceEnabledLectures = [];
    @observable isLoading = true;
    @observable showSkipLabsSetup = false;
    @observable showWorkspaceEnabledLecturesPrompt = false;
    @observable hasSeenLabsAlmostOutOfResourcesNotification = true;
    @observable hasSeenLabsSkipSetupNotification = true;
    @observable hasSeenWorkspaceEnabledLecturesPrompt = true;
    @observable isLabOutOfResources = false;
    @observable isLabAlmostOutOfResources = false;
    @observable tryWorkspacesClicked = false;
    @observable.ref labVerticalSystemEventStore = new LabVerticalSystemEventStore();

    constructor(courseId) {
        this.courseId = courseId;
    }

    async loadLabs() {
        this._setIsLoading(true);

        const labParams = {
            'fields[lab]': LABS_FOR_COURSE_API_PARAMS,
        };

        const response = await udApi.get(labsForCourseApiUrl(this.courseId), {
            params: labParams,
        });

        this.setLabs(response.data.results || []);
        if (this.hasLabs) {
            const {id, vertical} = this.labs[0];
            await this.labVerticalSystemEventStore.loadMessages(vertical, id);
        }
        this.labs.forEach(async (lab, index) => {
            const linksResponse = await udApi.get(labLinksApiUrl(lab.id), {
                params: LAB_LINKS_API_PARAMS,
            });
            const links = linksResponse.data.results.filter(
                (link) => link.link_type === 'launcher',
            );
            this.setWorkspaceEnabledLectures(index, links);
            if (lab.myLatestInstance?.status === LAB_INSTANCE_STATUS.deactivated) {
                this.setIsLabOutOfResources(true);
            } else if (checkLabAlmostOutOfResources(lab)) {
                this.setIsLabAlmostOutOfResources(true);
            }
        });

        this._setIsLoading(false);
    }

    @action
    setLabs(labs) {
        this.labs = labs.map((lab) => {
            return new Lab(lab);
        });
    }

    @computed
    get hasLabs() {
        return Boolean(this.labs && this.labs.length);
    }

    @action
    _setIsLoading(value) {
        this.isLoading = value;
    }

    @action
    setShowSkipLabsSetup(value = false) {
        this.showSkipLabsSetup = value;
    }

    @action
    setWorkspaceEnabledLectures(labIndex, links) {
        this.labs[labIndex].setWorkspaceEnabledLectures(links);
        this.allWorkspaceEnabledLectures.push(...this.labs[labIndex].workspaceEnabledLectures);
    }

    @action
    setIsLabOutOfResources(value = true) {
        this.isLabOutOfResources = value;
    }

    @action
    setIsLabAlmostOutOfResources(value = true) {
        this.isLabAlmostOutOfResources = value;
    }

    @action
    setShowWorkspaceEnabledLecturesPrompt(value = false) {
        this.showWorkspaceEnabledLecturesPrompt = value;
    }

    @action
    setHasSeenLabsAlmostOutOfResourcesNotification(value = true) {
        this.hasSeenLabsAlmostOutOfResourcesNotification = value;
    }

    @action
    setHasSeenLabsSkipSetupNotification(value = true) {
        this.hasSeenLabsSkipSetupNotification = value;
    }

    @action
    setHasSeenWorkspaceEnabledLecturesPrompt(value = false) {
        this.hasSeenWorkspaceEnabledLecturesPrompt = value;
    }

    @action
    setTryWorkspacesClicked(value = false) {
        this.tryWorkspacesClicked = value;
    }
}
