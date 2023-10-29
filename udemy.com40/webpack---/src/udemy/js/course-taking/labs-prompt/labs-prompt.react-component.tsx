import {TrackImpression, Tracker} from '@udemy/event-tracking';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button, IconButton, Image} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {observer, Provider} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {BetaBadge} from 'browse/components/badge/beta-badge.react-component';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {sendLabDiscoveryCardImpressionEvent} from 'browse/components/my-learning-unit/utils';
import {ExploreLabsClickEvent} from 'browse/lab-events';
import CourseTakingStore from 'course-taking/course-taking.mobx-store';
import Course from 'course-taking/course.mobx-model';
import {getCurriculumItemNavigationProps} from 'course-taking/curriculum/item-link.react-component';
import requires from 'course-taking/registry/requires.js';
import {LabCard} from 'lab-taking/discovery/lab-card.react-component';
import {LAB_LANDING_PAGE_URL} from 'labs/constants';
import {TRACKING_ACTIONS} from 'labs/events/lab-in-course-prompt-action-event';
import {sendLabInCoursePromptActionEvent} from 'labs/utils';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';
import udLink from 'utils/ud-link';
import SystemMessage from 'utils/ud-system-message';

import {LabsPromptStore} from './labs-prompt.mobx-store';

import './labs-prompt.less';

interface LabsPromptProps {
    courseTakingStore: CourseTakingStore;
}

const LabsPromptContent = requires('courseTakingStore')(
    observer((props: LabsPromptProps) => {
        const [labsPromptStore] = useState(() => new LabsPromptStore());
        const history = useHistory();
        const {courseTakingStore} = props;
        const {courseId, isXLargeScreenViewportSize} = courseTakingStore;
        const course = courseTakingStore.course as Course | null;
        const onDismiss = useCallback(async () => {
            sendLabInCoursePromptActionEvent({courseId, action: TRACKING_ACTIONS.DISMISS});
            await SystemMessage.seen(SystemMessage.ids.hasSeenLabsInCoursePrompt, {
                obj_type: 'course',
                obj_id: courseId,
            });
            courseTakingStore.markHasUserSeenLabsPrompt();
            history.push(
                getCurriculumItemNavigationProps(courseTakingStore.nextCurriculumItem, history),
            );
        }, [courseId, courseTakingStore, history]);

        const onClose = useCallback(async () => {
            sendLabInCoursePromptActionEvent({courseId, action: TRACKING_ACTIONS.CLOSE});
            history.push(
                getCurriculumItemNavigationProps(courseTakingStore.nextCurriculumItem, history),
            );
        }, [courseId, courseTakingStore.nextCurriculumItem, history]);

        useEffect(() => {
            labsPromptStore.loadLabsRelatedToCourse(courseId);
        }, [labsPromptStore, courseId]);

        const trackImpression = (labId: number) => {
            sendLabDiscoveryCardImpressionEvent({
                labId,
                courseId,
                uiRegion: LABS_DISCOVER_COMPONENTS.LABS_IN_COURSE_PROMPT,
                sourcePageType: labsPromptStore.foundByTopics ? 'topic' : undefined,
            });
        };

        const header = labsPromptStore.foundByTopics ? (
            <div data-purpose="header-by-topics">
                <span className="ud-heading-lg">
                    {!!labsPromptStore.labOwnersList.length &&
                        interpolate(
                            gettext('Try labs in %(topics)s '),
                            {
                                topics: (course?.courseLabels || []).join(', '),
                            },
                            true,
                        )}
                </span>
            </div>
        ) : (
            <div data-purpose="header-by-instructors">
                <span className="ud-heading-lg">
                    {!!labsPromptStore.labOwnersList.length &&
                        interpolate(
                            gettext('Try labs by %(instructors)s '),
                            {instructors: labsPromptStore.labOwnersList.join(', ')},
                            true,
                        )}
                </span>
            </div>
        );

        return (
            <>
                <div styleName="header-container">
                    <div>
                        <h1 className="ud-heading-serif-xl" data-purpose="title" styleName="title">
                            <span>{gettext('Get hands-on practice')}</span>
                            {courseTakingStore.isSubsUserWithLabsAccess && <BetaBadge />}
                        </h1>
                        <h2 styleName="description">
                            {gettext(
                                'Labs are a hands-on experience created to help you achieve your goals faster with access to risk-free environments and real-world projects.',
                            )}
                        </h2>
                        {!labsPromptStore.isLoading && header}
                        <IconButton
                            udStyle="ghost"
                            styleName="close-button button--link"
                            data-purpose="labs-prompt-close"
                            onClick={onClose}
                        >
                            <CloseIcon label="Close" />
                        </IconButton>
                    </div>
                    {!isXLargeScreenViewportSize && (
                        <Image
                            data-purpose="header-image"
                            src={udLink.toStorageStaticAsset('labs/hands-on-labs.png')}
                            srcSet={`${udLink.toStorageStaticAsset(
                                'labs/hands-on-labs.png',
                            )} 1x, ${udLink.toStorageStaticAsset('labs/hands-on-labs-2x.png')} 2x`}
                            alt=""
                            height={100}
                            width={220}
                        />
                    )}
                </div>
                <div styleName="labs-list-wrapper">
                    {labsPromptStore.isLoading ? (
                        <Loader size="xlarge" block={true} />
                    ) : (
                        <div styleName="labs-list-container">
                            {labsPromptStore
                                .getLabsToDisplay(isXLargeScreenViewportSize ? 4 : 6, course)
                                .map((lab) => {
                                    return (
                                        <div
                                            key={`lab-card-${lab.id}`}
                                            styleName="lab-card-container"
                                        >
                                            <TrackImpression
                                                trackFunc={() => trackImpression(lab.id)}
                                            >
                                                <div>
                                                    <LabCard
                                                        lab={lab}
                                                        styleName="lab-card"
                                                        size={
                                                            isXLargeScreenViewportSize
                                                                ? 'small'
                                                                : 'large'
                                                        }
                                                        openLabInNewTab={true}
                                                        shouldShowAssignment={false}
                                                        shouldShowInstructors={true}
                                                        uiRegion={
                                                            LABS_DISCOVER_COMPONENTS.LABS_IN_COURSE_PROMPT
                                                        }
                                                        sourceCourseId={courseId}
                                                    />
                                                </div>
                                            </TrackImpression>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
                <div styleName="buttons-container">
                    <Button
                        data-purpose="labs-prompt-explore-labs"
                        udStyle="secondary"
                        styleName="button"
                        componentClass="a"
                        href={LAB_LANDING_PAGE_URL}
                        target="_blank"
                        onClick={() => Tracker.publishEvent(new ExploreLabsClickEvent())}
                    >
                        {gettext('Explore all labs')}
                    </Button>
                    <Button
                        data-purpose="labs-prompt-dismiss"
                        udStyle="ghost"
                        styleName="button button--link"
                        onClick={onDismiss}
                    >
                        {gettext("Don't show again")}
                    </Button>
                </div>
            </>
        );
    }),
);

export class LabsPrompt extends React.PureComponent {
    ufbContextMenu = createUFBContextMenu();
    render() {
        return (
            <Provider resourceContextMenu={this.ufbContextMenu}>
                <div
                    className="ct-dashboard-separator"
                    styleName="wrapper"
                    data-purpose="labs-prompt-wrapper"
                >
                    <div styleName="container">
                        <LabsPromptContent />
                    </div>
                </div>
            </Provider>
        );
    }
}
