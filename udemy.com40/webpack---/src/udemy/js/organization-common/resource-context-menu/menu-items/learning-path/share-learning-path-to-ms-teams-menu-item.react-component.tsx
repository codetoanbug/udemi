import {observer} from 'mobx-react';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';

import {
    InternalShareToMSTeamsMenuItem,
    ShareToMSTeamsMenuItem,
} from '../share-to-ms-teams-menu-item.react-component';

interface ShareLearningPathToMSTeamsMenuItemProps {
    learningPath: {
        id: number;
        url: string;
        title: string;
        isPublic: boolean;
        isOrgLearningPath: boolean;
    };
}

@observer
export class ShareLearningPathToMSTeamsMenuItem extends React.Component<ShareLearningPathToMSTeamsMenuItemProps> {
    static shouldRender: (props: ShareLearningPathToMSTeamsMenuItemProps) => boolean;

    render() {
        return (
            <ShareToMSTeamsMenuItem
                resource={this.props.learningPath}
                resourceType={RESOURCE_TYPES.LEARNING_PATH}
            />
        );
    }
}
ShareLearningPathToMSTeamsMenuItem.shouldRender = function (
    props: ShareLearningPathToMSTeamsMenuItemProps,
) {
    return (
        InternalShareToMSTeamsMenuItem.shouldRender() &&
        props.learningPath.isPublic &&
        props.learningPath.isOrgLearningPath
    );
};
