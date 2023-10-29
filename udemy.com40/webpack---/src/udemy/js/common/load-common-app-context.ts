import {fetchCommonAppData} from '@udemy/ud-api';
import Cookies from 'js-cookie';
import {when} from 'mobx';

import udMe from 'utils/ud-me';

import {CommonAppContext} from './types';

function getCommonAppData(): Promise<CommonAppContext> {
    return fetchCommonAppData({header: true, footer: true});
}

// eslint-disable-next-line import/no-default-export
export default function loadCommonAppContext(
    cb?: (response: CommonAppContext) => void,
): Promise<CommonAppContext> {
    // If the page is cached, we don't know if the user is logged in or not until subsequent XHR request
    // that sets a `ud_cache_user` cookie that we then can use to determine logged in status.
    // If we already have that cookie, then we know a user is logged in and the original request is going
    // to be sufficient.  The response headers that set `ud_cache_user` occur on a variety of XHR requests,
    // but we choose to listen for the /context/me API for source of truth if a user is logged in or not.
    if (UD.performance.isPageCached && !Cookies.get('ud_cache_user')) {
        return new Promise((resolve, reject) => {
            // Make two requests in parallel. The first is only correct for logged out users. The
            // second is always correct, but slower b/c it's blocked by udMe. We trigger `cb` asap
            // to minimize render time. We're OK with an initial render with wrong data. It doesn't
            // happen often b/c logged in users have `ud_cache_user` after page reload.
            let isOptimisticResponseWrong = false;
            const optimisticResponsePromise = getCommonAppData().then((response) => {
                !isOptimisticResponseWrong && cb && cb(response);
                return response;
            });

            when(
                () => !udMe.isLoading,
                () => {
                    if (udMe.id) {
                        isOptimisticResponseWrong = true;
                        loadCommonAppContext.reset();
                        getCommonAppData()
                            .then((response) => {
                                cb?.(response);
                                resolve(response);
                            })
                            .catch(reject);
                    } else {
                        optimisticResponsePromise.then(resolve).catch(reject);
                    }
                },
            );
        });
    }

    return getCommonAppData().then((response) => {
        cb?.(response);
        return response;
    });
}

loadCommonAppContext.reset = () => {
    fetchCommonAppData.reset();
};
