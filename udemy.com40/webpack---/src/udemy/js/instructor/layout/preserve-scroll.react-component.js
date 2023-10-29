import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Measure from 'react-measure';
import './preserve-scroll.less';

@observer
export default class PreserveScroll extends Component {
    static propTypes = {
        autoScrollToBottom: PropTypes.bool,
        contentId: PropTypes.number.isRequired,
    };

    static defaultProps = {
        autoScrollToBottom: false,
    };

    componentDidMount() {
        this.lastContentId = this.props.contentId;
        this.contentContainer.addEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate() {
        if (this.props.autoScrollToBottom) {
            this.scrollToBottom();
        } else if (this.lastContentId !== this.props.contentId) {
            this.lastContentId = this.props.contentId;
            this.lastScrollBottom = null;
            this.enableScrollListener = true;
            this.lastScrollHeight = null;
            this.scrollToTop();
        }
    }

    componentWillUnmount() {
        this.contentContainer.removeEventListener('scroll', this.handleScroll);
    }

    contentContainer;
    lastScrollBottom = null;
    enableScrollListener = true;
    lastScrollHeight = null;
    lastContentId = null;

    preserveScrollOnContainerHeightChange(scrollHeight, offsetHeight) {
        if (
            this.lastScrollBottom === 0 &&
            this.lastScrollHeight &&
            this.lastScrollHeight !== scrollHeight
        ) {
            this.contentContainer.scrollTop = scrollHeight - offsetHeight - this.lastScrollBottom;
        }
        this.lastScrollHeight = scrollHeight;
    }

    @autobind
    scrollToBottom() {
        if (this.contentContainer) {
            const {offsetHeight, scrollHeight} = this.contentContainer;
            this.contentContainer.scrollTop = this.lastScrollHeight = scrollHeight;
            if (scrollHeight > offsetHeight) {
                this.lastScrollBottom = 0;
            }
        }
    }

    @autobind
    scrollToTop() {
        if (this.contentContainer) {
            const {offsetHeight, scrollHeight} = this.contentContainer;
            this.contentContainer.scrollTop = this.lastScrollHeight = 0;
            if (scrollHeight > offsetHeight) {
                this.lastScrollBottom = scrollHeight - offsetHeight;
            }
        }
    }

    @autobind
    handleScroll() {
        const {scrollTop, offsetHeight, scrollHeight} = this.contentContainer;
        if (scrollHeight === offsetHeight) {
            this.enableScrollListener = true;
            return;
        }
        if (this.contentContainer.scrollTop === 0) {
            this.lastScrollBottom = scrollHeight - offsetHeight;
        }
        this.preserveScrollOnContainerHeightChange(scrollHeight, offsetHeight);
        if (this.enableScrollListener) {
            this.lastScrollBottom = scrollHeight - scrollTop - offsetHeight;
        }
        this.enableScrollListener = true;
    }

    @autobind
    handleResize() {
        this.enableScrollListener = false;
        const {offsetHeight, scrollHeight, scrollTop} = this.contentContainer;
        if (scrollTop === 0) {
            this.lastScrollBottom = scrollHeight - offsetHeight;
        }
        this.contentContainer.scrollTop = scrollHeight - offsetHeight - this.lastScrollBottom;
    }

    render() {
        return (
            <Measure onMeasure={this.handleResize}>
                <div
                    styleName="content"
                    ref={(el) => {
                        this.contentContainer = el;
                    }}
                >
                    {this.props.children}
                </div>
            </Measure>
        );
    }
}
