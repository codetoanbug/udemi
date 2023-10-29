import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';

import './course-preview-modal.less';

/* istanbul ignore next */
const preloadPreviewApps = (isLecturePopup) => {
    if (isLecturePopup) {
        return import(
            /* webpackChunkName: "lecture-preview-udlite-app" */ 'lecture-preview/udlite-app'
        );
    }
    return import(/* webpackChunkName: "course-preview-udlite-app" */ 'course-preview/udlite-app');
};

const CoursePreviewModal = ({isLecturePopup, ...restOfProps}) => (
    <AjaxModal
        {...restOfProps}
        labelledById="course-preview-title"
        preloader={() => preloadPreviewApps(isLecturePopup)}
        styleName={classNames('course-preview modal', {'dark-mode': !isLecturePopup})}
    />
);

CoursePreviewModal.propTypes = {
    isLecturePopup: PropTypes.bool,
};

CoursePreviewModal.defaultProps = {
    isLecturePopup: false,
};

export default CoursePreviewModal;
