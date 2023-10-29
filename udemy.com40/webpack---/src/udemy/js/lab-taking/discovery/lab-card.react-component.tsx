import {withMatchMedia} from '@udemy/hooks';
import {Badge} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';

import DueDate from 'browse/components/course-progress-card/due-date.react-component';
import {LabCardTrackingProps} from 'browse/components/lab-card/types';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {sendLabDiscoveryCardClickEvent} from 'browse/components/my-learning-unit/utils';
import {LabCTAPractice} from 'labs/lab-card-components/lab-cta-practice.react-component';
import {LabIcon} from 'labs/lab-card-components/lab-icon.react-component';
import {LabDuration} from 'labs/lab-duration-timer/lab-duration.react-component';
import Lab from 'labs/lab.mobx-model';
import {checkLabPauseResumeExperimentEnabled, sendLabSelectedEvent} from 'labs/utils';
import {isContextMenuAvailable} from 'organization-common/resource-context-menu/helpers';

import {getLabCompletionDate} from './helpers';

import './lab-card.less';

interface ResourceContextMenu {
    getHomePageLabCardContextMenu(lab: Lab): boolean;
    getListPageLabCardContextMenu(lab: Lab): boolean;
}

interface LabCardProps {
    lab: Lab;
    size?: 'small' | 'large';
    className?: string;
    enableLabsInPersonalPlan?: boolean;
    userHasConsumerSubs?: boolean;
    resourceContextMenu?: ResourceContextMenu;
    openLabInNewTab?: boolean;
    isMobileMax?: boolean;
    shouldShowAssignment?: boolean;
    shouldShowInstructors?: boolean;
}

@inject('userHasConsumerSubs', 'enableLabsInPersonalPlan', 'resourceContextMenu')
@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
export class LabCard extends Component<LabCardProps & LabCardTrackingProps> {
    static defaultProps = {
        size: 'large',
        isMobileMax: null,
        className: undefined,
        shouldShowAssignment: true,
        shouldShowInstructors: false,
        enableLabsInPersonalPlan: false,
        userHasConsumerSubs: false,
        uiRegion: LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_TAB,
    };

    get isContextMenuShown() {
        const {resourceContextMenu} = this.props;

        if (
            !resourceContextMenu ||
            this.props.userHasConsumerSubs ||
            this.props.enableLabsInPersonalPlan
        ) {
            return false;
        }

        return isContextMenuAvailable();
    }

    @autobind
    handleClick() {
        sendLabDiscoveryCardClickEvent({
            labId: this.props.lab.id,
            courseId: this.props.sourceCourseId,
            uiRegion: this.props.uiRegion,
            trackingId: undefined,
            sourcePageId: this.props.sourcePageId,
            sourcePageType: this.props.sourcePageType,
        });
        sendLabSelectedEvent({
            lab: this.props.lab,
            uiRegion: this.props.uiRegion,
            trackingId: undefined,
            sourcePageId: this.props.sourcePageId,
            sourcePageType: this.props.sourcePageType,
        });
    }

    renderContextMenu() {
        const {lab, uiRegion, resourceContextMenu} = this.props;

        if (uiRegion === LABS_DISCOVER_COMPONENTS.LAB_LISTING_PAGE) {
            return resourceContextMenu?.getListPageLabCardContextMenu(lab);
        }
        return resourceContextMenu?.getHomePageLabCardContextMenu(lab);
    }

    render() {
        const {
            id,
            title,
            isCompleted,
            isAssigned,
            assignmentDueDate,
            isBeta,
            titleAutoslug,
            visibleInstructors,
            myLatestInstance,
        } = this.props.lab;
        const labDetailUrl = titleAutoslug ? `/labs/${titleAutoslug}/overview/` : `/labs/${id}/`;
        const canShowDuration =
            checkLabPauseResumeExperimentEnabled() &&
            this.props.uiRegion &&
            [
                LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_TAB,
                LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_PAGE,
                LABS_DISCOVER_COMPONENTS.LAB_LISTING_PAGE,
            ].includes(this.props.uiRegion);
        const shouldShowDuration =
            canShowDuration &&
            this.props.lab.hasRunningOrPausedInstance &&
            !isCompleted &&
            !!myLatestInstance?.timeLeftInSeconds;

        const containerStyleName = classNames('lab-card-container', {
            'lab-card-container--small': this.props.size === 'small',
        });
        const infoContainerStyleName = classNames('lab-info-container', {
            'lab-info-container--with-duration': shouldShowDuration,
            'lab-info-container--small-cta':
                this.props.uiRegion === LABS_DISCOVER_COMPONENTS.LAB_LISTING_PAGE,
        });

        const card = (
            <a
                href={labDetailUrl}
                className={this.props.className}
                styleName={containerStyleName}
                target={this.props.openLabInNewTab ? '_blank' : '_self'}
                data-purpose="lab-card-link"
                onClick={this.handleClick}
            >
                <div styleName={infoContainerStyleName}>
                    <LabIcon isCompleted={isCompleted} />
                    <div styleName="lab-info">
                        <h3
                            id={`lab-heading-${id}`}
                            className={
                                this.props.size === 'small' ? 'ud-heading-sm' : 'ud-heading-md'
                            }
                            styleName={classNames('title', 'title--with-more-menu-button')}
                        >
                            {title}
                        </h3>
                        <div>
                            <div styleName="badges-container">
                                {isBeta && <Badge styleName="beta-badge">{gettext('Beta')}</Badge>}
                                {this.props.shouldShowAssignment && (
                                    <>
                                        {isAssigned && (
                                            <Badge styleName="assignment-badge">
                                                {gettext('Assigned')}
                                            </Badge>
                                        )}
                                        {assignmentDueDate && (
                                            <div styleName="due-date">
                                                <DueDate dueDate={assignmentDueDate} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {this.props.shouldShowInstructors && visibleInstructors.length && (
                                <div
                                    className="ud-text-xs"
                                    styleName="lab-instructors"
                                    data-purpose="lab-instructors"
                                >
                                    {interpolate(
                                        gettext('By %(title)s'),
                                        {
                                            title: visibleInstructors
                                                ?.map((instructor) => instructor.title)
                                                .join(', '),
                                        },
                                        true,
                                    )}
                                </div>
                            )}
                            <div styleName="cta-container">
                                {!isCompleted ? (
                                    <LabCTAPractice
                                        hasRunningInstance={
                                            this.props.lab.hasRunningOrPausedInstance
                                        }
                                        size={this.props.size}
                                        labId={this.props.lab.id}
                                        isMobile={!!this.props.isMobileMax}
                                    />
                                ) : (
                                    <p styleName="completion-time" data-purpose="completion-time">
                                        {interpolate(
                                            gettext('Completed %(completionDate)s'),
                                            {
                                                completionDate: getLabCompletionDate(
                                                    this.props.lab,
                                                ),
                                            },
                                            true,
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {shouldShowDuration && (
                    <LabDuration
                        durationInSeconds={myLatestInstance.timeLeftInSeconds}
                        iconSize="xsmall"
                        isCountDownEnabled={true}
                        styleName="lab-duration-container"
                    />
                )}
            </a>
        );

        return (
            <div style={{position: 'relative'}}>
                {card}
                {this.isContextMenuShown && (
                    <div styleName="more-menu-button">{this.renderContextMenu()}</div>
                )}
            </div>
        );
    }
}
