import {TrackImpression, TrackingData} from '@udemy/event-tracking';
import {LocalizedHtml} from '@udemy/i18n';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Button, ButtonProps} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {IS_DEFAULT_PLAYING} from './constants';
import styles from './video-card.less';

function attachAutoplayParam(url: string) {
    const [urlPart, queryString] = url.split('?');
    const searchParams = new URLSearchParams(queryString);
    searchParams.set(IS_DEFAULT_PLAYING, '');
    return `${urlPart}?${searchParams.toString()}`;
}

interface TrackImpressionData {
    item: TrackingData;
}

interface TrackImpressionContext {
    index: number;
    backendSource: string;
}

interface TrackingContext {
    backendSource: string;
    trackImpressionFunc(data: TrackImpressionData, context: TrackImpressionContext): void;
}

export interface VideoData {
    url?: string;
    enroll_url?: string;
    learn_url?: string;
    title: string;
    primary_topic_title: string;
    content_length: number;
}

interface VideoCardProps {
    data: VideoData;
    showTopicTitle?: boolean;
    index?: number;
    trackingData?: TrackingData;
    trackingContext?: TrackingContext;
    isConsumerSubsSubscriber?: boolean;
    buttonProps?: ButtonProps;
    onAction?(): void;
}

export const VideoCard = inject('trackingContext')(
    observer(
        ({
            data,
            showTopicTitle = false,
            index = -1,
            trackingContext,
            trackingData,
            onAction,
            isConsumerSubsSubscriber,
            buttonProps,
        }: VideoCardProps) => {
            let url = data.url;
            const lectureUrl = isConsumerSubsSubscriber ? data.learn_url : data.enroll_url;

            if ((!url || isConsumerSubsSubscriber) && lectureUrl) {
                url = attachAutoplayParam(lectureUrl);
            }

            const defaultButtonProps = {
                componentClass: 'a',
                href: url,
            } as ButtonProps;

            function trackImpression() {
                if (trackingContext && trackingData) {
                    const {backendSource, trackImpressionFunc} = trackingContext;
                    const context = {
                        index,
                        backendSource,
                    };
                    trackImpressionFunc({item: trackingData}, context);
                }
            }

            return (
                <TrackImpression trackFunc={trackImpression}>
                    <Button
                        {...(buttonProps ?? defaultButtonProps)}
                        onClick={onAction}
                        udStyle="secondary"
                        data-purpose="card-url"
                        className={styles.wrapper}
                    >
                        <PlayIcon label={false} size="xlarge" className={styles['play-icon']} />
                        <div
                            className={classNames('ud-heading-sm', styles.title)}
                            data-purpose="card-title"
                        >
                            {data.title}
                        </div>
                        <div className={classNames('ud-text-xs', styles['bottom-info-container'])}>
                            {showTopicTitle && (
                                <div data-purpose="topic" className={styles.topic}>
                                    {data.primary_topic_title}
                                </div>
                            )}
                            <LocalizedHtml
                                dataPurpose="video-duration"
                                html={gettext('<span class="duration">%(duration)s</span> video')}
                                interpolate={{
                                    duration: (
                                        <Duration
                                            numSeconds={data.content_length}
                                            precision={Duration.PRECISION.MINUTES}
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </Button>
                </TrackImpression>
            );
        },
    ),
);
