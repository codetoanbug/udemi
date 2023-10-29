import {action, extendObservable} from 'mobx';
import {Provider} from 'mobx-react';
import React from 'react';

export class Registry {
    @action
    addStorePlaceholders(storeNames) {
        /*
            If a required store is not already a property on the registry, the component requiring
            the store will not respond to the store being added. Therefore, we add the store name
            as an observable property so subsequent changes will be reacted to. The property is
            undefined so that default props will be applied.
         */
        storeNames.forEach((storeName) => {
            if (this[storeName] === undefined) {
                this._registerStore(storeName, undefined);
            }
        });
    }

    @action
    registerStores(stores) {
        Object.entries(stores).forEach(([storeName, store]) => {
            this._registerStore(storeName, store);
        });
    }

    _registerStore(storeName, store) {
        if (!(storeName in this)) {
            extendObservable(this, {[storeName]: store}, {}, {deep: false});
        } else {
            this[storeName] = store;
        }
    }

    @action
    unregisterStores(storeNames) {
        storeNames.forEach((storeName) => {
            this[storeName] = undefined;
        });
    }
}

export default function root(Component) {
    return class RootComponent extends React.Component {
        constructor(props) {
            super(props);
            this.registry = new Registry();
        }

        render() {
            return (
                <Provider registry={this.registry}>
                    <Component {...this.props} />
                </Provider>
            );
        }
    };
}
