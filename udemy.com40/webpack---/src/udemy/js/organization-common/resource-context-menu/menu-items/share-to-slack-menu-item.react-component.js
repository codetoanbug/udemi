import {withI18n} from '@udemy/i18n';
import SlackIcon from '@udemy/icons/dist/slack.ud-icon';
import {withUDData} from '@udemy/ud-data';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ShareOnSlackModal from 'organization-common/ufb-social-share/share-on-slack-modal.react-component';

import ContextMenuItem from './context-menu-item.react-component';
import ShareToSlackMenuItemStore from './share-to-slack-menu-item-store.mobx-store';

@inject('resourceContext')
@observer
class InternalShareToSlackMenuItem extends React.Component {
    static propTypes = {
        resource: PropTypes.object.isRequired,
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        resourceContext: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.slackShareMenuItemStore = new ShareToSlackMenuItemStore(
            props.resource.id,
            props.resourceType,
            props.resourceContext,
            window,
        );
    }

    shouldRender = () => this.props.udData.Config.brand.is_share_on_slack_enabled;

    handleClick = () => {
        this.slackShareMenuItemStore.shareResource();
        trackClickAction(
            this.props.resourceContext,
            'Share to Slack',
            {
                resourceType: this.props.resourceType,
                resourceId: this.props.resource.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
    };

    handleModalClose = () => {
        this.slackShareMenuItemStore.hideModal();
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }

        const {gettext} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={<SlackIcon label={false} />}
                    title={gettext('Share to Slack')}
                    onClick={this.handleClick}
                />
                <ShareOnSlackModal
                    resourceId={this.props.resource.id}
                    resourceType={this.props.resourceType}
                    show={this.slackShareMenuItemStore.isModalShown}
                    onSubmit={this.handleModalClose}
                    onHide={this.handleModalClose}
                    context={this.slackShareMenuItemStore.context}
                    shareData={this.slackShareMenuItemStore.shareData}
                    teamName={this.slackShareMenuItemStore.slackTeamName}
                    checkSlackAuthentication={this.slackShareMenuItemStore.checkSlackAuthentication}
                />
            </>
        );
    }
}

const ShareToSlackMenuItem = withI18n(withUDData(InternalShareToSlackMenuItem));
/**
 * Since we're moving away from the global functions such as getConfigData, we're not able to use the ud data in the static
 * functions. So we moved shouldRender to instance method.
 *
 * For the compatability, we need to keep the static method shouldRender, but it will always return true.
 */
ShareToSlackMenuItem.shouldRender = () => true;

export default ShareToSlackMenuItem;
