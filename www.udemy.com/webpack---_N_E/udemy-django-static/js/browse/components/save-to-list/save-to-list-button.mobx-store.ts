import {action, observable, computed, runInAction} from 'mobx';
import React from 'react';

import {PersonalPlanCourse} from 'udemy-django-static/js/browse/types/course';
import {ListEvents, MAX_TITLE_CHARACTER_LIMIT} from 'udemy-django-static/js/browse/components/save-to-list/constants';
import {Tracker as tracker} from '@udemy/event-tracking';
import udApi from 'udemy-django-static/js/utils/ud-api';

import {
    LearningListItemSaveEvent,
    LearningListCreateEvent,
    LearningListItemRemoveEvent,
} from './events';
import {ToasterStore, AlertBannerProps} from '@udemy/react-messaging-components';

export interface ListItem {
    _class?: string;
    id: number;
    list_id: number;
    title: string;
    isSelected?: boolean;
}
export class SaveToListButtonStore {
    constructor(public course: PersonalPlanCourse, public uiRegion: string) {
        this.course = course;
        this.uiRegion = uiRegion;
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
        this.isCreatingNewList = true;
        try {
            const response = await udApi.post('/users/me/subscribed-courses-collections/', {
                title: this.newListTitle,
            });
            runInAction(() => {
                response.data.isSelected = true;
                this.myList.push(response.data);
                if (response.status === 201) {
                    tracker.publishEvent(
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
        } catch (err: any) {
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
                tracker.publishEvent(
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
        } catch (err: any) {
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
                tracker.publishEvent(
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
        } catch (err: any) {
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

    handleToaster = (message: string, body?: string, style?: string) => {
        const alertBannerProps = {
            udStyle: style ?? 'success',
            title: message,
            body: body ?? '',
            showCta: false,
        } as AlertBannerProps;
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
        } catch (err: any) {
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
