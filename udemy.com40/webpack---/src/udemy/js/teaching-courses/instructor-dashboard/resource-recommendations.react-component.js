import {Tracker} from '@udemy/event-tracking';
import {Image} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {InstructorCourseListActionEvent} from 'course-manage-v2/events';

import {API_STATE} from '../../instructor/constants';
import {NewcomerChallenge} from './newcomer-challenge.react-component';
import ResourceRecommendationsStore from './resource-recommendations.mobx-store';

import './instructor-dashboard.less';

const trackClick = (resource) => {
    return () => {
        Tracker.publishEvent(
            new InstructorCourseListActionEvent({
                category: 'dashboard_resources',
                input: resource.name,
                action: 'click',
            }),
        );
    };
};
export const RecommendationPanel = ({resource, isPrimary}) => (
    <div styleName={isPrimary ? 'panel resource-panel-primary' : 'panel resource-panel'}>
        <div styleName="resource-image-col">
            <Image
                src={resource.image}
                srcSet={resource.image2x && `${resource.image} 1x, ${resource.image2x} 2x`}
                alt=""
                width={resource.imgSize.width}
                height={resource.imgSize.height}
                styleName="resource-image"
            />
        </div>
        <div styleName="resource-description-col">
            <h3 className={isPrimary ? 'ud-text-xl' : 'ud-text-lg'} styleName="resource-title">
                {resource.title}
            </h3>
            <p styleName="resource-text">
                {isPrimary ? resource.primaryText : resource.secondaryText}
            </p>
            <a
                className="ud-link-underline"
                onClick={trackClick(resource)}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {resource.urlText}
                <span className="ud-sr-only"> {resource.title}</span>
            </a>
        </div>
    </div>
);

RecommendationPanel.propTypes = {
    resource: PropTypes.object,
    isPrimary: PropTypes.bool,
};

RecommendationPanel.defaultProps = {
    resource: undefined,
    isPrimary: undefined,
};

@observer
export default class ResourceRecommendations extends Component {
    static propTypes = {
        primaryResource: PropTypes.string,
        isNewcomerChallengeEnabled: PropTypes.bool,
        isNewlyNewcomerChallengePageEnabled: PropTypes.bool,
    };

    static defaultProps = {
        primaryResource: undefined,
        isNewcomerChallengeEnabled: false,
        isNewlyNewcomerChallengePageEnabled: false,
    };

    constructor(props) {
        super(props);
        this.store = new ResourceRecommendationsStore();
        this.store.setResourceOrder(this.props.primaryResource);
    }

    renderResourceComponents(primary, secondary, tertiary) {
        return (
            <div styleName="new-instructor-resources" data-purpose="new-instructor-resources">
                <RecommendationPanel resource={primary} isPrimary={true} />
                <RecommendationPanel resource={secondary} />
                <RecommendationPanel resource={tertiary} />
                {this.store.isEligibleToViewNewcomerChallengeComponent &&
                    this.store.newcomerChallengeJoinStatusApiState === API_STATE.DONE &&
                    this.props.isNewcomerChallengeEnabled && (
                        <NewcomerChallenge
                            isNewlyNewcomerChallengePageEnabled={
                                this.props.isNewlyNewcomerChallengePageEnabled
                            }
                        />
                    )}
            </div>
        );
    }

    render() {
        const primary = this.store.primaryResource;
        const secondary = this.store.secondaryResource;
        const tertiary = this.store.tertiaryResource;
        const resources = this.renderResourceComponents(primary, secondary, tertiary);

        return (
            <div>
                <h2 styleName="resources-title">
                    {gettext('Based on your experience, we think these resources will be helpful.')}
                </h2>
                {resources}
            </div>
        );
    }
}
