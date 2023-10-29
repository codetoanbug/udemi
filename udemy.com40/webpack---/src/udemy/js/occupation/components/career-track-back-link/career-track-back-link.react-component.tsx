import {useI18n} from '@udemy/i18n';
import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import {Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';
import {useHistory} from 'react-router-dom';

interface CareerTrackBackLinkProps {
    className: string;
    window: any;
}
export function CareerTrackBackLink(props: CareerTrackBackLinkProps) {
    const history = useHistory();
    const {gettext} = useI18n();

    const handleBackClick = () => {
        if (history.length > 1) {
            history.goBack();
        } else {
            props.window.location.assign(document.referrer);
        }
    };

    return (
        <Button
            udStyle="link"
            onClick={handleBackClick}
            className={props.className}
            data-purpose="career-track-back-link"
        >
            <ArrowLeftIcon label={false} />
            {gettext('Back to Career Guide')}
        </Button>
    );
}

CareerTrackBackLink.propTypes = {
    className: PropTypes.string,
    window: PropTypes.object.isRequired,
};
CareerTrackBackLink.defaultProps = {
    className: '',
};
