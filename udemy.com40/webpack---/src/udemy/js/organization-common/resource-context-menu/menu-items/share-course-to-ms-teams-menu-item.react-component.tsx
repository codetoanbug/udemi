import {observer} from 'mobx-react';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {isCoursePublished} from 'organization-common/helpers';
import {shouldDisableMenuItem} from 'organization-common/resource-context-menu/helpers';

import {
    InternalShareToMSTeamsMenuItem,
    ShareToMSTeamsMenuItem,
} from './share-to-ms-teams-menu-item.react-component';

interface ShareCourseToMSTeamsMenuItemProps {
    course: {
        id: number;
        url: string;
        title: string;
    };
}

@observer
export class ShareCourseToMSTeamsMenuItem extends React.Component<ShareCourseToMSTeamsMenuItemProps> {
    static shouldRender: (props: ShareCourseToMSTeamsMenuItemProps) => boolean;
    static shouldDisable: (props: ShareCourseToMSTeamsMenuItemProps) => boolean;

    render() {
        return (
            <ShareToMSTeamsMenuItem
                resource={this.props.course}
                resourceType={RESOURCE_TYPES.COURSE}
            />
        );
    }
}
ShareCourseToMSTeamsMenuItem.shouldRender = function (props: ShareCourseToMSTeamsMenuItemProps) {
    return InternalShareToMSTeamsMenuItem.shouldRender() && isCoursePublished(props.course);
};

ShareCourseToMSTeamsMenuItem.shouldDisable = function (props: ShareCourseToMSTeamsMenuItemProps) {
    return shouldDisableMenuItem(props.course);
};
