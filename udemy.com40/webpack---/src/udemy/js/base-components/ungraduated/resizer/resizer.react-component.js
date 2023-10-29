/**
 * Adapted from https://codepen.io/zz85/pen/gbOoVP
 * This is a lightweight component that enables the user to resize a DOM element by
 * dragging its edges.
 * We can replace this if we can find a small, well-maintained library.
 * E.g. http://interactjs.io/ is not ideal because although it is well-maintained,
 * it is not small (23kb gz).
 */
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

// https://github.com/component/matches-selector/blob/master/index.js
// https://davidwalsh.name/element-matches-selector
const elementPrototype = (Element && Element.prototype) || {};
const selectorMatches =
    elementPrototype.matches ||
    elementPrototype.webkitMatchesSelector ||
    elementPrototype.mozMatchesSelector ||
    elementPrototype.msMatchesSelector ||
    ((selector) => [].indexOf.call(document.querySelectorAll(selector), this) !== -1);

export default class Resizer extends Component {
    static propTypes = {
        edges: PropTypes.shape({
            top: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            left: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            right: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        }),
        onStart: PropTypes.func,
        onMove: PropTypes.func.isRequired,
        onEnd: PropTypes.func,
        dragMargin: PropTypes.number, // How close you need to be to an edge in order to drag it.
    };

    static defaultProps = {
        edges: {top: true, left: true, right: true, bottom: true},
        onStart: noop,
        onEnd: noop,
        dragMargin: isMobileBrowser ? 30 : 5,
    };

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
    }

    x = 0; // Mouse X position relative to this.ref.
    y = 0; // Mouse Y position relative to this.ref.
    width = 0; // Width of this.ref.
    height = 0; // Height of this.ref.
    edges = {
        onTop: false,
        onLeft: false,
        onRight: false,
        onBottom: false,
    };

    isResizing = false;

    get resizeData() {
        // Compute width and height of the resized rectangle.
        let width = this.width;
        let height = this.height;
        if (this.edges.onTop) {
            height = this.height - this.y;
        } else if (this.edges.onBottom) {
            height = this.y;
        }
        if (this.edges.onLeft) {
            width = this.width - this.x;
        } else if (this.edges.onRight) {
            width = this.x;
        }

        return {
            width,
            height,
            edges: this.edges,
            container: this.ref,
        };
    }

    isEdgeEnabled(edge, element) {
        const edgeValue = this.props.edges[edge];
        if (typeof edgeValue === 'string') {
            return selectorMatches.call(element, edgeValue);
        }
        return edgeValue;
    }

    calculateDimensions(event) {
        const rect = this.ref.getBoundingClientRect();
        this.x = event.clientX - rect.left;
        this.y = event.clientY - rect.top;
        this.width = rect.width;
        this.height = rect.height;
    }

    setResizeCursor() {
        // The parent component should render a resize handle with the appropriate `cursor` style.
        // This method is only intended to preserve `cursor: resize` while dragging an edge, i.e.
        // the cursor is preserved even when the mouse is not over the resize handle.
        this.originalCursor = document.body.style.cursor;
        if (this.edges.onTop && this.edges.onLeft) {
            document.body.style.cursor = 'nwse-resize';
        } else if (this.edges.onTop && this.edges.onRight) {
            document.body.style.cursor = 'nesw-resize';
        } else if (this.edges.onTop) {
            document.body.style.cursor = 'ns-resize';
        } else if (this.edges.onLeft && this.edges.onBottom) {
            document.body.style.cursor = 'nesw-resize';
        } else if (this.edges.onLeft) {
            document.body.style.cursor = 'ew-resize';
        } else if (this.edges.onBottom && this.edges.onRight) {
            document.body.style.cursor = 'nwse-resize';
        } else if (this.edges.onBottom) {
            document.body.style.cursor = 'ns-resize';
        } else if (this.edges.onRight) {
            document.body.style.cursor = 'ew-resize';
        }
    }

    setOriginalCursor() {
        document.body.style.cursor = this.originalCursor || '';
    }

    onDown(event) {
        this.calculateDimensions(event);
        const margin = this.props.dragMargin;
        this.edges = {
            onTop: this.isEdgeEnabled('top', event.target) && this.y < margin,
            onLeft: this.isEdgeEnabled('left', event.target) && this.x < margin,
            onRight: this.isEdgeEnabled('right', event.target) && this.x >= this.width - margin,
            onBottom: this.isEdgeEnabled('bottom', event.target) && this.y >= this.height - margin,
        };
        this.setResizeCursor();
        this.isResizing =
            this.edges.onTop || this.edges.onLeft || this.edges.onRight || this.edges.onBottom;
        if (this.isResizing) {
            this.props.onStart(event, this.resizeData);
        }
    }

    @autobind
    onMouseDown(event) {
        event.preventDefault();
        this.onDown(event);
    }

    @autobind
    onTouchStart(event) {
        event.preventDefault();
        this.onDown(event.touches[0]);
    }

    onMove(event) {
        if (this.isResizing) {
            this.calculateDimensions(event);
            this.props.onMove(event, this.resizeData);
        }
    }

    @autobind
    onMouseMove(event) {
        this.onMove(event);
    }

    @autobind
    onTouchMove(event) {
        this.onMove(event.touches[0]);
    }

    onUp(event) {
        if (this.isResizing) {
            this.props.onEnd(event, this.resizeData);
        }
        this.setOriginalCursor();
        this.isResizing = false;
    }

    @autobind
    onMouseUp(event) {
        this.onUp(event);
    }

    @autobind
    onTouchEnd(event) {
        if (event.touches.length === 0) {
            this.onUp(event.changedTouches[0]);
        }
    }

    @autobind
    setRef(ref) {
        this.ref = ref;
    }

    render() {
        const {edges, onStart, onMove, onEnd, dragMargin, ...props} = this.props;
        return (
            <div
                {...props}
                ref={this.setRef}
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onTouchStart}
            />
        );
    }
}
