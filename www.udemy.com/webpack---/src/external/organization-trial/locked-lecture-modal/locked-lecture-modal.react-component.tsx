import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import {Modal} from '@udemy/react-dialog-components';
import {useSiteStats} from '@udemy/ud-data';

import {UnlockButton} from '../unlock-button/unlock-button.react-component';
import styles from './locked-lecture-modal.module.less';

interface LockedLectureModalProps {
    isOpen: boolean;
    onClose(): void;
}

export const LockedLectureModal = ({isOpen, onClose}: LockedLectureModalProps) => {
    const {gettext, interpolate} = useI18n();
    const {getOrgNumericSiteStat} = useSiteStats();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            renderTitle={() => ['locked-lecture-modal-title', null]}
            title=""
            className="udlite-in-udheavy"
        >
            <div className={styles['content']}>
                <div className={styles['icon-container']}>
                    <PlayIcon label={false} color="neutral" className={styles['play-icon']} />
                    <div className={styles['number-badge']}>{0}</div>
                </div>
                <h2
                    id="locked-lecture-modal-title"
                    className={classNames('ud-heading-xxl', styles['title'])}
                >
                    {gettext("You've watched all your free videos")}
                </h2>
                <div className={styles['subtitle']}>
                    {interpolate(
                        gettext(
                            'Browse and explore over %(count)s top rated courses curated from Udemy.com',
                        ),
                        {count: getOrgNumericSiteStat('num_courses').toLocaleString()},
                        true,
                    )}
                </div>
                <UnlockButton size="large" onClick={onClose} />
            </div>
        </Modal>
    );
};
