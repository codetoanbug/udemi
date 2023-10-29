import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

export class InternalScrollToTop extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    componentDidUpdate(prevProps) {
        const {location, history} = this.props;
        const addingPageToHistory = ['PUSH', 'REPLACE'].includes(history.action);
        const isNewPage = location.pathname !== prevProps.location.pathname;
        if (addingPageToHistory && isNewPage) {
            this.scrollTo();
        }
    }

    scrollTo() {
        if (window.pageYOffset) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

const ScrollToTop = InternalScrollToTop; // Mainly for tests.

export default withRouter(ScrollToTop);
