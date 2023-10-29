import {Button, Image} from '@udemy/react-core-components';
import {PlayOverlay} from '@udemy/react-structure-components';
import {tokens} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import CoursePreviewModal from '../course-preview/course-preview-modal.react-component';
import './intro-asset.less';

// Base 64 encoded 500x500 transparent placeholder image used for LCP optimization
const placeholderBase64500x500 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAABgmlDQ1BzUkdCIElFQzYxOTY2LTIuMQAAKJF1kc8rRFEUxz8zgxGjERaUxaRhhcYosVFGQk2axii/NjPP/FDzxuu9mSRbZTtFiY1fC/4CtspaKSIlO2VNbNBz3oyaSebczj2f+733nO49F+yRtKIaVT5QM1k9PB7wzM7Ne5zP1NBGE63YooqhjYRCQSraxx02K970WLUqn/vX6pfihgK2WuFhRdOzwhPCwdWsZvG2cIuSii4Jnwp363JB4VtLjxX5xeJkkb8s1iPhUbA3CnuSZRwrYyWlq8LycrxqOqf83sd6iSuemZmW2CHejkGYcQJ4mGSMUQboY0jmAXrw0ysrKuT7CvlTrEiuIrPGGjrLJEmRpVvUnFSPS0yIHpeRZs3q/9++Gol+f7G6KwDVT6b51gnOLfjOm+bnoWl+H4HjES4ypfyVAxh8Fz1f0rz74N6As8uSFtuB801ofdCierQgOcTtiQS8nkDDHDRfQ91CsWe/+xzfQ2RdvuoKdvegS867F38AGNNnwvJxPYUAAAAJcEhZcwAACxMAAAsTAQCanBgAAALtSURBVHic7cEBAQAAAIIg/69uSEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Bh0SQABe+rNwwAAAABJRU5ErkJggg==';
// Estimated displayed introduction asset image sizes, so the browser will load the correct image from the source set.
// Defined in sidebar as 24rem
const ASSET_IMAGE_SIZE_DESKTOP = '240px';
// Max container width (60rem)
const ASSET_IMAGE_SIZE_TABLET = '600px';
// Mobile extends across entire viewport
const ASSET_IMAGE_SIZE_MOBILE = '100vw';
export const AssetImage = ({images, sizes}) => (
    <Image
        src={images.image_240x135}
        srcSet={`${images.image_240x135} 240w, ${images.image_480x270} 480w, ${images.image_750x422} 750w`}
        alt=""
        lazy={false}
        style={{
            backgroundSize: 'cover',
            backgroundImage: `url("${placeholderBase64500x500}")`,
        }}
        sizes={sizes}
        width={240}
        height={135}
    />
);

AssetImage.propTypes = {
    images: PropTypes.object.isRequired,
    sizes: PropTypes.string,
};

AssetImage.defaultProps = {
    // Paid CLP has its own lg-min breakpoint, ~1080px
    sizes: `(min-width: 1080px) ${ASSET_IMAGE_SIZE_DESKTOP},
                (min-width: ${tokens['breakpoint-md-min']}) ${ASSET_IMAGE_SIZE_TABLET},
                ${ASSET_IMAGE_SIZE_MOBILE}`,
};

@isomorphic
@observer
export default class IntroductionAsset extends React.Component {
    static propTypes = {
        course_preview_path: PropTypes.string.isRequired,
        has_video_asset: PropTypes.bool.isRequired,
        images: PropTypes.shape({
            image_240x135: PropTypes.string.isRequired,
            image_480x270: PropTypes.string.isRequired,
            image_750x422: PropTypes.string.isRequired,
        }).isRequired,
        imageSizes: PropTypes.string,
    };

    static defaultProps = {
        imageSizes: undefined,
    };

    @observable isPreviewModalOpen = false;

    @autobind
    @action
    showPreviewModal() {
        this.isPreviewModalOpen = true;
    }

    @autobind
    @action
    hidePreviewModal() {
        this.isPreviewModalOpen = false;
    }

    render() {
        return (
            <>
                <div styleName="wrapper">
                    <div styleName="asset" data-purpose="introduction-asset">
                        {this.props.has_video_asset && (
                            <Button
                                className="ud-custom-focus-visible"
                                styleName="placeholder"
                                onClick={this.showPreviewModal}
                                udStyle="ghost"
                                aria-label={gettext('Play course preview')}
                            >
                                <span styleName="img-aspect">
                                    <AssetImage
                                        images={this.props.images}
                                        sizes={this.props.imageSizes}
                                    />
                                </span>
                                <span styleName="overlay gradient" />
                                <PlayOverlay size="xxlarge" />
                                <span className="ud-heading-md" styleName="overlay text">
                                    {gettext('Preview this course')}
                                </span>
                            </Button>
                        )}
                        {!this.props.has_video_asset && (
                            <div styleName="img-aspect">
                                <AssetImage
                                    images={this.props.images}
                                    sizes={this.props.imageSizes}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <CoursePreviewModal
                    url={this.props.course_preview_path}
                    isOpen={this.isPreviewModalOpen}
                    onClose={this.hidePreviewModal}
                />
            </>
        );
    }
}
