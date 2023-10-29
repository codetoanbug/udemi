import PropTypes from 'prop-types';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import './question.less';

const Question = ({question, children}) => {
    return (
        <div styleName="question">
            <div styleName="title" className="ud-text-bold">
                <RichTextViewer
                    styleName="title-text"
                    openBlankTarget={true}
                    unsafeHTML={question.body}
                />
            </div>
            <div styleName="answer">{children}</div>
        </div>
    );
};

Question.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Question;
