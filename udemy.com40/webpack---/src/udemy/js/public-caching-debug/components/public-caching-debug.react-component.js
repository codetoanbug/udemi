import React, {Component} from 'react';

import serverOrClient from 'utils/server-or-client';

import './styles.less';

export const PUBLIC_CACHE_DEBUG_PARAMETER = 'show_public_cache_debug';

/**
 * Shows the public caching debug popup.
 * This component is compiled into our entry JS bundles, so if it gets too big we should
 * start using lazy-loading, and only lazy load it if the user passes the debug query param.
 */
export default class PublicCachingDebug extends Component {
    hasCacheDebugParameter() {
        const searchParams = new URLSearchParams(serverOrClient.global.location.search);
        return searchParams.get(PUBLIC_CACHE_DEBUG_PARAMETER) === 'true';
    }

    render() {
        if (!this.hasCacheDebugParameter()) {
            return null;
        }
        return (
            <div styleName="show-cache-debug-container">
                {gettext('You are viewing a public cacheable page')}
            </div>
        );
    }
}
