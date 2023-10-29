import {Button} from '@udemy/react-core-components';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';

import ResourceList from './resource-list.react-component';
import ResourceRecommendations from './resource-recommendations.react-component';

import './instructor-dashboard.less';

const udConfig = getConfigData();

interface InstructorDashboardProps {
    hasCourse: boolean;
    isPublishedInstructor: boolean;
    primaryResource?: string;
    isNewcomerChallengeEnabled?: boolean;
    isNewlyNewcomerChallengePageEnabled?: boolean;
}

export class InstructorDashboard extends Component<InstructorDashboardProps> {
    render() {
        if (udConfig.brand.has_organization) {
            return null;
        }
        return (
            <div>
                {!this.props.isPublishedInstructor && (
                    <ResourceRecommendations
                        primaryResource={this.props.primaryResource}
                        isNewcomerChallengeEnabled={this.props.isNewcomerChallengeEnabled ?? false}
                        isNewlyNewcomerChallengePageEnabled={
                            this.props.isNewlyNewcomerChallengePageEnabled ?? false
                        }
                    />
                )}
                <ResourceList isPublishedInstructor={this.props.isPublishedInstructor} />
                {!this.props.hasCourse && (
                    <div styleName="cta-footer">
                        <h2 styleName="cta-footer-title">{gettext('Are You Ready to Begin?')}</h2>
                        <Button
                            componentClass="a"
                            href={udLink.to('course', 'create')}
                            styleName="create-cta-button"
                            udStyle="brand"
                        >
                            {gettext('Create Your Course')}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}
