import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {Image} from '@udemy/react-core-components';
import React from 'react';

import {GetStartedCard} from 'browse/components/get-started-card/get-started-card.react-component';
import {LabCardTrackingProps} from 'browse/components/lab-card/types';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {sendLabDiscoveryCardImpressionEvent} from 'browse/components/my-learning-unit/utils';
import {ExploreLabsClickEvent} from 'browse/lab-events';
import Lab from 'labs/lab.mobx-model';
import {getLabDiscoveryCardExperimentContent} from 'labs/utils';
import {EMPTY_LAB_OBJECT} from 'my-courses-v3/labs/types';
import udLink from 'utils/ud-link';

import {LabCard} from './lab-card.react-component';

export const LabDiscoveryCard = ({
    lab,
    size = 'large',
    className,
    uiRegion = LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_TAB,
}: LabDiscoveryCardProps & LabCardTrackingProps) => {
    const trackImpression = () => {
        sendLabDiscoveryCardImpressionEvent({
            labId: lab.id,
            courseId: undefined,
            uiRegion,
            sourcePageType: undefined,
        });
    };

    if (lab instanceof Lab) {
        return (
            <TrackImpression trackFunc={trackImpression}>
                <div>
                    <LabCard lab={lab} size={size} className={className} uiRegion={uiRegion} />
                </div>
            </TrackImpression>
        );
    }
    const {title, desc, cta} = getLabDiscoveryCardExperimentContent();
    return (
        <GetStartedCard
            className={className}
            cta={interpolate(gettext('%(cta)s'), {cta}, true)}
            text={interpolate(gettext('%(desc)s'), {desc}, true)}
            title={interpolate(gettext('%(title)s'), {title}, true)}
            link={'/labs/listing/'}
            size={size}
            onCardClick={() => {
                Tracker.publishEvent(new ExploreLabsClickEvent());
            }}
            icon={
                <Image
                    alt=""
                    src={udLink.toStorageStaticAsset('labs/start-practicing.jpg')}
                    srcSet={`${udLink.toStorageStaticAsset(
                        'labs/start-practicing.jpg',
                    )} 1x, ${udLink.toStorageStaticAsset('labs/start-practicing-2x.jpg')} 2x`}
                    width={120}
                    height={90}
                />
            }
        />
    );
};

interface LabDiscoveryCardProps {
    lab: Lab | typeof EMPTY_LAB_OBJECT;
    size?: 'small' | 'large';
    className?: string | undefined;
}
