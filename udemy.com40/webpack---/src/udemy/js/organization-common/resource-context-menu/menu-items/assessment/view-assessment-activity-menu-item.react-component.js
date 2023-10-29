import BarChartIcon from '@udemy/icons/dist/bar-chart.ud-icon';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import ContextMenuItem from 'organization-common/resource-context-menu/menu-items/context-menu-item.react-component';
import * as insightLinks from 'organization-insights/links';
import udMe from 'utils/ud-me';

@inject('resourceContext')
@observer
export default class ViewAssessmentActivityMenuItem extends React.Component {
    static propTypes = {
        resourceContext: PropTypes.string.isRequired,
    };

    @autobind
    trackClick() {
        trackClickAction(this.props.resourceContext, 'View assessment activity');
    }

    render() {
        return (
            <ContextMenuItem
                icon={<BarChartIcon label={false} />}
                title={gettext('View assessment activity')}
                href={insightLinks.absolute(insightLinks.toProInsights())}
                onClick={this.trackClick}
            />
        );
    }
}

ViewAssessmentActivityMenuItem.shouldRender = function () {
    return !udMe.organization.isStudent;
};
