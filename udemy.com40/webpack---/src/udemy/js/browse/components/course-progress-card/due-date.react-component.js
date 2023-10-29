import {useI18n} from '@udemy/i18n';
import AlarmIcon from '@udemy/icons/dist/alarm.ud-icon';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './due-date.less';

const DueDate = ({dueDate}) => {
    const {gettext, interpolate, locale} = useI18n();
    const userLocale = locale ? locale.replace('_', '-') : 'en-US';
    const date = new Date(dueDate).toLocaleDateString(userLocale, {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
        timeZone: 'UTC',
    });
    return (
        <div className={styles['due-date-wrapper']}>
            <AlarmIcon size="xsmall" className={styles['assignment-icon']} label={false} />
            <span
                data-purpose="due-date"
                className={classNames('ud-text-xs', styles['due-date-text'])}
            >
                {interpolate(gettext('Due %(dueDateText)s'), {dueDateText: date}, true)}
            </span>
        </div>
    );
};

DueDate.propTypes = {
    dueDate: PropTypes.string.isRequired,
};

export default DueDate;
