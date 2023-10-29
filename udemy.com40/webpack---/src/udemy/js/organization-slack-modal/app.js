import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, {Component} from 'react';

import ShareToSlackMenuItemStore from 'organization-common/resource-context-menu/menu-items/share-to-slack-menu-item-store.mobx-store';
import ShareOnSlackModal from 'organization-common/ufb-social-share/share-on-slack-modal.react-component';
import udRenderReactComponents from 'utils/ud-render-react-components';

import QUERY_PARAMS from './constants';

@observer
export class App extends Component {
    static propTypes = {
        window: PropTypes.object,
    };

    static defaultProps = {
        window,
    };

    constructor(props) {
        super(props);

        this.initStoreFromQueryParams();
    }

    componentDidMount() {
        if (this.store) {
            this.store.shareResource();
        }
    }

    initStoreFromQueryParams() {
        const queryParams = qs.parse(this.props.window.location.search, {ignoreQueryPrefix: true});
        const isSlackShare = queryParams[QUERY_PARAMS.SLACK_SHARE];
        let resourceId = queryParams[QUERY_PARAMS.RESOURCE_ID];
        const resourceType = queryParams[QUERY_PARAMS.RESOURCE_TYPE];
        const context = queryParams[QUERY_PARAMS.CONTEXT];

        if ([isSlackShare, resourceId, resourceType, context].every(Boolean)) {
            resourceId = parseInt(resourceId, 10);
            this.store = new ShareToSlackMenuItemStore(
                resourceId,
                resourceType,
                context,
                this.props.window,
            );

            this.cleanQueryParams(queryParams);
        }
    }

    cleanQueryParams(queryParams) {
        delete queryParams[QUERY_PARAMS.CONTEXT];
        delete queryParams[QUERY_PARAMS.RESOURCE_ID];
        delete queryParams[QUERY_PARAMS.RESOURCE_TYPE];
        delete queryParams[QUERY_PARAMS.SLACK_SHARE];

        if (!Object.entries(queryParams).length) {
            window.history.replaceState({}, null, this.props.window.location.pathname);
        } else {
            window.history.replaceState(
                {},
                null,
                `${this.props.window.location.pathname}?${qs.stringify(queryParams)}`,
            );
        }
    }

    render() {
        if (this.store) {
            return (
                <ShareOnSlackModal
                    show={this.store.isModalShown}
                    onHide={this.store.hideModal}
                    onSubmit={this.store.hideModal}
                    resourceId={this.store.resourceId}
                    resourceType={this.store.resourceType}
                    context={this.store.context}
                    shareData={this.store.shareData}
                    teamName={this.store.slackTeamName}
                    checkSlackAuthentication={this.store.checkSlackAuthentication}
                />
            );
        }
        return null;
    }
}

export default function bootstrap(container, moduleArgs) {
    udRenderReactComponents(
        container,
        '.ud-component--organization-slack-modal--app',
        App,
        moduleArgs,
    );
}
