import RatingStarIcon from '@udemy/icons/dist/rating-star.ud-icon';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import Enrollment from 'course-taking/enrollment.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';

import ContextMenuItem from '../context-menu-item.react-component';

@inject('resourceContext')
@observer
export default class FavoriteCourseMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
        enrollment: PropTypes.instanceOf(Enrollment).isRequired,
        courseTakingStore: PropTypes.object,
        enableUBListExperiment: PropTypes.bool,
    };

    static defaultProps = {
        courseTakingStore: undefined,
        enableUBListExperiment: false,
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, this.title, {
            resourceType: RESOURCE_TYPES.COURSE,
            resourceId: this.props.courseTakingStore.course.id,
        });
    }

    @autobind
    onClick() {
        const {enrollment} = this.props;
        enrollment.toggleFavorited();
        this.trackClick();
    }

    @computed
    get title() {
        const {enrollment} = this.props;
        return enrollment.favoritedTime
            ? gettext('Unfavorite this course')
            : gettext('Favorite this course');
    }

    render() {
        return (
            <ContextMenuItem
                icon={<RatingStarIcon label={false} />}
                title={this.title}
                onClick={this.onClick}
            />
        );
    }
}

FavoriteCourseMenuItem.shouldRender = ({enrollment, enableUBListExperiment}) => {
    return !!enrollment && !enableUBListExperiment;
};
