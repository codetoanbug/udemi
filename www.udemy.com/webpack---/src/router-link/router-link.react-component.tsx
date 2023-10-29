/* eslint-disable react/jsx-pascal-case */
import {createPath, LocationDescriptor} from 'history';
import React from 'react';
import {__RouterContext as RouterContext} from 'react-router';
// eslint-disable-next-line udemy/import-disallow
import {Link as ReactRouterLink, LinkProps as ReactRouterLinkProps} from 'react-router-dom';

/** Interface for UdemyLink within the Monolith. Extends `LinkProps` from `react-router-dom` */
export interface UdemyLinkProps extends ReactRouterLinkProps {
    disableRouter?: boolean;
    to: LocationDescriptor<unknown> | string;
}

/** Component for rendering a link that utilizes `react-router-dom` */
export const RouterLink = ({disableRouter = false, ...linkProps}: UdemyLinkProps) => (
    <RouterContext.Consumer>
        {(context) => {
            if (context && !disableRouter) {
                return <ReactRouterLink {...linkProps} />;
            }

            const {component, innerRef, replace, to, ...anchorProps} = linkProps;
            const href = typeof to === 'string' ? to : createPath(to);
            return <a {...anchorProps} href={href as string} ref={innerRef} />;
        }}
    </RouterContext.Consumer>
);
