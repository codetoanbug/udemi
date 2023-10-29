import {Tracker, TrackImpression} from '@udemy/event-tracking';
import ADAudioIcon from '@udemy/icons/dist/ad-audio-outline.ud-icon';
import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import AssignmentIcon from '@udemy/icons/dist/assignment-outline.ud-icon';
import AudioIcon from '@udemy/icons/dist/audio.ud-icon';
import CaptionsIcon from '@udemy/icons/dist/captions-outline.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import DownloadableResourceIcon from '@udemy/icons/dist/downloadable-resource.ud-icon';
import LifetimeIcon from '@udemy/icons/dist/lifetime.ud-icon';
import QuizIcon from '@udemy/icons/dist/lightbulb-off.ud-icon';
import CertificateIcon from '@udemy/icons/dist/medal.ud-icon';
import MobileIcon from '@udemy/icons/dist/mobile.ud-icon';
import PracticeTestIcon from '@udemy/icons/dist/quiz.ud-icon';
import TrophyIcon from '@udemy/icons/dist/trophy.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {BaseIconProps, BlockList, BlockListSize} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {useMatchMedia} from 'base-components/responsive/match-media.react-component';
import {LearningProductType} from 'browse/events';
import {
    CourseIncentivesImpressionEvent,
    CourseIncentiveImpressionEvent,
    IncentiveType,
} from 'course-landing-page/events';

import {IncentivesPlacement} from './constants';

import './incentives.less';

/**
 * Fields from the CLC API response for the incentives component
 */
export interface IncentivesData {
    is_free_seo_exp: boolean;
    video_content_length: string;
    audio_content_length: string;
    num_articles: number;
    num_additional_resources: number;
    num_quizzes: number;
    num_practice_tests: number;
    num_coding_exercises: number;
    has_lifetime_access: boolean;
    devices_access: string;
    has_assignments: boolean;
    has_certificate: boolean;
    num_cpe_credits: number;
    placement: string;
    reorder_incentives: boolean;
    show_incentives_on_tablet: boolean;
    show_quizzes: boolean;
    move_lifetime_access_to_purchase_section: boolean;
    has_closed_captions: boolean;
    has_audio_description: boolean;
}

/**
 * Props specific to the Incentives react component
 */
export interface IncentivesProps {
    incentivesData?: IncentivesData;
    placement: IncentivesPlacement;
    courseTrackingId?: string;
    courseId?: number;
    listSize?: BlockListSize;
    isConsumerSubsAware?: boolean;
}

interface IncentiveListItem {
    show: boolean | null;
    priority: number;
    incentiveType: IncentiveType;
    value: string;
    iconComponent: (props: Omit<BaseIconProps, 'glyph'>) => JSX.Element;
    content: string;
    dataPurpose: string;
}

export const Incentives = ({
    incentivesData,
    placement,
    courseId,
    courseTrackingId,
    listSize = 'small',
    isConsumerSubsAware = false,
}: IncentivesProps) => {
    const isMobile = useMatchMedia('mobile-max');

    if (!incentivesData) {
        return null;
    }

    const {
        is_free_seo_exp: isFreeSEOExp,
        video_content_length: videoContentLength,
        audio_content_length: audioContentLength,
        num_articles: numArticles,
        num_additional_resources: numAdditionalResources,
        num_quizzes: numQuizzes,
        num_practice_tests: numPracticeTests,
        num_coding_exercises: numCodingExercises,
        has_lifetime_access: hasLifetimeAccess,
        devices_access: devicesAccess,
        has_assignments: hasAssignments,
        has_certificate: hasCertificate = false,
        num_cpe_credits: numCpeCredits = 0,
        has_closed_captions: hasClosedCaptions = false,
        has_audio_description: hasAudioDescription = false,
        reorder_incentives: reorderIncentives = false,
        show_incentives_on_tablet: showIncentivesOnTablet = false,
        show_quizzes: showQuizzes = false,
    } = incentivesData;

    const hasDoubleColumn = placement === IncentivesPlacement.BODY && !isMobile;

    function trackImpression() {
        if (courseTrackingId && courseId !== undefined) {
            const learningProduct = {
                id: courseId,
                trackingId: courseTrackingId,
                type: LearningProductType.COURSE,
            };
            Tracker.publishEvent(new CourseIncentivesImpressionEvent(placement, learningProduct));
        }
    }

    function trackIncentiveImpression(
        incentiveType: IncentiveType,
        value: string,
        position: number,
    ) {
        if (courseTrackingId && courseId !== undefined) {
            Tracker.publishEvent(
                new CourseIncentiveImpressionEvent(
                    courseId,
                    courseTrackingId,
                    incentiveType,
                    value,
                    position,
                ),
            );
        }
    }

    let incentivesList = [
        {
            show: Boolean(videoContentLength),
            priority: 0,
            iconComponent: VideoIcon,
            incentiveType: IncentiveType.VIDEO_CONTENT_LENGTH,
            value: videoContentLength,
            content: interpolate(
                gettext('%(videoContentLength)s on-demand video'),
                {videoContentLength},
                true,
            ),
            dataPurpose: 'video-content-length',
        },
        {
            show: Boolean(audioContentLength),
            priority: 1,
            iconComponent: AudioIcon,
            incentiveType: IncentiveType.AUDIO_CONTENT_LENGTH,
            value: audioContentLength,
            content: interpolate(
                gettext('%(audioContentLength)s on-demand audio'),
                {audioContentLength},
                true,
            ),
            dataPurpose: 'audio-content-length',
        },
        {
            show: Boolean(numArticles),
            priority: 6,
            iconComponent: ArticleIcon,
            incentiveType: IncentiveType.NUM_ARTICLES,
            value: numArticles.toString(),
            content: ninterpolate(
                '%(numArticles)s article',
                '%(numArticles)s articles',
                numArticles,
                {numArticles},
            ),
            dataPurpose: 'num-articles',
        },
        {
            show: Boolean(numAdditionalResources),
            priority: 7,
            iconComponent: DownloadableResourceIcon,
            incentiveType: IncentiveType.NUM_RESOURCES,
            value: numAdditionalResources.toString(),
            content: ninterpolate(
                '%(numAdditionalResources)s downloadable resource',
                '%(numAdditionalResources)s downloadable resources',
                numAdditionalResources,
                {numAdditionalResources},
            ),
            dataPurpose: 'num-additional-resources',
        },
        {
            show: Boolean(numQuizzes) && showQuizzes,
            priority: 3,
            iconComponent: QuizIcon,
            incentiveType: IncentiveType.NUM_QUIZZES,
            value: numQuizzes.toString(),
            content: ninterpolate('%(numQuizzes)s quiz', '%(numQuizzes)s quizzes', numQuizzes, {
                numQuizzes,
            }),
            dataPurpose: 'num-quizzes',
        },
        {
            show: Boolean(numPracticeTests),
            priority: 4,
            iconComponent: PracticeTestIcon,
            incentiveType: IncentiveType.NUM_PRACTICE_TESTS,
            value: numPracticeTests.toString(),
            content: ninterpolate(
                '%(numPracticeTests)s practice test',
                '%(numPracticeTests)s practice tests',
                numPracticeTests,
                {numPracticeTests},
            ),
            dataPurpose: 'num-practice-tests',
        },
        {
            show: Boolean(numCodingExercises),
            priority: 2,
            iconComponent: CodeIcon,
            incentiveType: IncentiveType.NUM_CODING_EXERCISES,
            value: numCodingExercises.toString(),
            content: ninterpolate(
                '%(numCodingExercises)s coding exercise',
                '%(numCodingExercises)s coding exercises',
                numCodingExercises,
                {numCodingExercises},
            ),
            dataPurpose: 'num-coding-exercises',
        },
        {
            show: hasLifetimeAccess && (!isConsumerSubsAware || isMobile),
            priority: 9,
            iconComponent: LifetimeIcon,
            incentiveType: IncentiveType.HAS_LIFETIME_ACCESS,
            value: String(hasLifetimeAccess && (!isConsumerSubsAware || isMobile)),
            content: gettext('Full lifetime access'),
            dataPurpose: 'has-lifetime-access',
        },
        {
            show: Boolean(devicesAccess),
            priority: 8,
            iconComponent: MobileIcon,
            incentiveType: IncentiveType.DEVICES_ACCESS,
            value: devicesAccess,
            content: devicesAccess,
            dataPurpose: 'devices-access-incentive',
        },
        {
            show: hasAssignments,
            priority: 5,
            iconComponent: AssignmentIcon,
            incentiveType: IncentiveType.HAS_ASSIGNMENTS,
            value: String(hasAssignments),
            content: gettext('Assignments'),
            dataPurpose: 'has-assignments-incentive',
        },
        {
            show: hasCertificate,
            priority: 13,
            iconComponent: TrophyIcon,
            incentiveType: IncentiveType.HAS_CERTIFICATE,
            value: String(hasCertificate),
            content: gettext('Certificate of completion'),
            dataPurpose: 'incentive-certificate',
        },
        {
            show: Boolean(numCpeCredits),
            priority: 10,
            iconComponent: CertificateIcon,
            incentiveType: IncentiveType.NUM_CPE_CREDITS,
            value: numCpeCredits.toString(),
            content: interpolate(
                gettext('NASBA CPE credits: %(numCpeCredits)s'),
                {numCpeCredits: numCpeCredits.toFixed(1)},
                true,
            ),
            dataPurpose: 'incentive-cpe',
        },
        {
            show: hasClosedCaptions,
            priority: 11,
            iconComponent: CaptionsIcon,
            incentiveType: IncentiveType.HAS_CLOSED_CAPTIONS,
            value: String(hasClosedCaptions),
            content: gettext('Closed captions'),
            dataPurpose: 'incentive-closed-captions',
        },
        {
            show: hasAudioDescription,
            priority: 12,
            iconComponent: ADAudioIcon,
            incentiveType: IncentiveType.HAS_AUDIO_DESCRIPTION,
            value: String(hasAudioDescription),
            content: gettext('Audio description in existing audio'),
            dataPurpose: 'incentive-audio-description',
        },
    ];

    incentivesList = incentivesList.filter((incentive) => incentive.show);

    /**
     * Container containing the incentives list for particular course
     */
    const incentivesContainer = (
        <TrackImpression trackFunc={trackImpression}>
            <div styleName="incentives-container">
                <h2
                    className={
                        listSize === 'large' && !isMobile ? 'ud-heading-xl' : 'ud-heading-md'
                    }
                    styleName="header"
                    data-purpose="header"
                >
                    {isFreeSEOExp
                        ? gettext('This tutorial includes:')
                        : gettext('This course includes:')}
                </h2>
                {reorderIncentives
                    ? renderReorderedIncentivesList(incentivesList)
                    : renderIncentivesList(incentivesList)}
            </div>
        </TrackImpression>
    );

    function renderReorderedIncentivesList(list: IncentiveListItem[]) {
        if (!list || list.length < 2) {
            return renderIncentivesList(list);
        }

        // First, sort the list by ascending priority.
        list.sort(function (a, b) {
            return a.priority - b.priority;
        });

        // If we only have one column, then we don't need to do anything further.
        if (!hasDoubleColumn) {
            return renderIncentivesList(list);
        }

        // Otherwise, we need to construct the lists that each column will take. So:
        // Split the list in half, making the first half larger if the list is odd-sized.
        const pivot = Math.floor(list.length / 2);
        const firstList = list.slice(0, list.length - pivot);
        const secondList = list.slice(-1 * pivot);

        return (
            <div styleName={classNames('double-list-container')}>
                {renderIncentivesList(firstList)}
                {renderIncentivesList(secondList, firstList.length)}
            </div>
        );
    }

    function renderIncentivesList(incentivesList: IncentiveListItem[], positionOffset?: number) {
        return (
            <BlockList
                className="incentive-list"
                size={listSize === 'large' && !isMobile ? 'large' : 'small'}
                padding="tight"
            >
                {incentivesList.map((incentive, index) => {
                    const Icon = incentive.iconComponent;
                    return (
                        <BlockList.Item key={index} icon={<Icon label={false} />}>
                            <TrackImpression
                                trackFunc={() =>
                                    trackIncentiveImpression(
                                        incentive.incentiveType,
                                        incentive.value,
                                        index + (positionOffset ?? 0),
                                    )
                                }
                            >
                                <span data-purpose={incentive.dataPurpose}>
                                    {incentive.content}
                                </span>
                            </TrackImpression>
                        </BlockList.Item>
                    );
                })}
            </BlockList>
        );
    }

    /**
     * Wrap if the container placement is in CLP Body
     */
    if (placement === IncentivesPlacement.BODY) {
        return (
            <div
                className="component-margin"
                styleName={classNames({
                    container: hasDoubleColumn && !reorderIncentives,
                    'hide-on-tablet': !showIncentivesOnTablet,
                    // There are two possible placements on desktop, sidebar and body. Hide on the desktop if the placement is not accurate.
                    'hide-on-desktop': placement !== incentivesData.placement,
                })}
                data-purpose="incentives-clp-body"
            >
                {incentivesContainer}
            </div>
        );
    }

    return !isMobile ? <div styleName="hide-on-tablet">{incentivesContainer}</div> : null;
};
