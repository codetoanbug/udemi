import {action, computed, observe, observable, ObservableMap, runInAction} from 'mobx';

const unseenMessages = new ObservableMap();

function messagingStore(type) {
    if (!type) {
        throw new Error('Please specify a type for the messaging store.');
    }

    let pop = false;
    const lastMessage = observable.box(null);

    function popLastMessage() {
        runInAction(() => {
            let keyMessages = [];

            if (unseenMessages.has(type)) {
                keyMessages = unseenMessages.get(type);
            }
            keyMessages.pop();
            unseenMessages.set(type, keyMessages);
            pop = false;
        });
    }

    class Api {
        @computed
        get messages() {
            if (!unseenMessages.get(type)) {
                return [];
            }
            return unseenMessages.get(type);
        }

        @computed
        get onMessageInternal() {
            const messages = unseenMessages.get(type);
            if (!messages) {
                return null;
            }
            pop = true;
            return messages[messages.length - 1];
        }

        @computed
        get onMessage() {
            return lastMessage.get();
        }

        @action
        sendMessage(body) {
            let keyMessages = [];

            if (unseenMessages.has(type)) {
                keyMessages = unseenMessages.get(type);
            }

            keyMessages.push(body);
            unseenMessages.set(type, keyMessages);
        }

        @action
        clear() {
            lastMessage.set(null);
            unseenMessages.delete(type);
        }
    }

    const api = new Api();

    observe(api, 'onMessageInternal', (change) => {
        if (pop && change.newValue) {
            runInAction(() => {
                lastMessage.set(change.newValue);
            });
            return;
        }
        popLastMessage();
    });

    return api;
}

export default messagingStore;
