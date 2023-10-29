import {Tracker} from '@udemy/event-tracking';
import {Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import {UFBNoticeClickEvent} from 'browse/events';
import getRequestData from 'utils/get-request-data';

import './primary-hook-button.less';

export default function PrimaryHookButton({link, placement, buttonText, fullWidth, size}) {
    const handleButtonClick = React.useCallback(() => {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale: getRequestData().locale,
                placement,
                url: link.split('?')[0],
            }),
        );
    }, [link, placement]);

    if (!buttonText) {
        buttonText = gettext('Contact sales');
    }

    return (
        <Button
            onClick={handleButtonClick}
            componentClass="a"
            styleName={`primary-hook ${fullWidth ? 'full-width' : ''}`}
            href={link}
            target="_blank"
            udStyle="brand"
            size={size}
        >
            {buttonText}
        </Button>
    );
}

PrimaryHookButton.propTypes = {
    link: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(['SliderMenu', 'PurchaseSection']).isRequired,
    buttonText: PropTypes.string,
    fullWidth: PropTypes.bool,
    size: PropTypes.oneOf(['medium', 'large']),
};

PrimaryHookButton.defaultProps = {
    buttonText: '',
    fullWidth: true,
    size: 'large',
};
