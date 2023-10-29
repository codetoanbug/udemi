import {Image} from '@udemy/react-core-components';
import {useUDData, useUDLink} from '@udemy/ud-data';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './image-banner.less';

const ImageBanner = ({sourceObjectId}) => {
    const {Config} = useUDData();
    const udLink = useUDLink();

    function getImageSrc(imgUrl) {
        return udLink.toStorageStaticAsset(`consumer-subscription/window-shopping/${imgUrl}`, {
            Config,
        });
    }
    const mobileImageSrc = getImageSrc(`mobile/${sourceObjectId}.png`);
    const desktopImageSrc = getImageSrc(`desktop/${sourceObjectId}.jpg`);
    const desktopImageSrc2x = getImageSrc(`desktop/${sourceObjectId}-2x.jpg`);
    return (
        <div className={styles['image-container']}>
            <Image
                className={classNames(styles['banner-image'], styles['on-mobile'])}
                data-purpose="mobile-banner"
                width="unset"
                height="unset"
                src={mobileImageSrc}
                alt=""
            />
            <Image
                className={classNames(styles['banner-image'], styles['on-desktop'])}
                data-purpose="desktop-banner"
                width="unset"
                height="unset"
                src={desktopImageSrc}
                srcSet={`${desktopImageSrc} 1x, ${desktopImageSrc2x} 2x`}
                alt=""
            />
        </div>
    );
};

ImageBanner.propTypes = {
    sourceObjectId: PropTypes.number.isRequired,
};
export default ImageBanner;
