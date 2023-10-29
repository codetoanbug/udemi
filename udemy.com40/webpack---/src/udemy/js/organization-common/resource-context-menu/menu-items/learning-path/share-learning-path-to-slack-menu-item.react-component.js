import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';

import ShareToSlackMenuItem from '../share-to-slack-menu-item.react-component';

@observer
export default class ShareLearningPathToSlackMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
    };

    render() {
        return (
            <ShareToSlackMenuItem
                resource={this.props.learningPath}
                resourceType={RESOURCE_TYPES.LEARNING_PATH}
            />
        );
    }
}

ShareLearningPathToSlackMenuItem.shouldRender = function (props) {
    return (
        ShareToSlackMenuItem.shouldRender() &&
        props.learningPath.isPublic &&
        props.learningPath.isOrgLearningPath
    );
};
