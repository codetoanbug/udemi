import {Tracker} from '@udemy/event-tracking';
import {I18nApi} from '@udemy/i18n';
import {ToasterStore, AlertLevel, AlertBannerProps} from '@udemy/react-messaging-components';
import {action, observable, computed, runInAction} from 'mobx';
import React from 'react';

import {ListEvents, MAX_TITLE_CHARACTER_LIMIT} from 'browse/components/save-to-list/constants';
import {PersonalPlanCourse} from 'browse/types/course';
import udApi from 'utils/ud-api';

import {
    LearningListItemSaveEvent,
    LearningListCreateEvent,
    LearningListItemRemoveEvent,
} from './events';

export interface ListItem {
    _class?: string;
    id: number;
    list_id: number;
    title: string;
    isSelected?: boolean;
}

type I18nApiSubset = Pick<I18nApi, 'interpolate' | 'gettext'>;
export class SaveToListButtonStore {
    private i18n: I18nApiSubset;
    constructor(public course: PersonalPlanCourse, public uiRegion: string, i18n: I18nApiSubset) {
        this.course = course;
        this.uiRegion = uiRegion;
        this.i18n = i18n;
    }

    // Modal properties
    @observable isModalOpen = false;
    @observable isFetchingData = false;
    @observable hasError = false;
    @observable isSubmitting = new Set<number>();

    // Learning list
    @observable myList: ListItem[] = [];

    // Create list form
    @observable newListTitle = '';
    @observable titleTooLong = false;
    @observable isNewListFormVisible = false;
    @observable isCreatingNewList = false;

    @action
    setNewListTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value.trim();
        if (title.length > MAX_TITLE_CHARACTER_LIMIT) {
            this.titleTooLong = true;
        } else {
            this.newListTitle = title;
            this.titleTooLong = false;
        }
    };

    @action
    createList = async () => {
        const {gettext, interpolate} = this.i18n;
        this.isCreatingNewList = true;
        try {
            const response = await udApi.post('/users/me/subscribed-courses-collections/', {
                title: this.newListTitle,
            });
            runInAction(() => {
                response.data.isSelected = true;
                this.myList.push(response.data);
                if (response.status === 201) {
                    Tracker.publishEvent(
                        new LearningListCreateEvent({
                            listId: response.data.list_id,
                            uiRegion: this.uiRegion,
                            nonInteraction: false,
                        }),
                    );
                    this.saveToList(response.data.id, response.data.title);
                    // Optimistically allow the UI to update immediately
                    document.dispatchEvent(
                        new CustomEvent(ListEvents.CREATE, {
                            detail: {collectionId: response.data.id},
                        }),
                    );
                }
            });
        } catch (err) {
            runInAction(() => {
                this.hasError = true;
            });
            const errData = err.response?.data;
            const errMessage = (errData?.results && errData.results[0]) || errData?.detail;
            this.handleToaster(
                interpolate(
                    gettext('Failed to save to %(listTitle)s'),
                    {
                        listTitle: this.newListTitle,
                    },
                    true,
                ),
                errMessage,
                'error',
            );
        } finally {
            runInAction(() => {
                this.newListTitle = '';
                this.isNewListFormVisible = false;
                this.isCreatingNewList = false;
            });
        }
    };

    @action
    toggleNewListForm = () => {
        this.isNewListFormVisible = !this.isNewListFormVisible;
    };

    @action
    openModal = () => {
        this.isModalOpen = true;
    };

    @action
    hideModal = () => {
        this.hasError = false;
        this.myList = [];
        this.isModalOpen = false;
    };

    @action
    toggleList = async (targetId: number) => {
        this.hasError = false;
        // Toggle the list in save to list modal
        this.myList = this.myList.map((list) => {
            if (list.id === targetId) {
                list.isSelected = !list.isSelected;
            }
            return list;
        });
    };

    @action
    removeFromList = async (selectedListId: number, selectedListTitle?: string) => {
        const {gettext, interpolate} = this.i18n;
        this.isSubmitting.add(selectedListId);
        try {
            const response = await udApi.delete(
                `/users/me/subscribed-courses-collections/${selectedListId}/courses/${this.course.id}/`,
            );
            if (response.status === 204) {
                document.dispatchEvent(
                    new CustomEvent(ListEvents.REMOVE, {
                        detail: {course: this.course, listId: selectedListId},
                    }),
                );
                // course from course taking does not have a frontendTrackingId
                Tracker.publishEvent(
                    new LearningListItemRemoveEvent({
                        listId: selectedListId,
                        courseId: this.course.id,
                        trackingId: this.course.frontendTrackingId
                            ? this.course.frontendTrackingId
                            : '',
                        uiRegion: `${this.uiRegion}`,
                    }),
                );
                this.handleToaster(gettext('Removed from list'));
            }
            runInAction(() => {
                this.isSubmitting.delete(selectedListId);
            });
        } catch (err) {
            runInAction(() => (this.hasError = true));
            const errData = err.response?.data;
            const errMessage = (errData?.results && errData.results[0]) || errData?.detail;
            this.handleToaster(
                interpolate(
                    gettext('Failed to remove from %(listTitle)s'),
                    {listTitle: selectedListTitle},
                    true,
                ),
                errMessage,
                'error',
            );
        } finally {
            runInAction(() => {
                this.isSubmitting.delete(selectedListId);
            });
        }
    };

    @action
    saveToList = async (selectedListId: number, selectedListTitle: string) => {
        const {gettext, interpolate} = this.i18n;
        this.isSubmitting.add(selectedListId);
        try {
            const response = await udApi.post(
                `/users/me/subscribed-courses-collections/${selectedListId}/courses/`,
                {
                    course: this.course.id,
                },
            );
            if (response.status === 201) {
                document.dispatchEvent(
                    new CustomEvent(ListEvents.ADD, {
                        detail: {course: this.course, listId: selectedListId},
                    }),
                );
                Tracker.publishEvent(
                    new LearningListItemSaveEvent({
                        listId: selectedListId,
                        courseId: this.course.id,
                        trackingId: this.course.frontendTrackingId
                            ? this.course.frontendTrackingId
                            : '',
                        uiRegion: `${this.uiRegion}`,
                    }),
                );
                this.handleToaster(gettext('Saved to list'));
            }

            runInAction(() => {
                this.isSubmitting.delete(selectedListId);
            });
        } catch (err) {
            runInAction(() => (this.hasError = true));
            const errData = err.response?.data;
            const errMessage = (errData?.results && errData.results[0]) || errData?.detail;
            this.handleToaster(
                interpolate(
                    gettext('Failed to save to %(listTitle)s'),
                    {
                        listTitle: selectedListTitle,
                    },
                    true,
                ),
                errMessage,
                'error',
            );
        } finally {
            runInAction(() => {
                this.isSubmitting.delete(selectedListId);
            });
        }
    };

    handleToaster = (message: string, body?: string, style?: AlertLevel) => {
        const alertBannerProps: AlertBannerProps = {
            udStyle: style ?? 'success',
            title: message,
            body: body ?? '',
            showCta: false,
        };
        ToasterStore.addAlertBannerToast(alertBannerProps, {
            autoDismiss: true,
            autoDismissTimeout: 5000,
        });
    };

    @computed
    get selectedList() {
        return this.myList.filter((list) => list.isSelected);
    }

    @action
    fetchListData = async () => {
        const {gettext} = this.i18n;
        // Fetching the user's list and selected list with given course id
        this.isFetchingData = true;
        const loadLists = udApi.get('/users/me/subscribed-courses-collections/');
        const loadSelectedLists = udApi.get(
            `/users/me/subscribed-courses/${this.course.id}/collections/`,
        );

        try {
            const [listResponse, selectedListResponse] = await Promise.all([
                loadLists,
                loadSelectedLists,
            ]);
            const selectedLists = selectedListResponse.data.results;
            const allLists = listResponse.data.results;
            runInAction(() => {
                allLists.forEach((listItem: ListItem) => {
                    listItem.isSelected = selectedLists.some(
                        (item: ListItem) => item.id === listItem.id,
                    );
                });

                this.myList = allLists;
            });
        } catch (err) {
            runInAction(() => (this.hasError = true));
            const errData = err.response?.data;
            const errMessage = (errData?.results && errData.results[0]) || errData?.detail;
            this.handleToaster(gettext('Failed to load lists'), errMessage, 'error');
        } finally {
            runInAction(() => {
                this.isFetchingData = false;
            });
        }
    };
}
