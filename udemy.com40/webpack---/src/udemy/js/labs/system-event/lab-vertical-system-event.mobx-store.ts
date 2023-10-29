import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';

import udApi from 'utils/ud-api';

import {labSeenEventsApiUrl, SYSTEM_EVENTS_API_URL} from './constants';
import {LabVerticalSystemEventApiData, SeenMessagesApiData} from './types';

export class LabVerticalSystemEventStore {
    labId = 0;
    @observable messages: LabVerticalSystemEventApiData[] = [];
    @observable seenMessages = observable.map<string, boolean>({});
    @observable isLoading = true;

    @computed
    get activeMessage() {
        for (const message of this.messages) {
            if (!this.seenMessages.get(message.uuid)) {
                // first unseen message
                return message;
            }
        }
        return null;
    }

    async loadMessages(vertical: string, labId: number) {
        if (labId) {
            this.labId = labId;
            this.setLoading(true);
            const [messages, seenMessages] = await Promise.all([
                this.fetchMessages(vertical),
                this.fetchSeenMessages(),
            ]);
            this.setMessages(messages);
            for (const seenMessage of seenMessages) {
                this.setSeenMessage(seenMessage.system_message);
            }
            this.setLoading(false);
        }
    }

    @action
    setLoading(value: boolean) {
        this.isLoading = value;
    }

    async fetchMessages(vertical: string) {
        const response = await udApi.get(SYSTEM_EVENTS_API_URL, {
            params: {vertical},
        });
        return response.data.results;
    }

    async fetchSeenMessages() {
        const response = await udApi.get(labSeenEventsApiUrl(this.labId));
        return response.data.results as SeenMessagesApiData[];
    }

    @autobind
    async markMessageAsSeen(messageUuid: string) {
        await udApi.post(labSeenEventsApiUrl(this.labId), {message: messageUuid});
        this.setSeenMessage(messageUuid);
    }

    @action
    setMessages(messages: LabVerticalSystemEventApiData[]) {
        this.messages = messages;
    }

    @action
    setSeenMessage(messageUuid: string) {
        this.seenMessages.set(messageUuid, true);
    }
}
