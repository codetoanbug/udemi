import {useI18n} from '@udemy/i18n';
import React from 'react';

import styles from './certifications-page.less';

export const NoResultsFound = () => {
    const {gettext} = useI18n();
    return (
        <div className={styles['no-results-found-container']}>
            <h3 className="ud-heading-lg">
                {gettext('Sorry, we couldn’t find any certifications')}
            </h3>
            <div className={styles['no-results-intro']}>
                {gettext('Try adjusting your search. Here are some ideas:')}
            </div>
            <ul>
                <li>{gettext('Make sure all words are spelled correctly')}</li>
                <li>{gettext('Try different search terms')}</li>
                <li>{gettext('Remove search filters')}</li>
            </ul>
        </div>
    );
};
