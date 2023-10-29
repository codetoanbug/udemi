import {action, computed, observe, observable, ObservableMap, runInAction} from 'mobx';

export interface MessageData {
    message: string;
    options?: unknown;
}

export type Message = string | MessageData;

const unseenMessages = new ObservableMap<string, Message[]>();

export class MessagingStore {
    private pop = false;
    private lastMessage = observable.box<Message | null>(null);

    constructor(private readonly type: string) {
        observe(this, 'onMessageInternal', (change) => {
            if (this.pop && change.newValue) {
                runInAction(() => {
                    this.lastMessage.set(change.newValue);
                });
                return;
            }

            this.popLastMessage();
        });
    }

    @computed
    get messages() {
        if (!unseenMessages.get(this.type)) {
            return [];
        }

        return unseenMessages.get(this.type) ?? [];
    }

    @computed
    get onMessageInternal() {
        const messages = unseenMessages.get(this.type);
        if (!messages) {
            return null;
        }

        this.pop = true;
        return messages[messages.length - 1];
    }

    @computed
    get onMessage() {
        return this.lastMessage.get();
    }

    @action
    sendMessage(body: Message) {
        let keyMessages: Message[] = [];
        if (unseenMessages.has(this.type)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            keyMessages = unseenMessages.get(this.type)!;
        }

        keyMessages.push(body);
        unseenMessages.set(this.type, keyMessages);
    }

    @action
    clear() {
        this.lastMessage.set(null);
        unseenMessages.delete(this.type);
    }

    @action
    popLastMessage() {
        let keyMessages: Message[] = [];
        if (unseenMessages.has(this.type)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            keyMessages = unseenMessages.get(this.type)!;
        }

        keyMessages.pop();
        unseenMessages.set(this.type, keyMessages);
        this.pop = false;
    }
}

export function getMessagingStore(type: string) {
    return new MessagingStore(type);
}
