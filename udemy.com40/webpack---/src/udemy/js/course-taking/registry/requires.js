import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

export default function requires(...args) {
    // Normalize string and object arguments.
    const stores = args.map((arg) =>
        typeof arg === 'string' ? {name: arg, optional: false} : arg,
    );
    const storeNames = stores.map(({name}) => name);

    return function (Component) {
        return inject('registry')(
            observer(
                class StoreRequiringComponent extends React.Component {
                    static displayName = `${
                        Component.displayName || Component.name
                    }-requiring-${storeNames.join('-')}`;

                    static propTypes = {
                        registry: PropTypes.object.isRequired,
                    };

                    constructor(props) {
                        super(props);
                        props.registry.addStorePlaceholders(storeNames);
                    }

                    render() {
                        const {registry, ...props} = this.props;
                        const injectedStores = {};
                        for (const {name, optional} of stores) {
                            if (!optional && !registry[name]) {
                                return null;
                            }
                            injectedStores[name] = registry[name];
                        }

                        return <Component {...injectedStores} {...props} />;
                    }
                },
            ),
        );
    };
}
