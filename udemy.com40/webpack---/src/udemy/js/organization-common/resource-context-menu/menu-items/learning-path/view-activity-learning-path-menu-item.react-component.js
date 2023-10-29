import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPath from 'learning-path/learning-path.mobx-model';
import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';
import ResourceContextMenu from 'organization-common/resource-context-menu/resource-context-menu.react-component';
import * as insightLinks from 'organization-insights/links';

@inject('resourceContext')
@observer
export default class ViewActivityLearningPathMenuItem extends React.Component {
    static propTypes = {
        learningPath: PropTypes.instanceOf(LearningPath).isRequired,
        resourceContext: PropTypes.string.isRequired,
        addDivider: PropTypes.bool,
    };

    static defaultProps = {
        addDivider: false,
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, 'View activity', {
            resourceType: RESOURCE_TYPES.LEARNING_PATH,
            resourceId: this.props.learningPath.id,
        });
    }

    get viewPathActivityText() {
        return gettext('View path activity');
    }

    render() {
        const pathInsightsDetailUrl = insightLinks.absolute(
            insightLinks.toPathDetails(this.props.learningPath.id),
        );
        return (
            <>
                {this.props.addDivider && <ResourceContextMenu.Divider />}
                <ContextMenuItem
                    icon={<BarChartIcon label={false} />}
                    title={this.viewPathActivityText}
                    href={pathInsightsDetailUrl}
                    onClick={this.trackClick}
                />
            </>
        );
    }
}

ViewActivityLearningPathMenuItem.shouldRender = function (props) {
    return !props.learningPath.isStudent;
};
