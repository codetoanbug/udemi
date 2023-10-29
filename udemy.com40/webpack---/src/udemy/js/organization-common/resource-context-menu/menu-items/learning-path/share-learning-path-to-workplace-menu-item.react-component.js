import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';

import ShareToWorkplaceMenuItem from '../share-to-workplace-menu-item.react-component';

@observer
export default class ShareLearningPathToWorkplaceMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
    };

    render() {
        return (
            <ShareToWorkplaceMenuItem
                resource={this.props.learningPath}
                resourceType={RESOURCE_TYPES.LEARNING_PATH}
            />
        );
    }
}
ShareLearningPathToWorkplaceMenuItem.shouldRender = function (props) {
    return (
        ShareToWorkplaceMenuItem.shouldRender() &&
        props.learningPath.isPublic &&
        props.learningPath.isOrgLearningPath
    );
};
