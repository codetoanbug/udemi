import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import getConfigData from 'utils/get-config-data';

import requires from '../../registry/requires';

const udConfig = getConfigData();

@requires('courseTakingStore', 'unenrollStore')
@inject('enableUBListExperiment')
@observer
export default class OptionsMenu extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            course: PropTypes.shape({
                id: PropTypes.number,
                giftUrl: PropTypes.string,
            }),
            enrollment: PropTypes.shape({
                notificationSettings: PropTypes.object.isRequired,
            }),
            track: PropTypes.func,
            isEnrolledStudent: PropTypes.bool,
            isReviewInitialized: PropTypes.bool,
            courseReview: PropTypes.object,
            isSmallScreenViewportSize: PropTypes.bool,
            isUserInstructor: PropTypes.bool,
            isCourseInConsumerSubs: PropTypes.bool,
        }).isRequired,
        enableUBListExperiment: PropTypes.bool,
        unenrollStore: PropTypes.object.isRequired,
    };

    static defaultProps = {
        enableUBListExperiment: false,
    };

    render() {
        const context = udConfig.brand.has_organization
            ? CONTEXT_TYPES.UFB_COURSE_TAKING
            : CONTEXT_TYPES.COURSE_TAKING;

        return createUFBContextMenu().getCourseTakingHeaderContextMenu(
            context,
            this.props.courseTakingStore,
            this.props.unenrollStore,
            this.props.enableUBListExperiment,
        );
    }
}
