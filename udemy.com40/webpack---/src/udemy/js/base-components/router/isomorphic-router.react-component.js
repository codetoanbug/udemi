import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {StaticRouter} from 'react-router';

import serverOrClient from 'utils/server-or-client';

import MemoizedBrowserRouter from './memoized-browser-router.react-component';

const injectMapping = ({serverAdditionalContext, serverRequestContext}) => {
    return {serverAdditionalContext, serverRequestContext};
};

@inject(injectMapping)
export default class IsomorphicRouter extends React.Component {
    static propTypes = {
        serverAdditionalContext: PropTypes.object,
        serverRequestContext: PropTypes.object,
    };

    static defaultProps = {
        serverAdditionalContext: null,
        serverRequestContext: null,
    };

    render() {
        const {serverAdditionalContext, serverRequestContext, ...props} = this.props;
        if (serverOrClient.isServer) {
            // https://github.com/ReactTraining/react-router/blob/v4.3.1/packages/react-router-dom/docs/guides/server-rendering.md#server-rendering
            //
            // serverAdditionalContext and serverRequestContext are provided by the @isomorphic HOC,
            // which gets them from Node (isomorphic-rendering/bootstrap.js).
            //
            // Node gets serverRequestContext from Django, so we can set the initial `location`
            // of StaticRouter.
            //
            // If the router needs to render a Redirect, it will mutate serverAdditionalContext
            // to indicate the redirect url. Not yet implemented: Node can then send
            // serverAdditionalContext back to Django, so Django can perform the redirect.
            return (
                <StaticRouter
                    {...props}
                    context={serverAdditionalContext}
                    location={serverRequestContext.full_path}
                />
            );
        }
        return <MemoizedBrowserRouter {...props} />;
    }
}
