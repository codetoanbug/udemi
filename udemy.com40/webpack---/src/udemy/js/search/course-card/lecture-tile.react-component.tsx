import {useI18n} from '@udemy/i18n';
import {Image, Button, ButtonProps} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {getDetachedDoc} from 'base-components/ungraduated/form/rich-text-editor/helpers';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import styles from './lecture-tile.less';

export interface LectureTileProps {
    buttonProps?: ButtonProps;
    courseImage?: string;
    duration: string;
    lectureImage?: string;
    title: string;
}

export const LectureTile = ({
    buttonProps,
    courseImage,
    duration,
    lectureImage,
    title,
}: LectureTileProps) => {
    const {gettext} = useI18n();
    const div = getDetachedDoc().createElement('div');
    div.innerHTML = title;
    const lectureTitleText = div.textContent;
    return (
        <div className={styles['lecture-tile-container']}>
            <div className={styles['lecture-tile-image-container']}>
                <Image
                    className={styles['lecture-tile-image']}
                    src={lectureImage ?? courseImage}
                    alt=""
                />
                <span className="ud-sr-only">{gettext('Duration')}</span>
                <time className={classNames('ud-text-xs', styles['lecture-tile-duration'])}>
                    {duration}
                </time>
            </div>
            <Button
                {...buttonProps}
                udStyle="secondary"
                className={styles['lecture-tile-button']}
                aria-label={
                    buttonProps?.href
                        ? interpolate(gettext('%s - Go to Course'), [lectureTitleText])
                        : interpolate(gettext('%s - Open Lecture'), [lectureTitleText])
                }
            >
                <p
                    className={classNames('ud-text-xs', styles['lecture-tile-title'])}
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'course-card:lecture-tile-title',
                        html: title,
                        dataPurpose: 'lecture-tile-title',
                    })}
                />
            </Button>
        </div>
    );
};
