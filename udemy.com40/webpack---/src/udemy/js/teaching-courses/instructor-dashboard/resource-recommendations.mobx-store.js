import autobind from 'autobind-decorator';
import {action, computed, observable, runInAction} from 'mobx';

import udLink from 'utils/ud-link';

import {API_STATE} from '../../instructor/constants';
import udApi from '../../utils/ud-api';

export default class ResourceRecommendationsStore {
    @observable completedOnboarding;

    @observable primaryResourceKey;
    @observable secondaryResourceKey;
    @observable tertiaryResourceKey;

    @observable newcomerChallengeJoinStatusApiState = API_STATE.SEARCHING;
    @observable isEligibleToViewNewcomerChallengeComponent = false;

    constructor() {
        this.getNewcomerChallengeJoinedStatus();
    }

    @computed
    get primaryResource() {
        return this.resources[this.primaryResourceKey];
    }

    @computed
    get secondaryResource() {
        return this.resources[this.secondaryResourceKey];
    }

    @computed
    get tertiaryResource() {
        return this.resources[this.tertiaryResourceKey];
    }

    @action
    setResourceOrder(primaryResourceKey) {
        const allResources = ['teachingResource', 'videoResource', 'audienceResource'];
        if (!primaryResourceKey) {
            this.primaryResourceKey = allResources[0];
            this.secondaryResourceKey = allResources[1];
            this.tertiaryResourceKey = allResources[2];
        } else {
            this.primaryResourceKey = primaryResourceKey;
            const others = allResources.filter((elem) => elem !== primaryResourceKey);
            this.secondaryResourceKey = others[0];
            this.tertiaryResourceKey = others[1];
        }
    }

    @autobind
    async getNewcomerChallengeJoinedStatus() {
        runInAction(() => {
            this.newcomerChallengeJoinStatusApiState = API_STATE.SEARCHING;
        });
        try {
            const response = await udApi.get('/users/me/newcomer-challenge/');
            if (response.status === 204) {
                runInAction(() => {
                    this.isEligibleToViewNewcomerChallengeComponent = true;
                    this.newcomerChallengeJoinStatusApiState = API_STATE.DONE;
                });
            } else {
                runInAction(() => {
                    this.isEligibleToViewNewcomerChallengeComponent = false;
                    this.newcomerChallengeJoinStatusApiState = API_STATE.DONE;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.isEligibleToViewNewcomerChallengeComponent = false;
                this.newcomerChallengeJoinStatusApiState = API_STATE.DONE;
            });
        }
    }

    resources = {
        videoResource: {
            name: 'video',
            title: gettext('Get Started with Video'),
            primaryText: gettext(
                "We've put together a library of resources to help you make " +
                    'great course videos. With video lectures, you can share your knowledge with ' +
                    'students around the world in the most engaging way.',
            ),
            secondaryText: gettext(
                'Quality video lectures can set your course apart. Use our ' +
                    'resources to learn the basics.',
            ),
            image: udLink.toStorageStaticAsset('instructor/dashboard/video-creation.jpg'),
            image2x: udLink.toStorageStaticAsset('instructor/dashboard/video-creation-2x.jpg'),
            imgSize: {width: 300, height: 300},
            urlText: gettext('Get Started'),
            url: '/instructor/resources/?page=video',
        },
        teachingResource: {
            name: 'teaching',
            title: gettext('Create an Engaging Course'),
            primaryText: gettext(
                "Whether you've been teaching for years or are teaching for the " +
                    "first time, you can make an engaging course. We've compiled resources and best " +
                    "practices to help you get to the next level, no matter where you're starting.",
            ),
            secondaryText: gettext(
                'Learn how to build the most compelling course for your students. ' +
                    'Review our best practices.',
            ),
            image: udLink.toStorageStaticAsset('instructor/dashboard/engaging-course.jpg'),
            image2x: udLink.toStorageStaticAsset('instructor/dashboard/engaging-course-2x.jpg'),
            imgSize: {width: 300, height: 300},
            urlText: gettext('Get Started'),
            url: '/instructor/resources/?page=teaching',
        },
        audienceResource: {
            name: 'audience',
            title: gettext('Build Your Audience'),
            primaryText: gettext(
                'Set your course apart in our thriving marketplace by building ' +
                    'an audience for your course. Use our resources to meet your goals and capture ' +
                    'new students.',
            ),
            secondaryText: gettext('Set your course up for success by building your audience.'),
            image: udLink.toStorageStaticAsset('instructor/dashboard/build-audience.jpg'),
            image2x: udLink.toStorageStaticAsset('instructor/dashboard/build-audience-2x.jpg'),
            imgSize: {width: 300, height: 300},
            urlText: gettext('Get Started'),
            url: '/instructor/resources/?page=audience',
        },
    };
}
