import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {isCoursePublished} from 'organization-common/helpers';
import {shouldDisableMenuItem} from 'organization-common/resource-context-menu/helpers';

import RecommendResourceMenuItem from './recommend-resource-menu-item.react-component';

@observer
export default class RecommendCourseMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
    };

    render() {
        return (
            <RecommendResourceMenuItem
                resource={this.props.course}
                resourceType={RESOURCE_TYPES.COURSE}
            />
        );
    }
}

RecommendCourseMenuItem.shouldRender = function (props) {
    return RecommendResourceMenuItem.shouldRender() && isCoursePublished(props.course);
};

RecommendCourseMenuItem.shouldDisable = function (props) {
    return shouldDisableMenuItem(props.course);
};
