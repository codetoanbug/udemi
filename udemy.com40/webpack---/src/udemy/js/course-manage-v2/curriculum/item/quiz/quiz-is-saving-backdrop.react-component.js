import PropTypes from 'prop-types';
import React from 'react';

import './quiz-is-saving-backdrop.less';

const QuizIsSavingBackdrop = ({className}) => {
    return <div className={className} styleName="quiz-is-saving-backdrop" />;
};

QuizIsSavingBackdrop.propTypes = {
    className: PropTypes.string,
};

QuizIsSavingBackdrop.defaultProps = {
    className: '',
};

export default QuizIsSavingBackdrop;
