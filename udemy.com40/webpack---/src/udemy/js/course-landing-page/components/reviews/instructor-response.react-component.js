import {Avatar} from '@udemy/react-core-components';
import {ShowMore} from '@udemy/react-reveal-components';
import PropTypes from 'prop-types';
import React from 'react';

import './instructor-response.less';

const InstructorResponse = ({user, content, renderContent, formatedTimestampSince}) => {
    if (!user || !content) {
        return null;
    }
    return (
        <div className="ud-text-sm" styleName="response">
            <div styleName="author">
                <Avatar
                    data-purpose="avatar"
                    user={user}
                    srcKey="image_50x50"
                    size="medium"
                    alt="NONE"
                />
                <div styleName="author-content">
                    <p className="ud-heading-md" styleName="name" data-purpose="instructor-name">
                        {user.display_name}
                    </p>
                    <p className="ud-text-sm" styleName="author-description">
                        <span>{gettext('Instructor response')}</span>
                        {formatedTimestampSince && (
                            <>
                                <span styleName="dot">{' • '}</span>
                                <span data-purpose="formatted-timestamp-since">
                                    {formatedTimestampSince}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>

            <ShowMore collapsedHeight={100} withGradient={true} styleName="body">
                <div styleName="comment" data-purpose="content">
                    {renderContent(content)}
                </div>
            </ShowMore>
        </div>
    );
};

InstructorResponse.propTypes = {
    content: PropTypes.string,
    renderContent: PropTypes.func.isRequired,
    user: PropTypes.object,
    formatedTimestampSince: PropTypes.string,
};

InstructorResponse.defaultProps = {
    content: null,
    user: null,
    formatedTimestampSince: null,
};

export default InstructorResponse;
