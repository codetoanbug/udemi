import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {OPEN_BADGES_BASE_PATH} from '../constants';
import styles from './certifications-preparation.less';

export const EmptyState = () => {
    const {gettext} = useI18n();
    const disableRouter = !location.pathname.includes(OPEN_BADGES_BASE_PATH);
    return (
        <>
            <h2 className={classNames('ud-heading-lg', styles['preparation-title'])}>
                {gettext('Start learning towards your certification goals.')}
            </h2>
            <p className={classNames('ud-text-md', styles['preparation-description'])}>
                {gettext(
                    'When you enroll in content relating to certification preparation it will appear here.',
                )}
            </p>
            <p className={classNames('ud-text-md', styles['preparation-description'])}>
                <LocalizedHtml
                    html={gettext(
                        "<a class='link'>Find content</a> on Udemy that supports your preparation.",
                    )}
                    interpolate={{
                        link: (
                            <Link
                                disableRouter={disableRouter}
                                to={OPEN_BADGES_BASE_PATH}
                                className={styles['certification-links']}
                            />
                        ),
                    }}
                />
            </p>
        </>
    );
};
