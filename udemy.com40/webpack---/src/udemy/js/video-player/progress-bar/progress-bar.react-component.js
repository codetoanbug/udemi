/* istanbul ignore file */

import {onDecrement, onIncrement, onEnterAndSpace} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {when, reaction} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SneakPeek from '../sneak-peek/sneak-peek.react-component';
import LoadProgress from './load-progress.react-component';
import PlayProgress from './play-progress.react-component';

import './progress-bar.less';

@inject('progressBarStore')
@observer
export default class ProgressBar extends Component {
    static propTypes = {
        progressBarStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.progressBarTimeUpdateDisposer = reaction(
            () => this.props.progressBarStore.videoCurrentTime,
            () => {
                this.props.progressBarStore.setProgressBarTime(
                    this.props.progressBarStore.videoCurrentTime,
                    false,
                );
            },
            {fireImmediately: true},
        );

        when(
            () => this.props.progressBarStore.ref,
            () => {
                const progressRef = this.props.progressBarStore.ref;

                this.addBulkEvents([
                    {
                        on: ['touchmove', 'mousemove'],
                        run: this.moveListener,
                    },
                    {
                        on: 'click',
                        run: this.seekToCurrentMousePosition,
                    },
                    {
                        on: 'mousemove',
                        run: [this.whenIsDragging(this.seekToCurrentMousePosition)],
                    },
                    {
                        selector: window,
                        on: 'mousemove',
                        run: this.documentMove,
                    },
                    {
                        on: 'mousedown',
                        run: this.onDragStart,
                    },
                    {
                        selectors: [progressRef, window, document.body],
                        on: 'mouseup',
                        run: this.onDragEnd,
                    },
                    {
                        on: 'mouseenter',
                        run: this.onMouseEnter,
                    },
                    {
                        on: 'mouseleave',
                        run: this.whenIsNotDragging(() =>
                            this.props.progressBarStore.setHovering(false),
                        ),
                    },
                    {
                        selectors: [progressRef, window],
                        on: 'selectstart',
                        run: this.whenIsDragging(this.disableSelection),
                    },
                ]);
            },
            {fireImmediately: true},
        );
    }

    componentWillUnmount() {
        this.progressBarTimeUpdateDisposer();

        this.listenersDisposer();
    }

    listeners = [];

    addBulkEvents(eventsList) {
        eventsList.forEach(
            ({on, run, selectors = null, selector = this.props.progressBarStore.ref}) =>
                this.addListeners(on, run, selectors || selector),
        );
    }

    addListeners(on, run, selectors) {
        if (Array.isArray(selectors)) {
            selectors.forEach((selector) => this.addListeners(on, run, selector));
        } else if (Array.isArray(on)) {
            on.forEach((event) => this.addListeners(event, run, selectors));
        } else if (Array.isArray(run)) {
            run.forEach((action) => this.addListeners(on, action, selectors));
        } else {
            const selector = selectors;
            this.addListener(on, run, selector);
        }
    }

    addListener(on, run, selector) {
        if (!selector) {
            return false;
        }

        selector.addEventListener(on, run);
        this.listeners.push({on, run, selector});
    }

    listenersDisposer() {
        this.listeners.forEach(({on, run, selector}) => selector.removeEventListener(on, run));
    }

    @autobind
    seekToCurrentMousePosition() {
        this.props.progressBarStore.seekTo(this.props.progressBarStore.currentMouseTime);
    }

    @autobind
    onDragEnd(event) {
        if (this.isOutsideProgressBarEvent(event)) {
            this.props.progressBarStore.setHovering(false);
        }
        this.props.progressBarStore.setDragging(false);
    }

    @autobind
    onMouseEnter() {
        this.props.progressBarStore.setHovering(true);
    }

    @autobind
    documentMove(event) {
        if (this.props.progressBarStore.isDragging && this.isOutsideProgressBarEvent(event)) {
            this.moveListener(event);
            this.seekToCurrentMousePosition();
        }
    }

    @autobind
    isOutsideProgressBarEvent(event) {
        const path = event.path || event.composedPath();
        const eventHappensInDocument = path.includes(document);

        const eventContainsTrackedElement = path.includes(this.props.progressBarStore.ref);

        if (!eventHappensInDocument) {
            return false;
        }

        return !eventContainsTrackedElement;
    }

    @autobind
    whenIsDragging(callback) {
        return (event) => this.props.progressBarStore.isDragging && callback(event);
    }

    @autobind
    whenIsNotDragging(callback) {
        return () => !this.props.progressBarStore.isDragging && callback();
    }

    @autobind
    disableSelection(event) {
        event.preventDefault();
    }

    @autobind
    onDragStart() {
        this.props.progressBarStore.setDragging(true);
    }

    @autobind
    moveListener(event) {
        this.props.progressBarStore.setMoveEvent(event);
        const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;

        const pageX = event.changedTouches ? event.changedTouches[0].pageX : event.pageX;

        const left =
            (pageX ||
                event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft) -
            this.props.progressBarStore.ref.getBoundingClientRect().left +
            pageXOffset;

        const maxLeft =
            left > this.props.progressBarStore.ref.offsetWidth
                ? this.props.progressBarStore.ref.offsetWidth
                : left;

        const leftAcceptable = maxLeft < 0 ? 0 : maxLeft;

        this.props.progressBarStore.setCurrentMouseTime(
            Math.floor(
                (leftAcceptable / this.props.progressBarStore.ref.offsetWidth) *
                    this.props.progressBarStore.videoDuration,
            ),
        );
    }

    get styles() {
        return classNames({
            'progress-bar-control': true,
            hover: this.props.progressBarStore.isHovering,
        });
    }

    @autobind
    onKeyDown(event) {
        onDecrement(() => {
            event.preventDefault();
            this.props.progressBarStore.seekBack();
        })(event);
        onIncrement(() => {
            event.preventDefault();
            this.props.progressBarStore.seekForward();
        })(event);
        onEnterAndSpace(() => {
            event.preventDefault();
        })(event);
    }

    render() {
        return (
            <div ref={this.props.progressBarStore.setRef} styleName={this.styles}>
                <div
                    tabIndex="0"
                    styleName="slider"
                    role="slider"
                    data-purpose="video-progress-bar"
                    aria-label={gettext('Progress bar')}
                    aria-valuetext={this.props.progressBarStore.progressInfo}
                    aria-valuenow={this.props.progressBarStore.currentTimePercentValue}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    onKeyDown={this.onKeyDown}
                >
                    <div
                        ref={this.props.progressBarStore.setProgressHolderRef}
                        styleName="progress-holder"
                    >
                        <LoadProgress />
                        <PlayProgress />
                    </div>
                </div>
                <SneakPeek moveEvent={this.props.progressBarStore.moveEvent} />
            </div>
        );
    }
}
