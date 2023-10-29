import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './instructor-content.less';

const InstructorContent = ({course}) => {
    const {gettext} = useI18n();
    const {request: udRequest} = useUDData();
    const date = new Date(course.last_update_date);
    const userLocale = udRequest ? udRequest.locale.replace('_', '-') : 'en-US';
    const lastUpdateDate = date.toLocaleDateString(userLocale, {
        month: 'long',
        year: 'numeric',
    });
    return (
        <div
            className={classNames('ud-text-xs', styles['course-published-time'])}
            data-purpose="course-published-time"
        >
            {gettext('Updated')} <strong>{lastUpdateDate}</strong>
        </div>
    );
};

InstructorContent.propTypes = {
    course: PropTypes.object.isRequired,
};

export default InstructorContent;
