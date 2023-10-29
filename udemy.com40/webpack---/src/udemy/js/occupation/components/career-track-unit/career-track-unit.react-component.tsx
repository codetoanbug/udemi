import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {DATA_SCIENTIST_UNIT_TITLE} from 'occupation/constants';
import {LearningMapStore} from 'occupation/stores/learning-map/learning-map.mobx-store';

import {CareerTrackCard} from './career-track-card.react-component';
import styles from './career-track-unit.less';

export interface CareerTrackDataProps {
    title: string;
    description: string;
    url: string;
    imgKey: string;
}

export interface CareerTrackUnitProps {
    careerTrackUnit: CareerTrackDataProps[];
    uiRegion: string;
    sourcePageType?: string | undefined;
    sourcePageId?: number | undefined;
    learningMapStore?: LearningMapStore;
    className?: string;
    showBySetting?: boolean;
}

export const CareerTrackUnit = observer(
    ({
        careerTrackUnit,
        uiRegion,
        sourcePageType,
        sourcePageId,
        learningMapStore = new LearningMapStore(),
        className,
        showBySetting = false,
    }: CareerTrackUnitProps) => {
        if (!careerTrackUnit.length) {
            return null;
        }
        return (
            <div className={classNames(className, styles['career-track-wrapper'])}>
                {careerTrackUnit.map((unit) => {
                    if (
                        showBySetting &&
                        !learningMapStore.shouldShowBySettingForUnitWithTitle(unit.title)
                    )
                        return null;
                    return (
                        <CareerTrackCard
                            careerTrackData={unit}
                            uiRegion={uiRegion}
                            sourcePageType={sourcePageType}
                            sourcePageId={sourcePageId}
                            showPopOver={unit.title === DATA_SCIENTIST_UNIT_TITLE}
                            learningMapStore={learningMapStore}
                            key={unit.title}
                        />
                    );
                })}
            </div>
        );
    },
);
