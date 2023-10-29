import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';

import {STATUS} from '../constants';
import {setupTooltipLocalStorage} from '../tooltips/setup-tooltip-local-storage';
import {TooltipWrapper} from '../tooltips/tooltip-wrapper.react-component';
import styles from './available-lectures.module.less';

interface AvailableLecturesProps {
    availableLectures: number;
    usedLectures: number;
    currentTooltip?: {
        type: string;
        title: string;
        text: string;
        position?: string;
    };
}

export const AvailableLectures = ({
    availableLectures,
    currentTooltip,
    usedLectures,
}: AvailableLecturesProps) => {
    const {ninterpolate} = useI18n();

    function renderIndicators(status: string) {
        const indicators = [];
        const isUsedStatus = status === STATUS.USED;
        const statusCount = isUsedStatus ? usedLectures : availableLectures;
        for (let i = 0; i < statusCount; i++) {
            const indicator = (
                <PlayIcon
                    key={`${status}${i}`}
                    label={false}
                    size="large"
                    className={classNames(styles['play-icon'], {
                        [styles['play-icon--used-lecture']]: isUsedStatus,
                    })}
                    data-testid="play-icon"
                />
            );
            indicators.push(indicator);
        }
        return indicators;
    }

    let indicators = (
        <div className={styles['available-lectures-indicators']}>
            {Object.values(STATUS).map((status) => renderIndicators(status))}
        </div>
    );
    const availableLectureTooltipPositions = ['first_available', 'first_used'];
    const storage = setupTooltipLocalStorage('get_started');
    if (usedLectures && storage.get('tooltip_type') !== 'get_started') {
        storage.set('tooltip_type', 'get_started');
    }
    if (
        currentTooltip &&
        availableLectureTooltipPositions.includes(currentTooltip.position ?? '')
    ) {
        indicators = (
            <TooltipWrapper
                isOpen={true}
                placement="top"
                trigger={indicators}
                content={currentTooltip}
            />
        );
    }

    return (
        <div
            className={classNames('ud-heading-sm', styles['available-lectures'])}
            data-testid="available-lectures"
        >
            {ninterpolate('%s free video available', '%s free videos available', availableLectures)}
            {indicators}
        </div>
    );
};
