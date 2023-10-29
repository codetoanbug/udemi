import {setUniqueIdNamespace} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import serverOrClient from 'utils/server-or-client';

export function requiredPropOnClient(propType) {
    return serverOrClient.isServer ? propType : propType.isRequired;
}

export function isomorphic(Component) {
    return class IsomorphicComponent extends React.Component {
        static displayName = `Isomorphic${Component.displayName || Component.name}`;

        static propTypes = {
            ...Component.propTypes,
            serverAdditionalContext: PropTypes.object,
            serverRequestContext: PropTypes.object,
            serverUniqueId: PropTypes.string,
        };

        static defaultProps = {
            ...Component.defaultProps,
            serverAdditionalContext: null,
            serverRequestContext: null,
            serverUniqueId: null,
        };

        static isIsomorphicComponent = true;

        static wrappedComponent = Component.wrappedComponent || Component;

        constructor(props, context) {
            props.serverUniqueId && setUniqueIdNamespace(props.serverUniqueId);
            super(props, context);
        }

        componentDidMount() {
            this.setLifecycle('MOUNTED');
        }

        @observable lifecycle = null;

        @action setLifecycle(value) {
            this.lifecycle = value;
        }

        @autobind getIsMounted() {
            return this.lifecycle === 'MOUNTED';
        }

        render() {
            const {
                serverAdditionalContext,
                serverRequestContext,
                serverUniqueId,
                ...props
            } = this.props;
            return (
                <Provider
                    isIsomorphicallyRendered={true}
                    getIsRootComponentMounted={this.getIsMounted}
                    serverAdditionalContext={serverAdditionalContext}
                    serverRequestContext={serverRequestContext}
                >
                    <Component {...props} />
                </Provider>
            );
        }
    };
}

function mapIsIsomorphicallyRendered(stores) {
    let isIsomorphicallyRendered = stores.isIsomorphicallyRendered;
    let getIsRootComponentMounted = stores.getIsRootComponentMounted;
    if (isIsomorphicallyRendered === undefined) {
        isIsomorphicallyRendered = false;
        getIsRootComponentMounted = null;
    }
    return {
        isIsomorphicallyRendered,
        getIsRootComponentMounted,
    };
}

export function injectIsIsomorphicallyRendered(Component) {
    return inject(mapIsIsomorphicallyRendered)(Component);
}
