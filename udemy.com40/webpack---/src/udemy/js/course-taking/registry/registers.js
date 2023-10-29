import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from 'utils/noop';

export default function registers(...storeNames) {
    /*
        The `registers` decorator must be innermost such that the store can be extracted directly
        from the component instance.
     */
    return function (Component) {
        return inject('registry')(
            class StoreRegisteringComponent extends React.Component {
                static displayName = `${
                    Component.displayName || Component.name
                }-registering-${storeNames.join('-')}`;

                static propTypes = {
                    registry: PropTypes.object.isRequired,
                    componentRef: PropTypes.func,
                };

                static defaultProps = {
                    componentRef: noop,
                };

                componentWillUnmount() {
                    this.props.registry.unregisterStores(storeNames);
                }

                @autobind
                getStoresFromComponent(ref) {
                    if (!ref) {
                        // Also gets called on unmount with no ref.
                        this.props.componentRef(ref);
                        return;
                    }
                    const stores = storeNames.reduce((acc, storeName) => {
                        acc[storeName] = ref[storeName];
                        return acc;
                    }, {});
                    this.props.registry.registerStores(stores);
                    this.props.componentRef(ref);
                }

                render() {
                    const {registry, componentRef, ...props} = this.props;
                    return <Component {...props} ref={this.getStoresFromComponent} />;
                }
            },
        );
    };
}
