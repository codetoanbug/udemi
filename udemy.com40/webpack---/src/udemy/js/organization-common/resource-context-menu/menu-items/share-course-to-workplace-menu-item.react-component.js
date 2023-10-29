import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {isCoursePublished} from 'organization-common/helpers';
import {shouldDisableMenuItem} from 'organization-common/resource-context-menu/helpers';

import ShareToWorkplaceMenuItem from './share-to-workplace-menu-item.react-component';

@observer
export default class ShareCourseToWorkplaceMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ShareToWorkplaceMenuItem
                resource={this.props.course}
                resourceType={RESOURCE_TYPES.COURSE}
            />
        );
    }
}
ShareCourseToWorkplaceMenuItem.shouldRender = function (props) {
    return ShareToWorkplaceMenuItem.shouldRender() && isCoursePublished(props.course);
};

ShareCourseToWorkplaceMenuItem.shouldDisable = function (props) {
    return shouldDisableMenuItem(props.course);
};
