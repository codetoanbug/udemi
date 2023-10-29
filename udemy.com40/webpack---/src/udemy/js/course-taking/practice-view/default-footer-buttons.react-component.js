import PropTypes from 'prop-types';
import React from 'react';

import {PAGE_TO_STATE_MAP, SUMMARY_PAGE_URI} from './constants';
import FooterButton from './footer-button.react-component';

export const DefaultLeftButtons = ({hasCompletedPractice, currentAction, showShortenedText}) => {
    if (!hasCompletedPractice || currentAction === PAGE_TO_STATE_MAP.summary) {
        return null;
    }
    return (
        <FooterButton url={SUMMARY_PAGE_URI} udStyle="secondary">
            {showShortenedText ? gettext('Summary') : gettext('Go to summary')}
        </FooterButton>
    );
};

DefaultLeftButtons.propTypes = {
    hasCompletedPractice: PropTypes.bool.isRequired,
    currentAction: PropTypes.string.isRequired,
    showShortenedText: PropTypes.bool,
};

DefaultLeftButtons.defaultProps = {
    showShortenedText: false,
};

export const DefaultRightButtons = ({nextUrl, prevUrl}) => (
    <>
        {prevUrl && (
            <FooterButton url={prevUrl} className="ud-link-neutral" udStyle="ghost">
                {gettext('Previous')}
            </FooterButton>
        )}
        {nextUrl && <FooterButton url={nextUrl}>{gettext('Next')}</FooterButton>}
    </>
);

DefaultRightButtons.propTypes = {
    nextUrl: PropTypes.string,
    prevUrl: PropTypes.string,
};

DefaultRightButtons.defaultProps = {
    nextUrl: null,
    prevUrl: null,
};
