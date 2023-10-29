import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {isCoursePublished} from 'organization-common/helpers';
import {shouldDisableMenuItem} from 'organization-common/resource-context-menu/helpers';

import ShareToSlackMenuItem from './share-to-slack-menu-item.react-component';

@observer
export default class ShareCourseToSlackMenuItem extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
    };

    render() {
        return (
            <ShareToSlackMenuItem
                resource={this.props.course}
                resourceType={RESOURCE_TYPES.COURSE}
            />
        );
    }
}

ShareCourseToSlackMenuItem.shouldRender = function (props) {
    return ShareToSlackMenuItem.shouldRender() && isCoursePublished(props.course);
};

ShareCourseToSlackMenuItem.shouldDisable = function (props) {
    return shouldDisableMenuItem(props.course);
};
