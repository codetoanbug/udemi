import {TrackImpression} from '@udemy/event-tracking';
import {useUDData} from '@udemy/ud-data';
import React from 'react';

import {LabsCarousel} from 'browse/components/labs-carousel/labs-carousel.react-component';
import {discoveryTracker} from 'browse/tracking';
import Lab from 'labs/lab.mobx-model';

import {LabUnitProps} from './types';

export const LabUnit = ({
    unit,
    title,
    subtitle,
    uiRegion,
    isStandaloneUnit = false,
    sourcePageId,
    sourcePageType,
    className,
}: LabUnitProps) => {
    const {me} = useUDData();
    if (!unit.items.length) return <div />;
    const labs = unit.items;
    const labsShaped = labs.map((lab) => {
        return new Lab(lab, {me});
    });

    const trackLabUnitImpression = () => {
        discoveryTracker.trackUnitView(unit, unit.item_type);
    };

    return (
        <TrackImpression trackFunc={trackLabUnitImpression}>
            <div data-purpose="lab-unit" className={className}>
                <LabsCarousel
                    labs={labsShaped}
                    title={title}
                    subtitle={subtitle}
                    uiRegion={uiRegion}
                    hideEstimatedTime={true}
                    isStandaloneUnit={isStandaloneUnit}
                    sourcePageId={sourcePageId}
                    sourcePageType={sourcePageType}
                />
            </div>
        </TrackImpression>
    );
};
