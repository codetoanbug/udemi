import PropTypes from 'prop-types';
import React from 'react';

import {SOURCE_PAGES} from 'share/constants';
import MarketplaceSocialShareButton from 'share/marketplace-social-share-button.react-component';

const PurchaseSectionSocialShare = ({course, className, buttonStyle, isIconVisible, fullWidth}) => {
    const shareLazyLoad = React.useCallback(() => {
        return import(
            /* webpackChunkName: "marketplace-social-share" */ 'share/marketplace-social-share-lazily-loaded'
        );
    }, []);

    // Course object is optional up to this point but necessary to continue
    if (!course) {
        return null;
    }

    return (
        <MarketplaceSocialShareButton
            shareableObject={course}
            sourceUrl={course.url}
            load={shareLazyLoad}
            context={SOURCE_PAGES.CLP}
            isIconVisible={isIconVisible}
            buttonStyle={buttonStyle}
            className={className}
            fullWidth={fullWidth}
        />
    );
};

PurchaseSectionSocialShare.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
    buttonStyle: PropTypes.string,
    isIconVisible: PropTypes.bool,
    fullVisible: PropTypes.bool,
    fullWidth: PropTypes.bool,
};

PurchaseSectionSocialShare.defaultProps = {
    course: null,
    className: undefined,
    buttonStyle: undefined,
    isIconVisible: true,
    fullVisible: true,
    fullWidth: true,
};

export default PurchaseSectionSocialShare;
