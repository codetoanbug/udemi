import {useI18n} from '@udemy/i18n';
import UdemySelectIcon from '@udemy/icons/dist/udemy-select.ud-icon';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import React from 'react';

import styles from './select-badge.less';

interface SelectBadgeProps {
    onCardDetails?: boolean;
}

export const SelectBadge = ({onCardDetails = true}: SelectBadgeProps) => {
    const {gettext} = useI18n();
    const selectBadgeLabel = gettext('Select');
    return (
        <Badge
            data-purpose="select-badge"
            className={classNames(styles.badge, {
                [styles['on-card-image']]: !onCardDetails,
            })}
        >
            <div className={styles.container}>
                <UdemySelectIcon
                    label={false}
                    color="inherit"
                    size={onCardDetails ? 'xxsmall' : 'xsmall'}
                />
                {onCardDetails ? (
                    selectBadgeLabel
                ) : (
                    <span className="ud-heading-sm">{selectBadgeLabel}</span>
                )}
            </div>
        </Badge>
    );
};
