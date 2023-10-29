import {action, observable} from 'mobx';

import {UserLearningCalendarReminderType} from 'learning-calendar-reminders/types';
import udApi from 'utils/ud-api';

export class LearningToolsStore {
    @observable scheduledReminders: UserLearningCalendarReminderType[] = [];
    @observable deletedReminders: UserLearningCalendarReminderType[] = [];

    async loadLearningCalendarReminders() {
        const response = await udApi.get('/users/me/learning-calendar-reminders/', {
            params: {
                page: 1,
                page_size: 1000,
                ordering: '-last_accessed',
            },
        });
        this._setReminders(response.data?.results);
    }

    @action
    _setReminders(results: UserLearningCalendarReminderType[]) {
        this.scheduledReminders = results.filter((reminder) => !reminder.is_deleted);
        this.deletedReminders = results.filter((reminder) => reminder.is_deleted);
    }
}
