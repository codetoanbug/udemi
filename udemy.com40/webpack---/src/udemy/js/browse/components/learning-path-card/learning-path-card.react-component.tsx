import {useMatchMedia} from '@udemy/hooks';
import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {ExpressiveIcon} from '@udemy/icons-expressive';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import {udLink} from '@udemy/ud-data';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useRef} from 'react';

import {UDEMY_PRO_LEARNING_PATH} from 'learning-path/constants';
import LearningPath from 'learning-path/learning-path.mobx-model';
import createUFBContextMenu from 'organization-common/resource-context-menu/create-ufb-context-menu';

import styles from './learning-path-card.less';

interface LearningPathCardProps {
    learningPath: LearningPath;
}

export const LearningPathCard = observer(({learningPath}: LearningPathCardProps) => {
    const popoverRef = useRef(null);

    const handleClick = (event: React.MouseEvent) => {
        // @ts-expect-error initial value is null before the first render
        if (popoverRef?.current?.contains(event.target)) {
            event.preventDefault();
        }
    };

    if (!learningPath) {
        return null;
    }

    const {gettext, ninterpolate} = useI18n();
    const curated = (
        <>
            <LocalizedHtml
                html={gettext(
                    'Curated by <span class="udemyBusinessPro">Udemy Business Pro</span>',
                )}
                interpolate={{
                    udemyBusinessPro: <span className="ud-text-bold" />,
                }}
            />
        </>
    );
    const enrolledText = {label: gettext('Enrolled')};
    const resourceContextMenu = createUFBContextMenu();
    const learningPathUrl = udLink.toLearningPath(learningPath.id);
    const isHeaderMobileMax = useMatchMedia('header-mobile-max');
    const contextMenu = resourceContextMenu.getLearningPathContextMenu(learningPath);

    return (
        <a className={styles.container} href={learningPathUrl} onClick={handleClick}>
            <div className={styles['icon-container']}>
                <div className={styles.icon}>
                    <ExpressiveIcon
                        name={'learning-guide'}
                        size={isHeaderMobileMax ? 'large' : 'xlarge'}
                    />
                </div>
            </div>
            <div className={styles['title-description-container']}>
                <div className={classNames(styles['path-detail-container'], 'ud-text-xs')}>
                    <span
                        className={classNames({
                            [styles.item]:
                                learningPath.totalDuration || learningPath.numberOfEnrollments,
                        })}
                    >
                        {UDEMY_PRO_LEARNING_PATH.TEXT}
                    </span>
                    {!learningPath.isCurriculumLoading && (
                        <>
                            {learningPath.totalDuration > 0 && (
                                <span
                                    className={classNames({
                                        [styles.item]: learningPath.numberOfEnrollments,
                                    })}
                                >
                                    <Duration numSeconds={learningPath.totalDuration * 60} />
                                </span>
                            )}
                            {learningPath.numberOfEnrollments && (
                                <span>
                                    {ninterpolate(
                                        '%s enrollment',
                                        '%s enrollments',
                                        learningPath.numberOfEnrollments,
                                    )}
                                </span>
                            )}
                        </>
                    )}
                </div>
                <div
                    className={styles.title}
                    data-purpose="path-title"
                    aria-label={learningPath.title}
                >
                    {learningPath.title}
                </div>
                <div
                    className={styles.description}
                    data-purpose="path-description"
                    aria-label={learningPath.description}
                >
                    {learningPath.description}
                </div>
                <div className={styles['curated-text-container']} data-purpose="curated-by">
                    {curated}
                </div>
            </div>
            <div className={styles['context-options-container']}>
                <div className={styles['enrolled-context-menu-container']}>
                    {learningPath.isUserEnrolled && (
                        <span className={classNames(styles['enrolled-text'], 'ud-heading-sm')}>
                            <TickIcon color="inherit" size="xsmall" label={false} />
                            {enrolledText.label}
                        </span>
                    )}
                    <div
                        ref={popoverRef}
                        className={classNames(styles['context-options'], {
                            [styles['context-options-enrolled']]: learningPath.isUserEnrolled,
                        })}
                    >
                        {contextMenu}
                    </div>
                </div>
            </div>
        </a>
    );
});
