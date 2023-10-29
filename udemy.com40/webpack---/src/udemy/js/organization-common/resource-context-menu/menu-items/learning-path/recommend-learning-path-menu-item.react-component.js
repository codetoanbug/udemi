import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';

import RecommendResourceMenuItem from '../recommend-resource-menu-item.react-component';

@observer
export default class RecommendLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
    };

    render() {
        return (
            <RecommendResourceMenuItem
                resource={this.props.learningPath}
                resourceType={RESOURCE_TYPES.LEARNING_PATH}
            />
        );
    }
}

RecommendLearningPathMenuItem.shouldRender = function (props) {
    return (
        RecommendResourceMenuItem.shouldRender() &&
        props.learningPath.isPublic &&
        props.learningPath.isOrgLearningPath
    );
};
