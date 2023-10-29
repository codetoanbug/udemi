import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './search-and-error-states.less';

export const SearchState = () => (
    <div styleName="search-state" data-purpose="search-state">
        <MainContentLoader />
        <p>{gettext('Loading your data, please wait...')}</p>
    </div>
);

export const ErrorState = ({text}) => (
    <h3 styleName="error-state" data-purpose="error-state">
        <ErrorIcon label={false} color="warning" styleName="error-icon" />
        {text || gettext('An error occurred. Please try again.')}
    </h3>
);

export const NoPermissionInstructor = ({
    noPermissionCourses,
    missingPermissionMessage,
    ...props
}) => {
    const [isCourseListExpanded, setIsCourseListExpanded] = React.useState(false);
    const toggleIsCourseListExpanded = () => setIsCourseListExpanded(!isCourseListExpanded);
    const collapsedCourseCount = 3;
    const displayedCourses = isCourseListExpanded
        ? noPermissionCourses
        : noPermissionCourses.slice(0, collapsedCourseCount);
    const ToggleIcon = isCourseListExpanded ? CollapseIcon : ExpandIcon;
    return (
        <AlertBanner
            udStyle="warning"
            styleName="alert-banner"
            body={
                <>
                    <ul>
                        {displayedCourses.map((course) => (
                            <li key={course.id}>{course.title}</li>
                        ))}
                    </ul>
                    {noPermissionCourses.length > collapsedCourseCount && (
                        <Button udStyle="ghost" size="medium" onClick={toggleIsCourseListExpanded}>
                            {isCourseListExpanded ? gettext('Show less') : gettext('Show more')}
                            <ToggleIcon label={false} />
                        </Button>
                    )}
                    <p>{missingPermissionMessage}</p>
                </>
            }
            showCta={false}
            data-purpose="no-permission-instructor"
            {...props}
        />
    );
};

export const NoPermissionCourse = ({missingPermissionMessage, ...props}) => (
    <AlertBanner
        udStyle="warning"
        styleName="alert-banner"
        body={missingPermissionMessage}
        showCta={false}
        data-purpose="no-permission-course"
        {...props}
    />
);

ErrorState.propTypes = {
    text: PropTypes.string,
};

ErrorState.defaultProps = {
    text: null,
};

NoPermissionInstructor.propTypes = {
    noPermissionCourses: mobxTypes.arrayOrObservableArray.isRequired,
    missingPermissionMessage: PropTypes.string.isRequired,
};

NoPermissionCourse.propTypes = {
    missingPermissionMessage: PropTypes.string.isRequired,
};
