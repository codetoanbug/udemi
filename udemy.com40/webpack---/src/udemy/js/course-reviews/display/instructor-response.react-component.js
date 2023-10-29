import {ShowMore} from '@udemy/react-reveal-components';
import PropTypes from 'prop-types';
import React from 'react';

import './instructor-response.less';

const InstructorResponse = ({response, renderContent}) => {
    if (!response) {
        return null;
    }
    return (
        <div className="ud-text-sm" styleName="container">
            <div styleName="arrow" />

            <div styleName="ellipsis" data-purpose="review-response-instructor-name">
                {interpolate(
                    gettext('%(instructor_name)s (Instructor)'),
                    {
                        instructor_name: response.user.display_name,
                    },
                    true,
                )}
            </div>

            <div styleName="comment-content">
                <ShowMore collapsedHeight={200} withGradient={true}>
                    <div data-purpose="review-response-content">
                        {renderContent(response.content)}
                    </div>
                </ShowMore>
            </div>
        </div>
    );
};

InstructorResponse.propTypes = {
    response: PropTypes.object,
    renderContent: PropTypes.func.isRequired,
};

InstructorResponse.defaultProps = {
    response: null,
};

export default InstructorResponse;
