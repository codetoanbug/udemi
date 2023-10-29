import InfoOutline from '@udemy/icons/dist/info-outline.ud-icon';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';
import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import ContextMenuItem from '../context-menu-item.react-component';

import './refund-menu-item.less';

const udConfig = getConfigData();

@inject('resourceContext', 'resourceContextMenuItemProps')
@requires('courseTakingStore')
@observer
export default class RefundMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        addDivider: PropTypes.bool,
        resourceContextMenuItemProps: PropTypes.object,
    };

    static defaultProps = {
        addDivider: true,
        resourceContextMenuItemProps: {},
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.courseTakingStore.course.id,
        });
    }

    @computed
    get title() {
        const {enrollment} = this.props.courseTakingStore;
        return enrollment.isInRefundPeriod
            ? gettext('Request a refund')
            : gettext(
                  'This course was purchased outside the 30-day refund policy and cannot be refunded.',
              );
    }

    render() {
        const {enrollment} = this.props.courseTakingStore;
        const isEnabled = enrollment.isInRefundPeriod;
        const courseId = this.props.courseTakingStore.course.id;
        const refundUrl = udLink.toRefundRequestForm(courseId);

        const menuProps = {
            icon: <InfoOutline label={false} />,
            title: this.title,
        };

        if (isEnabled) {
            menuProps.onClick = this.trackClick;
            menuProps.href = refundUrl;
        } else {
            menuProps.resourceContextMenuProps = {
                ...ResourceContextMenu.defaultProps,
            };
            menuProps.resourceContextMenuItemProps = {
                ...this.props.resourceContextMenuItemProps,
                disabled: true,
            };
        }

        return (
            <div styleName="refund-menu-item">
                {this.props.addDivider && <ResourceContextMenu.Divider />}
                <ContextMenuItem {...menuProps} />
            </div>
        );
    }
}

RefundMenuItem.shouldRender = ({enrollment}) =>
    enrollment &&
    enrollment.wasPurchased &&
    enrollment.wasPaid &&
    udConfig.features.course.refundable;
