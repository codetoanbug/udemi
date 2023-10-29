import {Meter, Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import DueDate from 'browse/components/course-progress-card/due-date.react-component';
import UfbFaviconImage from 'browse/components/ufb-favicon-image/ufb-favicon-image.react-component';
import {UDEMY_PRO_LEARNING_PATH, LEARNING_PATH} from 'learning-path/constants';
import udLink from 'utils/ud-link';

import './learning-path-progress-card.less';

@inject(({resourceContextMenu} = {}) => ({resourceContextMenu}))
export default class LearningPathCard extends Component {
    static propTypes = {
        learningPath: PropTypes.object.isRequired,
        size: PropTypes.oneOf(['small', 'large']),
        className: PropTypes.string,
        wrapperClassName: PropTypes.string,
        resourceContextMenu: PropTypes.object,
    };

    static defaultProps = {
        className: undefined,
        size: 'small',
        resourceContextMenu: {},
        wrapperClassName: undefined,
    };

    getDefaultOrCompletionText(learningProgress) {
        const {learningPath} = this.props;
        const itemsText = gettext('%(totalSteps)s items');
        if (learningPath.show_only_item_count) {
            return (
                <div
                    data-purpose="item-count-only"
                    styleName="completed-steps"
                    className="ud-text-xs"
                >
                    {interpolate(
                        itemsText,
                        {
                            totalSteps: learningPath.total_steps,
                        },
                        true,
                    )}
                </div>
            );
        }

        if (!learningProgress || learningProgress === 0) {
            return (
                <div
                    data-purpose="get-started"
                    styleName="start-learning"
                    className="ud-heading-sm"
                >
                    {gettext('Get started')}
                </div>
            );
        }

        const text = gettext('%(completedSteps)s of %(totalSteps)s items complete');
        return (
            <div styleName="completed-steps" className="ud-text-xs">
                {interpolate(
                    text,
                    {
                        completedSteps: learningPath.completed_steps,
                        totalSteps: learningPath.total_steps,
                    },
                    true,
                )}
            </div>
        );
    }

    get learningPathUrl() {
        return udLink.toLearningPath(this.props.learningPath.id);
    }

    get learningPathTypeHeader() {
        const {learningPath} = this.props;
        return learningPath.is_pro_path ? UDEMY_PRO_LEARNING_PATH.TEXT : LEARNING_PATH.TEXT;
    }

    render() {
        const {className, wrapperClassName, learningPath, size, resourceContextMenu} = this.props;
        const learningProgress = parseFloat(
            ((learningPath.completed_steps / (learningPath.total_steps || 1)) * 100).toFixed(2),
        );
        const largeCard = size === 'large';
        const learningPathCardStyles = classNames('card-container', {
            'large-card': largeCard,
        });

        const contextMenu =
            resourceContextMenu && resourceContextMenu.getLearningPathCardHomeContextMenu
                ? resourceContextMenu.getLearningPathCardHomeContextMenu(learningPath)
                : null;

        const card = (
            <a
                href={this.learningPathUrl}
                styleName={learningPathCardStyles}
                data-purpose="path-card"
                className={className}
            >
                <UfbFaviconImage
                    height={32}
                    width={32}
                    isProPath={learningPath.is_pro_path}
                    styleName="ufb-favicon"
                />
                <div styleName="content">
                    {largeCard && (
                        <div styleName="path-label" className="ud-heading-xs">
                            {this.learningPathTypeHeader}
                        </div>
                    )}
                    <div
                        data-purpose="path-title"
                        styleName={classNames('path-title', {
                            'path-title-with-more-button': !!contextMenu && !largeCard,
                        })}
                        className={largeCard ? 'ud-heading-md' : 'ud-heading-sm'}
                    >
                        {learningPath.title}
                    </div>
                    {learningPath.assignment && (
                        <div styleName="assignment-info">
                            <Badge styleName="assignment-badge" data-purpose="assignment-badge">
                                {gettext('Assigned')}
                            </Badge>
                            {learningPath.assignment.due_date && (
                                <DueDate dueDate={learningPath.assignment.due_date} />
                            )}
                        </div>
                    )}
                    {largeCard && this.getDefaultOrCompletionText(learningProgress)}
                </div>
                {learningProgress ? (
                    <Meter
                        value={learningProgress}
                        min={0}
                        max={100}
                        label={gettext('%(percent)s% complete')}
                        styleName="progress"
                    />
                ) : null}
            </a>
        );

        if (contextMenu) {
            return (
                <div styleName="card-container-with-context-menu" className={wrapperClassName}>
                    {card}
                    <div styleName="more-menu-button">{contextMenu}</div>
                </div>
            );
        }

        return card;
    }
}
