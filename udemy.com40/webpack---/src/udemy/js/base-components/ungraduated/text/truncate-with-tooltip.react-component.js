import {Tooltip} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './truncate-with-tooltip.less';

@observer
export class Truncate extends React.Component {
    static propTypes = {
        onTruncate: PropTypes.func.isRequired,
        lines: PropTypes.number,
        componentClass: PropTypes.elementType,
    };

    static defaultProps = {
        lines: 2,
        componentClass: 'span',
    };

    componentDidMount() {
        this.truncate();
        if (window.ResizeObserver) {
            this.ro = new ResizeObserver(this.onResize);
            this.ro.observe(this.contentRef.current);
        }
    }

    componentWillUnmount() {
        this.ro && this.ro.disconnect();
    }

    contentRef = React.createRef();
    contentWidth = 0;

    @autobind onResize(entries) {
        const width = Math.round(entries[0].contentRect.width);
        if (width !== this.contentWidth) {
            this.contentWidth = width;
            this.truncate();
        }
    }

    @autobind @action truncate() {
        const contentNode = this.contentRef.current;
        const isTruncated = !!contentNode && contentNode.scrollHeight > contentNode.offsetHeight;
        this.props.onTruncate(isTruncated);
    }

    render() {
        const {componentClass: TruncateComponent, lines, onTruncate, ...props} = this.props;
        return (
            <TruncateComponent
                {...props}
                className={props.className}
                styleName="ellipsis"
                style={{...props.style, WebkitLineClamp: lines}}
                ref={this.contentRef}
            />
        );
    }
}

@observer
export default class TruncateWithTooltip extends React.Component {
    static propTypes = {
        truncateProps: PropTypes.object,
    };

    static defaultProps = {
        truncateProps: {},
    };

    @observable isTruncated = false;

    @autobind @action onTruncate(isTruncated) {
        this.isTruncated = isTruncated;
    }

    render() {
        const {truncateProps, ...props} = this.props;
        const body = (
            <Truncate {...truncateProps} onTruncate={this.onTruncate}>
                {props.trigger || props.children}
            </Truncate>
        );
        return this.isTruncated ? <Tooltip {...props} trigger={body} /> : body;
    }
}
