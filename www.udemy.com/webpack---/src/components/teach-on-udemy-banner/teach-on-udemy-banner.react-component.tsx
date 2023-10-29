import classNames from 'classnames';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import styles from './teach-on-udemy-banner.module.less';

export const TeachOnUdemyBanner = () => {
    const {gettext} = useI18n();

    return (
        <div
            className={classNames('footer-section', styles['banner'])}
            data-testid="teach-on-udemy-banner"
        >
            <div>
                <div className="ud-heading-lg">{gettext('Teach the world online')}</div>
                <div className={classNames('ud-text-md', styles['subtitle'])}>
                    {gettext(
                        'Create an online video course, reach students across the globe, and earn money',
                    )}
                </div>
            </div>
            <div className={styles['button-container']}>
                <Button
                    componentClass="a"
                    href="/teaching/?ref=bai-sub-footer"
                    udStyle="white-outline"
                >
                    {gettext('Teach on Udemy')}
                </Button>
            </div>
        </div>
    );
};
