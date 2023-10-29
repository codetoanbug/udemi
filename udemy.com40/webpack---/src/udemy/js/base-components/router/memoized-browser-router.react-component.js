import {createBrowserHistory} from 'history';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Router} from 'react-router-dom';

/**
 * Creates a history object that uses the HTML5 history API, using `<base>` tag's `href` value as `basename`.
 * Uses `history/createBrowserHistory` under the hood.
 *
 * @param {Document|Element} container The parent element of `<base>` tag.
 * @param {Object} [props]
 * @param {String} [props.basename] The base URL of the app. Defaults to `<base>` tag's `href` value.
 * @returns {Object} Returns the history object.
 */
function createBrowserHistoryFromBaseTag(container, givenHistoryProps) {
    const historyProps = Object.assign({}, givenHistoryProps),
        baseTag = container && container.querySelector('base'),
        href = baseTag ? baseTag.getAttribute('href') : undefined;

    // Make sure to strip the trailing slash from the base href; otherwise, it causes
    // a double slash issue on route changes to the root route. It is also not
    // possible to not have the trailing slash at the end of the base href,
    // since it breaks regular a href clicks by preventing a page reload.
    // E.g. we need `<base href="/message/" />` yet `basename: "/message"`.
    if (typeof historyProps.basename === 'undefined' && href) {
        historyProps.basename = href.replace(/\/$/, '');
    }

    return createBrowserHistory(historyProps);
}

/**
 * Here's the "memoized" part of MemoizedBrowserRouter.
 * If two MemoizedBrowserRouter instances have the same `container`, they use the same history.
 * We throw an error if such instances have different browser history props, since really the
 * second router is using the history created from the first one's history props.
 */
const cache = new Map();
const createMemoizedBrowserHistoryFromBaseTag = (container, historyProps) => {
    const cached = cache.get(container);
    if (!cached) {
        const history = createBrowserHistoryFromBaseTag(container, historyProps);
        cache.set(container, {history, historyProps});
        return history;
    }
    if (cached.historyProps.basename !== historyProps.basename) {
        throw new Error(
            'You cannot have two MemoizedBrowserRouter instances within the same container ' +
                'but with different browser history props. The instances are using history ' +
                `created with history props ${JSON.stringify(cached.historyProps)}, but ` +
                `you have an instance with history props ${JSON.stringify(historyProps)}.`,
        );
    }
    return cached.history;
};

/**
 * This is the default router for React Router v4. Uses `createMemoizedBrowserHistoryFromBaseTag` under the hood.
 * The reason for memoization is to enable separate React apps to update the same history,
 * e.g. the `header-v6` app contains navigation links that update the history for the `browse` app.
 *
 * Usage:
 *
 *     import MemoizedBrowserRouter from 'base-components/router/memoized-browser-router.react-component';
 *
 *     <MemoizedBrowserRouter>
 *     </MemoizedBrowserRouter>
 *
 * See: static/src/udemy/js/examples/react-router/app.js
 */
export default class MemoizedBrowserRouter extends Component {
    static propTypes = {
        // Note: if you add any browser history props here
        // (i.e. the props that `history/createBrowserHistory` supports),
        // you also need to update createMemoizedBrowserHistoryFromBaseTag to throw an error
        // if any of the memoized router's history props differ from this router's history props.
        basename: PropTypes.string,

        container: (...args) => {
            return PropTypes.oneOfType([
                PropTypes.instanceOf(Document),
                PropTypes.instanceOf(Element),
            ])(...args);
        },
    };

    static defaultProps = {
        basename: undefined,
        container: typeof document !== 'undefined' ? document : null,
    };

    constructor(props) {
        super(props);

        const historyProps = {basename: props.basename};
        this.history = createMemoizedBrowserHistoryFromBaseTag(props.container, historyProps);
    }

    render() {
        return <Router history={this.history}>{this.props.children}</Router>;
    }
}
