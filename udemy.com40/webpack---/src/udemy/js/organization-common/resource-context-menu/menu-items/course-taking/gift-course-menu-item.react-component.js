import GiftIcon from '@udemy/icons/dist/gift.ud-icon';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import requires from 'course-taking/registry/requires';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import getConfigData from 'utils/get-config-data';

import ContextMenuItem from '../context-menu-item.react-component';

const udConfig = getConfigData();

@inject('resourceContext')
@requires('courseTakingStore')
export default class GiftCourseMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
    };

    get title() {
        return gettext('Gift this course');
    }

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.courseTakingStore.course.id,
        });
    }

    render() {
        return (
            <ContextMenuItem
                icon={<GiftIcon label={false} />}
                title={this.title}
                onClick={this.trackClick}
                href={this.props.courseTakingStore.course.giftUrl}
            />
        );
    }
}

GiftCourseMenuItem.shouldRender = ({course, enrollment}) =>
    !udConfig.brand.has_organization && course.isGiftable && Boolean(enrollment);
