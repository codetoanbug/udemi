import {Tracker} from '@udemy/event-tracking';
import DataInsightIcon from '@udemy/icons/dist/data-insight.ud-icon';
import HelpSupportIcon from '@udemy/icons/dist/help-support.ud-icon';
import QuestionAnswerIcon from '@udemy/icons/dist/question-answer.ud-icon';
import TeachIcon from '@udemy/icons/dist/teach.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {InstructorCourseListActionEvent} from 'course-manage-v2/events';
import udLink from 'utils/ud-link';

import './instructor-dashboard.less';

const trackClick = (resource) => {
    return () => {
        Tracker.publishEvent(
            new InstructorCourseListActionEvent({
                category: 'dashboard_resource_list',
                input: resource.key,
                action: 'click',
            }),
        );
    };
};

// eslint-disable-next-line react/prop-types
export const ResourceUnit = ({resource}) => {
    const Icon = resource.icon;
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick(resource)}
            styleName="resource-unit"
        >
            <Icon label={false} size="xlarge" />
            <div className="ud-text-bold ud-link-underline" styleName="resource-unit-title">
                {resource.title}
            </div>
            <div className="ud-text-sm">{resource.description}</div>
        </a>
    );
};

export default class ResourceList extends Component {
    static propTypes = {
        isPublishedInstructor: PropTypes.bool.isRequired,
    };

    resources = [
        {
            key: 'test-video',
            icon: VideoIcon,
            title: gettext('Test Video'),
            description: gettext('Send us a sample video and get expert feedback.'),
            url: 'test-video/',
        },
        {
            key: 'studio',
            icon: QuestionAnswerIcon,
            title: gettext('Instructor Community'),
            description: gettext(
                'Connect with experienced instructors. Ask questions, browse discussions, and more.',
            ),
            url: udLink.toInstructorCommunity(),
        },
        {
            key: 'teach-hub',
            icon: TeachIcon,
            title: gettext('Teaching Center'),
            description: gettext('Learn about best practices for teaching on Udemy.'),
            url: '/udemy-teach-hub/',
        },
        {
            key: 'teacher-training',
            icon: DataInsightIcon,
            title: gettext('Marketplace Insights'),
            description: gettext(
                'Validate your course topic by exploring our marketplace supply and demand.',
            ),
            url: udLink.to('/instructor/marketplace-insights/'),
        },
        {
            key: 'support',
            icon: HelpSupportIcon,
            title: gettext('Help and Support'),
            description: gettext('Browse our Help Center or contact our support team.'),
            url: '/support?type=instructor',
        },
    ];

    render() {
        return (
            <div>
                <h2 styleName="resources-title">
                    {gettext('Have questions? Here are our most popular instructor resources.')}
                </h2>
                <div styleName="resource-units">
                    {this.resources.map((resource) => (
                        <ResourceUnit key={resource.key} resource={resource} />
                    ))}
                </div>
            </div>
        );
    }
}
