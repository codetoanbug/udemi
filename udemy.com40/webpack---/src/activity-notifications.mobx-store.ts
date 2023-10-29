import {AxiosResponse} from 'axios';
import {action, observable} from 'mobx';

import {I18nApi} from '@udemy/i18n';
import {captureException} from '@udemy/sentry';
import {udApi} from '@udemy/ud-api';

import {ActivityNotificationModel} from './activity-notification.mobx-model';
import {PAGE_SIZE, RELATION_TYPES} from './constants';

export type ValidTabName = 'instructor' | 'student';
const TabNames: ValidTabName[] = ['instructor', 'student'];

export interface TabState {
    _invalidActivitiesCount: number;
    _invalidUnreadActivitiesCount: number;
    hasNextPage: boolean;
    loadingState: 'LOADED' | 'LOADING' | 'NOT_LOADED';
    notifications: ActivityNotificationModel[];
    page: number;
    totalActivitiesCount: number;
    unreadActivitiesCount: number;
}

interface User {
    num_of_unread_activity_notifications?: number;
}

const createInitialTabState = (): TabState => {
    // `loadingState`: 'NOT_LOADED' initially, 'LOADING' if a request is in progress,
    // 'LOADED' if at least one page of notifications has been loaded.
    //
    // `notifications`: the notification objects that have been loaded thus far.
    // We load notifications in sequential page order. The next page of notifications
    // gets appended to the array.
    //
    // `page`: the current page number.
    //
    // `totalActivitiesCount`: the total number of *activities*, not the total number of
    // notifications. Activities are grouped- each `notification` in the `notifications`
    // array has an `activities` array which contains at least one activity.
    //
    // `unreadActivitiesCount`: the total number of unread *activities*.
    //
    // `_invalidActivitiesCount` and `_invalidUnreadActivitiesCount`: how many invalid
    // activities we've received from the API. We use these to correct `totalActivitiesCount`
    // and `unreadActivitiesCount`, respectively.
    return {
        _invalidActivitiesCount: 0,
        _invalidUnreadActivitiesCount: 0,
        hasNextPage: true,
        loadingState: 'NOT_LOADED',
        notifications: [],
        page: 0,
        totalActivitiesCount: 0,
        unreadActivitiesCount: 0,
    };
};

export class ActivityNotificationsStore {
    @observable activeTabName: ValidTabName | null = null;
    @observable instructor!: TabState | null;
    @observable student!: TabState | null;
    @observable user: User | null = null;
    @observable userType: ValidTabName | null = null;
    i18nApi: I18nApi;

    constructor(i18nApi: I18nApi) {
        this.i18nApi = i18nApi;
    }

    @action setUserSpecificContext(params: {user: User; userType: string | null}) {
        this.user = params.user;
        this.setNavUserType(params.userType as ValidTabName);
        this.activeTabName = null;
        this.instructor = createInitialTabState();
        this.student = createInitialTabState();
    }

    @action setNavUserType(userType: ValidTabName | null) {
        this.userType = userType;
    }

    get editNotificationsURL() {
        if (this.userType === 'instructor') {
            return '/instructor/account/notifications/';
        }
        return '/user/edit-notifications/';
    }

    get viewNotificationsURL() {
        if (this.userType === 'instructor') {
            return '/instructor/user/view-notifications/';
        }
        return '/user/view-notifications/';
    }

    @action
    setActiveTab(tabName: ValidTabName) {
        this.activeTabName = tabName;
    }

    @action
    initializeNotifications = () => {
        const promises: Promise<AxiosResponse>[] = [];
        const successes: Record<ValidTabName, AxiosResponse> = {} as Record<
            ValidTabName,
            AxiosResponse
        >;
        const errors: Record<ValidTabName, unknown> = {} as Record<ValidTabName, unknown>;
        TabNames.forEach((tabName: ValidTabName) => {
            const tab = this[tabName as ValidTabName];
            if (tab && tab.loadingState === 'NOT_LOADED') {
                const requestPromise = this._requestNotifications(tabName, tab, {
                    with_empty_state: '1',
                })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((response: any) => {
                        successes[tabName as ValidTabName] = response;
                        return response;
                    })
                    .catch((error) => {
                        errors[tabName as ValidTabName] = error;
                    });
                promises.push(requestPromise);
            }
        });
        if (promises.length > 0) {
            Promise.all(promises)
                .then(
                    action(() => {
                        // We do this in one action so that there aren't any flickering effects when
                        // updating the total number of unread notifications.
                        Object.entries(successes).forEach(
                            ([tabName, response]: [string, AxiosResponse]) => {
                                if (response.data.empty_state === 'NONE') {
                                    this[tabName as ValidTabName] = null;
                                } else {
                                    this._requestNotificationsSuccess(
                                        this[tabName as ValidTabName] as TabState,
                                        response,
                                    );
                                }
                            },
                        );
                        Object.entries(errors).forEach(([tabName, error]) => {
                            this._requestNotificationsError(
                                this[tabName as ValidTabName] as TabState,
                                error,
                            );
                        });

                        if (this.instructor) {
                            this.activeTabName = 'instructor';
                        } else if (this.student) {
                            this.activeTabName = 'student';
                        }
                    }),
                )
                .catch((e) => {
                    captureException(e);
                });
        }
    };

    @action
    loadNextPageOfNotifications(tabName: ValidTabName) {
        const tab = this[tabName] as TabState;
        if (tab.loadingState === 'LOADING') {
            return;
        }
        this._requestNotifications(tabName, tab)
            .then((response) => {
                this._requestNotificationsSuccess(tab, response);
            })
            .catch((error) => {
                this._requestNotificationsError(tab, error);
            });
    }

    _requestNotifications(
        tabName: ValidTabName,
        tab: {loadingState: string; page: number},
        params?: {with_empty_state: string},
    ): Promise<AxiosResponse> {
        tab.loadingState = 'LOADING';
        return udApi.get('/users/me/notifications/', {
            params: {
                page: tab.page + 1,
                page_size: PAGE_SIZE,
                relation_type: RELATION_TYPES[tabName],
                'fields[actstream_action]': 'actor,target,action_object,timestamp,text,is_read',
                'fields[course_discussion]': '@min,title',
                'fields[user]': '@min,image_100x100,initials',
                ...params,
            },
        });
    }

    @action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _requestNotificationsSuccess(tab: TabState, response: AxiosResponse<any>) {
        const results = response.data.results || [];
        const count = response.data.count || 0;
        const unreadCount = response.data.unread_count || 0;
        const modelArray = results
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((data: any) => new ActivityNotificationModel(data, this.i18nApi));
        modelArray.forEach(
            (notification: {isValid: boolean; activities: unknown[]; isRead: boolean}) => {
                if (notification.isValid) {
                    tab.notifications.push(notification as ActivityNotificationModel);
                } else {
                    tab._invalidActivitiesCount += notification.activities.length;
                    if (!notification.isRead) {
                        tab._invalidUnreadActivitiesCount += notification.activities.length;
                    }
                }
            },
        );
        tab.page += 1;
        tab.hasNextPage = !!response.data.next;
        tab.totalActivitiesCount = Math.max(count - tab._invalidActivitiesCount, 0);
        tab.unreadActivitiesCount = Math.max(unreadCount - tab._invalidUnreadActivitiesCount, 0);
        this._updateUnreadCountForAllTabs();
        tab.loadingState = 'LOADED';
    }

    @action
    _requestNotificationsError(tab: {loadingState: string}, error: unknown) {
        tab.loadingState = 'LOADED';
        captureException(error);
    }

    @action
    markNotificationAsRead(notification: ActivityNotificationModel, tabName: ValidTabName) {
        const ids = notification.activities.map((activity: {id: number}) => activity.id);
        const deltaUnreadCount = Math.min(
            this[tabName]?.unreadActivitiesCount as number,
            ids.length,
        );
        notification.setIsRead(true);
        this._updateUnreadCountForTab(tabName, -deltaUnreadCount);
        let apiPromise;
        if (ids.length > 1) {
            apiPromise = udApi.patch('/users/me/notifications/', {
                ids,
                is_read: 'True',
                relation_type: RELATION_TYPES[tabName],
            });
        } else if (ids.length === 1) {
            apiPromise = udApi.patch(`/users/me/notifications/${ids[0]}/`, {
                is_read: 'True',
                relation_type: RELATION_TYPES[tabName],
            });
        } else {
            // This can never happen- `notification.isValid` is only true if it has at least
            // one activity, and we only push a notification to `tab.notifications` if it is valid.
            throw new Error('Invalid notification with zero activities');
        }
        apiPromise.catch(
            action((error) => {
                notification.setIsRead(false);
                this._updateUnreadCountForTab(tabName, deltaUnreadCount);
                captureException(error);
            }),
        );
    }

    @action
    markAllNotificationsAsRead(tabName: ValidTabName) {
        const tab = this[tabName] as TabState;
        const unreadNotifications = tab.notifications.filter(
            (notification: ActivityNotificationModel) => !notification.isRead,
        );
        unreadNotifications.forEach((notification: {setIsRead: (arg0: boolean) => void}) => {
            notification.setIsRead(true);
        });
        const deltaUnreadCount = Math.min(
            tab.unreadActivitiesCount,
            unreadNotifications.reduce((acc, curr) => acc + curr.activities.length, 0),
        );
        this._updateUnreadCountForTab(tabName, -deltaUnreadCount);
        udApi
            .patch('/users/me/notifications/', {
                ids: 'all',
                is_read: 'True',
                relation_type: RELATION_TYPES[tabName],
            })
            .catch(
                action((error) => {
                    unreadNotifications.forEach(
                        (notification: {setIsRead: (arg0: boolean) => void}) => {
                            notification.setIsRead(false);
                        },
                    );
                    this._updateUnreadCountForTab(tabName, deltaUnreadCount);
                    captureException(error);
                }),
            );
    }

    _updateUnreadCountForTab(tabName: ValidTabName, delta: number) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this[tabName]!.unreadActivitiesCount += delta;
        this._updateUnreadCountForAllTabs();
    }

    _updateUnreadCountForAllTabs() {
        // This updates `this.user.num_of_unread_activity_notifications` to be the sum of
        // unread instructor activities and unread student activities. It should be called
        // every time we mark a notification as read. Note that currently marking a notification
        // as unread isn't supported. `num_of_unread_activity_notifications` is passed from Django
        // via data-module-args so that we can display it without making API calls for the actual
        // notifications. Hence, it can't be an @computed property.
        if (this.user) {
            this.user.num_of_unread_activity_notifications = TabNames.map(
                (tabName) => this[tabName as ValidTabName],
            )
                .filter((tab) => !!tab)
                .reduce((acc, curr) => {
                    return acc + (curr?.unreadActivitiesCount as number);
                }, 0);
        }
    }
}
