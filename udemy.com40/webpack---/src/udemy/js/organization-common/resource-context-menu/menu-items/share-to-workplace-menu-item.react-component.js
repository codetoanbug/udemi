import {withI18n} from '@udemy/i18n';
import WorkplaceIcon from '@udemy/icons/dist/facebook-workplace.ud-icon';
import {withUDData} from '@udemy/ud-data';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import {FB_WORKPLACE} from 'organization-common/ufb-social-share/constants';
import SocialShareStore from 'share/social-share.mobx-store';

import ContextMenuItem from './context-menu-item.react-component';

@inject('resourceContext')
@observer
class InternalShareToWorkplaceMenuItem extends React.Component {
    static propTypes = {
        resource: PropTypes.object.isRequired,
        resourceType: PropTypes.oneOf(Object.values(RESOURCE_TYPES)).isRequired,
        resourceContext: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.socialShareStore = new SocialShareStore(
            {
                url: props.resource.url,
                title: props.resource.title,
                id: props.resource.id,
            },
            props.resource.url,
            props.resourceContext,
            '',
            null,
            {
                gettext: this.props.gettext,
                interpolate: this.props.interpolate,
            },
        );
    }

    shouldRender = () => this.props.udData.Config.brand.is_share_to_workplace_enabled;

    handleClick = () => {
        trackClickAction(
            this.props.resourceContext,
            'Share to Workplace',
            {
                resourceType: this.props.resourceType,
                resourceId: this.props.resource.id,
            },
            {
                Config: this.props.udData.Config,
            },
        );
        this.socialShareStore.share(FB_WORKPLACE);
    };

    render() {
        if (!this.shouldRender()) {
            return null;
        }
        const {gettext} = this.props;
        return (
            <ContextMenuItem
                icon={<WorkplaceIcon label={false} />}
                title={gettext('Share to Workplace')}
                onClick={this.handleClick}
            />
        );
    }
}

const ShareToWorkplaceMenuItem = withI18n(withUDData(InternalShareToWorkplaceMenuItem));
/**
 * Since we're moving away from the global functions such as getConfigData, we're not able to use the ud data in the static
 * functions. So we moved shouldRender to instance method.
 *
 * For the compatability, we need to keep the static method shouldRender, but it will always return true.
 */
ShareToWorkplaceMenuItem.shouldRender = () => true;
export default ShareToWorkplaceMenuItem;
