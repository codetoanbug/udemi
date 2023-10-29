import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import styles from './lecture-stack-recommendation-unit-header.less';
import {LectureStackRecommendationUnitHeaderProps} from './types';

export const LectureStackRecommendationUnitHeader = ({
    title,
    isStandaloneUnit,
}: LectureStackRecommendationUnitHeaderProps) => {
    const {gettext, interpolate} = useI18n();
    return (
        <h2
            className={classNames(
                isStandaloneUnit ? 'ud-heading-serif-xl' : 'ud-heading-xl',
                styles['representative-topic-name'],
            )}
        >
            {interpolate(gettext('Top lectures in %(title)s'), {title}, true)}
        </h2>
    );
};
