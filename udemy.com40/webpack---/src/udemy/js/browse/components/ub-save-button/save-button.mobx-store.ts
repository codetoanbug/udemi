import {I18nApi} from '@udemy/i18n';
import {udApi} from '@udemy/ud-api';
import {computed, observable} from 'mobx';

import {handleToaster, triggerClearToastMessages, FAVORITE_ENDPOINT} from './helper';
import {SaveButtonProps} from './types';

export class SaveButtonStore {
    private gettext;
    @observable private _isFetching = false;
    @observable private _isSaved = false;
    private readonly _courseId: number;
    constructor(
        courseId: SaveButtonProps['courseId'],
        enrollment: SaveButtonProps['enrollment'],
        gettext: I18nApi['gettext'],
    ) {
        this._courseId = courseId;
        this.isSaved = enrollment?.favoritedTime !== null;
        this.gettext = gettext;
    }

    @computed
    get isFetching() {
        return this._isFetching;
    }

    set isFetching(value: boolean) {
        this._isFetching = value;
    }

    @computed
    get isSaved() {
        return this._isSaved;
    }

    set isSaved(value: boolean) {
        this._isSaved = value;
    }

    async saveCourse() {
        try {
            this.isFetching = true;
            const response = await udApi.post(
                FAVORITE_ENDPOINT,
                {
                    course_id: this._courseId,
                },
                {
                    params: {
                        'fields[course]': 'favorite_time',
                    },
                },
            );
            if (response.status === 201) {
                this.isSaved = true;
                handleToaster(
                    this.gettext('Course saved'),
                    this.gettext('You can find your saved courses in "My learning"'),
                    'success',
                    {
                        ctaText: this.gettext('View saved courses'),
                        handleClick: (e) => {
                            e.preventDefault();
                            window.location.href = '/home/my-courses/saved';
                        },
                    },
                );
            }
        } catch (error) {
            handleToaster(this.gettext('Unable to save course'), '', 'error');
        } finally {
            this.isFetching = false;
        }
    }

    async unSaveCourse() {
        try {
            this.isFetching = true;
            const response = await udApi.delete(`${FAVORITE_ENDPOINT}${this._courseId}/`);
            if (response.status === 204) {
                this.isSaved = false;
                handleToaster(this.gettext('Course unsaved'));
            }
        } catch (error) {
            handleToaster(this.gettext('Unable to unsave course'), '', 'error');
        } finally {
            this.isFetching = false;
        }
    }

    async toggleSaveCourse() {
        triggerClearToastMessages();
        if (!this.isSaved) {
            return this.saveCourse();
        }
        return this.unSaveCourse();
    }
}
