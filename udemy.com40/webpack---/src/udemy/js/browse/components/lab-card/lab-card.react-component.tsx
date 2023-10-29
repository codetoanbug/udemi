import {TrackImpression} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import {UDData, useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import {sendLabDiscoveryCardClickEvent} from 'browse/components/my-learning-unit/utils';
import {getLabCompletionDate} from 'lab-taking/discovery/helpers';
import {LAB_VERTICAL, SEARCH_PAGE, TOPIC_TO_LAB_VERTICAL_MAP} from 'labs/constants';
import {LabBetaBadge} from 'labs/lab-card-components/lab-beta-badge.react-component';
import {LabCTAPractice} from 'labs/lab-card-components/lab-cta-practice.react-component';
import {LabIcon} from 'labs/lab-card-components/lab-icon.react-component';
import {isLabVerticalInBeta} from 'labs/lab.mobx-model';
import {getLabVerticalIconForKey, sendLabSelectedEvent} from 'labs/utils';
import {trackSearchLabImpression} from 'search/events';

import styles from './lab-card.less';
import {LabCardProps, LabCardTrackingProps} from './types';

type TrackedLabCardProps = LabCardProps & LabCardTrackingProps;

export const LabCardContainer = (props: TrackedLabCardProps) => {
    const handleClick = () => {
        sendLabDiscoveryCardClickEvent({
            courseId: props.sourceCourseId,
            // Convert lab id to an integer for event tracking as graphql type is a string
            labId: parseInt(props.lab.id, 10),
            trackingId: props.lab.metadata?.trackingId,
            uiRegion: props.uiRegion,
            sourcePageId: props.sourcePageId,
            sourcePageType: props.sourcePageType,
        });
        sendLabSelectedEvent({
            lab: props.lab,
            sourcePageId: props.sourcePageId,
            sourcePageType: props.sourcePageType,
            uiRegion: props.uiRegion,
            trackingId: props.lab.metadata?.trackingId,
        });
    };

    const trackImpression = () => {
        const labId = props.lab.id;
        const labTrackingId = props.lab.metadata?.trackingId;
        const searchTrackingId = props.searchResultSetTrackingId;

        if (labTrackingId && searchTrackingId) {
            // Convert lab id to an integer for event tracking as graphql type is a string
            const lab = {
                id: parseInt(labId, 10),
                tracking_id: labTrackingId,
            };

            trackSearchLabImpression(lab, searchTrackingId);
        }
    };

    return (
        <TrackImpression trackFunc={trackImpression} visibilityThreshold={0.5}>
            <div>
                <LabCard
                    lab={props.lab}
                    handleClick={handleClick}
                    fromPage={props.fromPage}
                    popoverTrigger={props.popoverTrigger}
                    className={props.className}
                    hideEstimatedTime={props.hideEstimatedTime}
                />
            </div>
        </TrackImpression>
    );
};

export const LabCard = (props: LabCardProps) => {
    const {gettext, interpolate} = useI18n();
    const {request} = useUDData();
    const {
        id,
        title,
        minEstimatedTime,
        maxEstimatedTime,
        visibleInstructors,
        vertical,
        verticalLabel,
        isBeta = false,
        isCompleted,
        hasRunningInstance = false,
        topics,
        titleAutoslug,
    } = props.lab;

    /**
     * Estimated time for labs comes in differently (minutes vs. seconds) depending on endpoint.
     * If it comes in as seconds (e.g. via search), convert to minutes, which is what we want
     * to show users in the UI.
     */
    let minEstTimeInMins = minEstimatedTime;
    let maxEstTimeInMins = maxEstimatedTime;

    if (props.fromPage === SEARCH_PAGE) {
        minEstTimeInMins = minEstimatedTime / 60;
        maxEstTimeInMins = maxEstimatedTime / 60;
    }

    const getTopicVertical = () => {
        if (topics && topics.length > 0) {
            for (const topic of topics) {
                const topicVerticalId = topic.id as keyof typeof TOPIC_TO_LAB_VERTICAL_MAP;
                const topicVertical = TOPIC_TO_LAB_VERTICAL_MAP[topicVerticalId];
                if (topicVertical) {
                    return topicVertical;
                }
            }
        }

        return '';
    };
    const topicVertical = getTopicVertical();
    const matchingLabVertical =
        LAB_VERTICAL[vertical ?? (topicVertical as keyof typeof LAB_VERTICAL)];
    const LabVerticalIconComponent = getLabVerticalIconForKey(
        vertical ?? topicVertical,
    ) as React.ElementType;
    const labDetailUrl = titleAutoslug ? `/labs/${titleAutoslug}/overview/` : `/labs/${id}/`;
    const isMobileMax = useMatchMedia('mobile-max');
    const hasBetaBadge = isBeta || isLabVerticalInBeta(topicVertical);
    const hasOneLinerTitle = hasBetaBadge && props.className?.includes('lab-card-short');

    return (
        <a
            href={labDetailUrl}
            onClick={props.handleClick}
            data-purpose="lab-card-link"
            className={styles['lab-card-container']}
        >
            <LabIcon />
            <div className={classNames(props.className, styles['lab-info'])}>
                <h3
                    id={`lab-heading-${id}`}
                    data-purpose="lab-title-url"
                    className={classNames(
                        'ud-heading-md',
                        hasOneLinerTitle ? styles['title-one-liner'] : styles.title,
                    )}
                >
                    {title}
                </h3>
                <div>
                    {hasBetaBadge && (
                        <div>
                            <LabBetaBadge />
                        </div>
                    )}
                    <div className={classNames('ud-text-xs', styles['info-completion-time'])}>
                        {matchingLabVertical && (
                            <>
                                <LabVerticalIconComponent
                                    label={false}
                                    className={styles['info-icon']}
                                    glyph={matchingLabVertical.glyph}
                                />
                                <span className={styles['info-content']} data-purpose="vertical">
                                    {verticalLabel ?? matchingLabVertical.label}
                                </span>
                            </>
                        )}
                        {!props.hideEstimatedTime && (
                            <>
                                <AccessTimeIcon label={false} className={styles['info-icon']} />
                                <span
                                    className={styles['info-content']}
                                    data-purpose="estimated-time"
                                >
                                    <Duration
                                        numSeconds={minEstTimeInMins * 60}
                                        precision={Duration.PRECISION.MINUTES}
                                        presentationStyle={Duration.STYLE.HUMAN}
                                    />
                                    {'-'}
                                    <Duration
                                        numSeconds={maxEstTimeInMins * 60}
                                        precision={Duration.PRECISION.MINUTES}
                                        presentationStyle={Duration.STYLE.HUMAN}
                                    />
                                </span>
                            </>
                        )}
                    </div>
                    <div
                        className={classNames('ud-text-xs', styles['lab-owner'])}
                        data-purpose="lab-owner"
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
                    {isCompleted ? (
                        <p className={styles['completion-date']} data-purpose="completion-date">
                            {interpolate(
                                gettext('Completed %(completionDate)s'),
                                {
                                    completionDate: getLabCompletionDate(props.lab, {
                                        request,
                                    } as UDData),
                                },
                                true,
                            )}
                        </p>
                    ) : (
                        <LabCTAPractice
                            hasRunningInstance={hasRunningInstance ?? false}
                            size="small"
                            labId={id}
                            isMobile={!!isMobileMax}
                        />
                    )}
                    {props.popoverTrigger && (
                        <div className={styles['popover-button']}>{props.popoverTrigger}</div>
                    )}
                </div>
            </div>
        </a>
    );
};
