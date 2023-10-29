import {LocalizedHtml} from '@udemy/i18n';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import PropTypes from 'prop-types';
import React from 'react';

import './course-content-length.less';

const CourseContentLength = ({contentLengthVideo}) => {
    if (!contentLengthVideo) {
        return null;
    }
    return (
        <div styleName="course-content-length">
            <VideoIcon label={false} styleName="video-icon" />
            <LocalizedHtml
                html={interpolate(
                    gettext('<span class="duration">%{duration}s</span> of on-demand video'),
                    true,
                )}
                interpolate={{
                    duration: (
                        <Duration
                            presentationStyle={Duration.STYLE.HUMAN}
                            numSeconds={contentLengthVideo}
                        />
                    ),
                }}
            />
        </div>
    );
};

CourseContentLength.propTypes = {
    contentLengthVideo: PropTypes.number.isRequired,
};
export default CourseContentLength;
