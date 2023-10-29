import {Tracker, TrackImpression, generateTrackingId} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import {udLink} from '@udemy/ud-data';
import React from 'react';

import {CareerTrackContextMenu} from 'occupation/components/career-track-context-menu/career-track-context-menu.react-component';
import {CareerTrackPageLinkClickEvent, CareerTrackPageLinkImpressionEvent} from 'occupation/events';
import {LearningMapStore} from 'occupation/stores/learning-map/learning-map.mobx-store';

import styles from './career-track-card.less';
import {CareerTrackUnitPopover} from './career-track-unit-popover.react-component';
import {CareerTrackDataProps} from './career-track-unit.react-component';

export interface CareerTrackCardProps {
    careerTrackData: CareerTrackDataProps;
    uiRegion: string;
    sourcePageType?: string | undefined;
    sourcePageId?: number | undefined;
    learningMapStore?: LearningMapStore;
    showPopOver?: boolean;
}

export const CareerTrackCard = ({
    careerTrackData,
    uiRegion,
    sourcePageType,
    sourcePageId,
    learningMapStore = new LearningMapStore(),
    showPopOver,
}: CareerTrackCardProps) => {
    const {gettext, interpolate} = useI18n();
    const isSmMin = useMatchMedia('sm-min');
    const [trackingId, setTrackingId] = React.useState('123'); // temp tracking id until iso rendering hydration is over
    React.useEffect(() => {
        setTrackingId(generateTrackingId());
    }, []);
    const url = `${careerTrackData.url}?trackingId=${trackingId}`;
    const trackClick = () => {
        Tracker.publishEvent(
            new CareerTrackPageLinkClickEvent({
                displayTitle: careerTrackData.title,
                uiRegion,
                trackingId,
                sourcePageType,
                sourcePageId,
            }),
        );
    };

    const trackImpression = () => {
        Tracker.publishEvent(
            new CareerTrackPageLinkImpressionEvent({
                displayTitle: careerTrackData.title,
                uiRegion,
                sourcePageType,
                sourcePageId,
            }),
        );
    };

    const unitImg = {
        src: udLink.toStorageStaticAsset(
            `consumer-subscription/career-guide/${careerTrackData.imgKey}.jpg`,
        ),
        src2x: udLink.toStorageStaticAsset(
            `consumer-subscription/career-guide/${careerTrackData.imgKey}-2x.jpg`,
        ),
    };

    const getContextMenu = () => {
        return (
            <div className={styles['context-menu-wrapper']}>
                <CareerTrackContextMenu
                    title={careerTrackData.title}
                    learningMapStore={learningMapStore}
                />
            </div>
        );
    };

    /**
     * This button wraps and makes the following card elements clickable:
     * - image
     * - title
     * - description
     *
     * @param buttonContent
     * @returns Button
     */
    const wrapperButton = (buttonContent: React.ReactNode) => {
        return (
            <Button
                aria-hidden={true}
                componentClass="a"
                href={url}
                onClick={trackClick}
                className={styles['wrapper-button']}
                tabIndex={-1}
                udStyle="ghost"
            >
                {buttonContent}
            </Button>
        );
    };

    return (
        <TrackImpression trackFunc={trackImpression}>
            <div data-purpose="career-track-card" className={styles.container}>
                {wrapperButton(
                    <Image
                        alt=""
                        width={144}
                        height={144}
                        src={unitImg.src}
                        srcSet={`${unitImg.src} 1x, ${unitImg.src2x} 2x`}
                    />,
                )}
                <div data-purpose="career-track-card-content" className={styles.content}>
                    <div className={styles['header-container']}>
                        {wrapperButton(
                            <div className="ud-heading-serif-xl">
                                {interpolate(
                                    gettext('For %(occupationTitle)s'),
                                    {occupationTitle: careerTrackData.title},
                                    true,
                                )}
                            </div>,
                        )}
                        {showPopOver && isSmMin ? (
                            <CareerTrackUnitPopover trigger={getContextMenu()} url={url} />
                        ) : (
                            getContextMenu()
                        )}
                    </div>
                    {wrapperButton(<div className="ud-text-sm">{careerTrackData.description}</div>)}
                    <Button
                        componentClass="a"
                        data-purpose="see-more-button"
                        href={url}
                        udStyle="ghost"
                        size="xsmall"
                        className="ud-link-underline"
                        onClick={trackClick}
                    >
                        {gettext('Explore Skills')}
                    </Button>
                </div>
            </div>
        </TrackImpression>
    );
};
