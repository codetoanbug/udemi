import {Keys} from '@udemy/design-system-utils';
import CollapseDiagonalIcon from '@udemy/icons/dist/collapse-diagonal.ud-icon';
import ExpandDiagonalIcon from '@udemy/icons/dist/expand-diagonal.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Image, Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from 'utils/noop';

import wrappedAssetComponent from '../asset.react-component';
import PresentationAssetModel from './presentation-asset.mobx-model';
import PresentationAssetStore from './presentation-asset.mobx-store';

import './presentation-asset.less';

const PresentationAssetFooter = ({className, left, right, ...props}) => (
    <div
        className={className}
        data-purpose="presentation-footer"
        styleName="absolute flex-align-center controls"
        {...props}
    >
        <div styleName="flex-align-center controls-left">{left}</div>
        <div styleName="flex-align-center controls-right">{right}</div>
    </div>
);

PresentationAssetFooter.propTypes = {
    left: PropTypes.node.isRequired,
    right: PropTypes.node.isRequired,
    className: PropTypes.string,
};

PresentationAssetFooter.defaultProps = {
    className: null,
};

@inject('store')
@observer
class PresentationAssetSuccessState extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onSlideChange: PropTypes.func,
        onStart: PropTypes.func,
        onComplete: PropTypes.func,
        renderFooter: PropTypes.func,
    };

    static defaultProps = {
        onSlideChange: noop,
        onStart: noop,
        onComplete: noop,
        renderFooter: (Component, props) => <Component {...props} />,
    };

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.store = new PresentationAssetStore(
            props.store.asset.slideUrls,
            props.onSlideChange,
            props.onStart,
            props.onComplete,
        );
    }

    componentDidMount() {
        this.store.onSlideChange();
        // Force element focus so hotkeys work immediately.
        this.ref.current.focus();
    }

    @autobind
    onSkipToProgressUnit(event) {
        const progressUnitIndex = parseInt(event.currentTarget.dataset.index, 10);
        this.store.skipTo(progressUnitIndex + 1);
    }

    get slideImages() {
        return this.props.store.asset.slideUrls.map((slideUrl, idx) => {
            const classes = classNames('absolute slide slide-center', {
                'slide-left': idx + 1 < this.store.currentSlideNum,
                'slide-right': idx + 1 > this.store.currentSlideNum,
            });
            return (
                <div key={idx} styleName={classes} data-purpose="slide-image-container">
                    <Image src={slideUrl} alt={gettext('Slide')} width={720} height={540} />
                </div>
            );
        });
    }

    get slideLinks() {
        return this.store.progressUnitWidths.map((progressUnitWidth, i) => (
            <Button
                key={i}
                udStyle="link"
                styleName="progress-unit"
                style={{width: progressUnitWidth}}
                data-index={i}
                onClick={this.onSkipToProgressUnit}
                aria-label={interpolate(gettext('Slide %(slideNum)s'), {slideNum: i + 1}, true)}
                data-purpose="slide-link"
            />
        ));
    }

    get currentSlideText() {
        return interpolate(
            gettext('%(currentSlideNum)s of %(totalSlides)s Slides'),
            {currentSlideNum: this.store.currentSlideNum, totalSlides: this.store.numSlides},
            true,
        );
    }

    get navigationControls() {
        return (
            <>
                <IconButton
                    size="small"
                    udStyle="brand"
                    round={true}
                    onClick={this.store.goToPrev}
                    disabled={this.store.isPrevDisabled}
                    data-purpose="previous-slide"
                >
                    <PreviousIcon label={gettext('Previous')} size="medium" />
                </IconButton>
                <IconButton
                    size="small"
                    udStyle="brand"
                    round={true}
                    onClick={this.store.goToNext}
                    disabled={this.store.isNextDisabled}
                    data-purpose="next-slide"
                >
                    <NextIcon label={gettext('Next')} size="medium" />
                </IconButton>
                <span styleName="slide-counter-display" data-purpose="slide-text">
                    {this.currentSlideText}
                </span>
            </>
        );
    }

    get rightControls() {
        const label = this.store.isFullscreen ? gettext('Exit fullscreen') : gettext('Fullscreen');
        const Icon = this.store.isFullscreen ? CollapseDiagonalIcon : ExpandDiagonalIcon;
        return (
            <IconButton
                size="small"
                className="ud-link-neutral"
                udStyle="ghost"
                onClick={this.toggleFullscreen}
                data-purpose="fullscreen-toggle-button"
            >
                <Icon label={label} size="medium" />
            </IconButton>
        );
    }

    @autobind
    onKeyDown(event) {
        if (event.keyCode === 70 /* F */) {
            this.toggleFullscreen();
        } else if (event.keyCode === Keys.LEFT) {
            event.preventDefault();
            this.store.goToPrev();
        } else if (event.keyCode === Keys.RIGHT) {
            event.preventDefault();
            this.store.goToNext();
        }
    }

    @autobind
    toggleFullscreen() {
        this.store.toggleFullscreen(this.ref.current);
    }

    render() {
        return (
            <div
                className="udlite-in-udheavy"
                styleName="relative container"
                onKeyDown={this.onKeyDown}
                tabIndex="0"
                ref={this.ref}
            >
                <div styleName="relative">{this.slideImages}</div>
                <div styleName="absolute progress-bar">
                    <div styleName="absolute inner-bar inner-bar-full" />
                    <div
                        styleName="absolute inner-bar inner-bar-progress"
                        style={{width: this.store.currentProgressWidth}}
                    />
                    <div styleName="absolute">{this.slideLinks}</div>
                </div>
                {this.props.renderFooter(PresentationAssetFooter, {
                    left: this.navigationControls,
                    right: this.rightControls,
                })}
            </div>
        );
    }
}

export default wrappedAssetComponent(
    'PresentationAsset',
    PresentationAssetSuccessState,
    PresentationAssetModel,
);
