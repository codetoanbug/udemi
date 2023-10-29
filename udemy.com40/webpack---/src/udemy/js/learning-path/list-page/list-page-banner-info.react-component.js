import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import udLink from 'utils/ud-link';

import './list-page-banner-info.less';

@withMatchMedia({isLgMin: 'lg-min'})
export default class ListPageBannerInfo extends Component {
    static propTypes = {
        isLgMin: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
    };

    static defaultProps = {
        isLgMin: null,
    };

    render() {
        return (
            <div styleName="banner-container">
                <div className="ud-container" styleName="banner">
                    <div styleName="text">
                        <h1 className="ud-heading-serif-xxl" styleName="banner-title">
                            {gettext('Learning paths')}
                        </h1>
                        <p className="ud-text-lg">
                            {gettext(
                                'Share your knowledge by creating a path with a clear goal. Enroll yourself in a path that will help you reach your objectives and close knowledge gaps.',
                            )}
                        </p>
                    </div>
                    {this.props.isLgMin ? (
                        <Image
                            styleName="banner-image"
                            src={udLink.toStorageStaticAsset('learning-path/banner-desktop.jpg')}
                            srcSet={`${udLink.toStorageStaticAsset(
                                'learning-path/banner-desktop.jpg',
                            )} 1x, ${udLink.toStorageStaticAsset(
                                'learning-path/banner-desktop-2x.jpg',
                            )} 2x`}
                            alt=""
                            height={160}
                            width={400}
                        />
                    ) : (
                        <Image
                            styleName="banner-image"
                            src={udLink.toStorageStaticAsset('learning-path/banner-mobile.jpg')}
                            srcSet={`${udLink.toStorageStaticAsset(
                                'learning-path/banner-mobile.jpg',
                            )} 1x, ${udLink.toStorageStaticAsset(
                                'learning-path/banner-mobile-2x.jpg',
                            )} 2x`}
                            alt=""
                            height={288}
                            width={720}
                        />
                    )}
                </div>
            </div>
        );
    }
}
