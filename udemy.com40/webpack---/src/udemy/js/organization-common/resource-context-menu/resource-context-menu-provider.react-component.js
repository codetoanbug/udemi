import {observable, runInAction} from 'mobx';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import getConfigData from 'utils/get-config-data';

const createUFBContextMenu = () =>
    import(
        /* webpackChunkName: "create-ufb-context-menu" */ 'organization-common/resource-context-menu/create-ufb-context-menu'
    );
@observer
export default class ResourceContextMenuProvider extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        resourceContextMenuProps: PropTypes.object,
    };

    static defaultProps = {
        resourceContextMenuProps: {},
    };

    async componentDidMount() {
        if (getConfigData().brand.has_organization) {
            const createUFBContextMenuModule = await createUFBContextMenu();
            runInAction(() => {
                this.resourceContextMenu = createUFBContextMenuModule.default();
            });
        }
        runInAction(() => {
            this.isLoading = false;
        });
    }

    @observable.ref resourceContextMenu = null;
    @observable.ref isLoading = true;

    render() {
        if (getConfigData().brand.has_organization && this.isLoading) {
            return null;
        }
        const {children, resourceContextMenuProps} = this.props;
        if (this.resourceContextMenu) {
            return (
                <Provider
                    resourceContextMenu={this.resourceContextMenu}
                    resourceContextMenuProps={resourceContextMenuProps}
                >
                    {children}
                </Provider>
            );
        }

        return children;
    }
}
