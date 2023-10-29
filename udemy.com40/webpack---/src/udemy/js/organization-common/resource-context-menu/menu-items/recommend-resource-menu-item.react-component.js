import {withI18n} from '@udemy/i18n';
import ShareIcon from '@udemy/icons/dist/share.ud-icon';
import {withUDData} from '@udemy/ud-data';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import RecommendResourceModal from 'organization-common/recommend-resource/recommend-resource-modal.react-component';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';

import ShareMenuItemStore from './share-menu-item.mobx-store';

@inject('resourceContext')
@observer
class InternalRecommendResourceMenuItem extends React.Component {
    static propTypes = {
        resource: PropTypes.object.isRequired,
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        resourceContext: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.shareMenuItemStore = new ShareMenuItemStore(
            props.resource.id,
            props.resourceType,
            props.resourceContext,
        );
    }

    shouldRender = () => {
        return this.props.udData.Config.brand.organization?.is_recommend_enabled;
    };

    @action
    handleClick = async () => {
        trackClickAction(
            this.props.resourceContext,
            'Recommend',
            {
                resourceType: this.props.resourceType,
                resourceId: this.props.resource.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
        await this.shareMenuItemStore.resourcePreview();
    };

    @action
    handleOnClose = () => {
        this.shareMenuItemStore.hideModal();
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }
        const {gettext} = this.props;
        return (
            <>
                <ContextMenuItem
                    icon={<ShareIcon label={false} />}
                    title={gettext('Recommend')}
                    onClick={this.handleClick}
                />
                <RecommendResourceModal
                    resourceId={this.props.resource.id}
                    resourceType={this.props.resourceType}
                    shareData={this.shareMenuItemStore.shareData}
                    isOpen={this.shareMenuItemStore.isModalShown}
                    onClose={this.handleOnClose}
                    context={this.props.resourceContext}
                />
            </>
        );
    }
}

const RecommendResourceMenuItem = withI18n(withUDData(InternalRecommendResourceMenuItem));

/**
 * Since we're moving away from the global functions such as getConfigData, we're not able to use the ud data in the static
 * functions. So we moved shouldRender to instance method.
 *
 * For the compatability, we need to keep the static method shouldRender, but it will always return true.
 */
RecommendResourceMenuItem.shouldRender = () => true;
export default RecommendResourceMenuItem;
