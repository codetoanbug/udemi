import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './compact-quiz-container.less';

const CompactQuizContainer = ({children, responsiveFullscreen}) => {
    return (
        <div
            styleName={classNames({
                'compact-quiz-container': true,
                'responsive-fullscreen': responsiveFullscreen,
            })}
        >
            {children}
        </div>
    );
};

CompactQuizContainer.propTypes = {
    children: PropTypes.node.isRequired,
    responsiveFullscreen: PropTypes.bool,
};

CompactQuizContainer.defaultProps = {
    responsiveFullscreen: false,
};

export default CompactQuizContainer;
