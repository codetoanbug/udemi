import autobind from 'autobind-decorator';
import {observable, action, runInAction} from 'mobx';
import React from 'react';

import udApi from '../utils/ud-api';
import {API_STATE, JOIN_NEWCOMER_CHALLENGE_STATUS_STATE} from './constants';
import {showErrorToast} from './toasts';

const NEWCOMER_CHALLENGE_TOAST_MESSAGES = {
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR]: {
        title: (
            <>
                {gettext('Oops! Something went wrong. Visit our ')}
                <a href="https://support.udemy.com/hc/en-us">{gettext('support page')}</a>
                {gettext(' for further assistance.')}
            </>
        ),
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_PUBLISHED]: {
        title: gettext('Oops! Looks like you’ve already published a course. '),
        props: {
            body: (
                <>
                    {gettext(
                        'The New Instructor Challenge is only open to new instructors who haven’t published their first course yet. Get tips for creating a new course or marketing an existing one in the ',
                    )}
                    <a href="https://teach.udemy.com/">{gettext('Teaching Center.')}</a>
                </>
            ),
        },
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED]: {
        title: gettext('Oops! Looks like you’ve already joined the New Instructor Challenge.'),
        props: {
            body: (
                <>
                    {gettext("Maybe you're looking to ")}
                    <a href="/instructor/courses/">{gettext('work on your course?')}</a>
                </>
            ),
        },
    },
};

const HERO_CONTENT = {
    opps: gettext('Oops!'),
    congratulations: gettext('Congratulations'),
    welcomeToTheNewInstructorChallenge: [
        gettext('Welcome to the'),
        gettext('New Instructor Challenge'),
    ],
    joinNow: gettext('Join now'),
    publishPromote: [
        gettext('Publish your first course in 45 days'),
        gettext('— we’ll even help you promote it'),
    ],
    startYourCourse: gettext('Start Creating Your Course'),
    workOnYourCourse: gettext('Work On Your Course'),
    visitTeachingCenter: gettext('Visit Teaching Center'),
    alreadyJoinedSubtitleLines: [
        gettext(
            'Looks like you’ve already joined the New Instructor Challenge. Maybe ' +
                "you're looking to work on your course?",
        ),
    ],
    alreadyPublishedSubtitleLines: [
        gettext(
            'Looks like you’ve already published a course. The New Instructor ' +
                'Challenge is only open to new instructors who haven’t published their ' +
                'first course yet. Get tips for creating a new course or marketing an ' +
                'existing one in the Teaching Center.',
        ),
    ],
    successfullyJoinedSubtitleLines: [
        gettext(
            'You’re signed up for the New Instructor Challenge and on your way to ' +
                'creating your first course. Keep an eye out for a welcome email with ' +
                'details on how we’ll help you get started.',
        ),
    ],
};

export const NEWCOMER_CHALLENGE_HERO_CONTENTS = {
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED]: {
        titleLines: [HERO_CONTENT.opps],
        subtitleLines: HERO_CONTENT.alreadyJoinedSubtitleLines,
        buttonContent: {
            text: HERO_CONTENT.workOnYourCourse,
            href: '/instructor/courses/',
            disabled: false,
            componentClass: 'a',
        },
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.NOT_JOINED]: {
        titleLines: HERO_CONTENT.welcomeToTheNewInstructorChallenge,
        subtitleLines: HERO_CONTENT.publishPromote,
        buttonContent: {
            text: HERO_CONTENT.joinNow,
        },
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.SUCCESSFULLY_JOINED]: {
        titleLines: [HERO_CONTENT.congratulations],
        subtitleLines: HERO_CONTENT.successfullyJoinedSubtitleLines,
        buttonContent: {
            text: HERO_CONTENT.startYourCourse,
            href: '/instructor/courses/',
            componentClass: 'a',
        },
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_PUBLISHED]: {
        titleLines: [HERO_CONTENT.opps],
        subtitleLines: HERO_CONTENT.alreadyPublishedSubtitleLines,
        buttonContent: {
            text: HERO_CONTENT.visitTeachingCenter,
            href: 'https://teach.udemy.com/',
            disabled: false,
            componentClass: 'a',
        },
    },
    [JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR]: {
        titleLines: HERO_CONTENT.welcomeToTheNewInstructorChallenge,
        subtitleLines: HERO_CONTENT.publishPromote,
        buttonContent: {
            text: HERO_CONTENT.joinNow,
        },
    },
};

export default class NewcomerChallengeStore {
    @observable isIntendedToJoin = false;
    @observable newcomerChallengeJoinedStatus;
    @observable apiState = API_STATE.SEARCHING;

    @action
    setIsIntendedToJoin(value) {
        this.isIntendedToJoin = value;
    }

    constructor() {
        this.getNewcomerChallengeJoinedStatus();
    }

    @autobind
    async getNewcomerChallengeJoinedStatus() {
        runInAction(() => {
            this.apiState = API_STATE.SEARCHING;
        });
        try {
            const response = await udApi.get('/users/me/newcomer-challenge/');
            if (response.status === 200) {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus =
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED;
                    this.apiState = API_STATE.DONE;
                });
            } else if (response.status === 204) {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus =
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.NOT_JOINED;
                    this.apiState = API_STATE.DONE;
                });
            } else if (response.status === 207) {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus =
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_PUBLISHED;
                    this.apiState = API_STATE.DONE;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.newcomerChallengeJoinedStatus = JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR;
                this.apiState = API_STATE.ERROR;
            });
        }
    }

    @autobind
    @action
    async joinTheNewcomerChallenge() {
        runInAction(() => {
            this.apiState = API_STATE.SEARCHING;
        });
        try {
            const response = await udApi.post('/users/me/newcomer-challenge/');
            if (response.status === 200) {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus =
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.SUCCESSFULLY_JOINED;
                    this.apiState = API_STATE.DONE;
                });
            }
        } catch (error) {
            if (error.response.status === 400) {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus =
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED;
                });
                showErrorToast(
                    NEWCOMER_CHALLENGE_TOAST_MESSAGES[
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED
                    ].title,
                    NEWCOMER_CHALLENGE_TOAST_MESSAGES[
                        JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ALREADY_JOINED
                    ].props,
                );
            } else {
                runInAction(() => {
                    this.newcomerChallengeJoinedStatus = JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR;
                });
                showErrorToast(
                    NEWCOMER_CHALLENGE_TOAST_MESSAGES[JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR]
                        .title,
                );
            }
        }
    }
}
