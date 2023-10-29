/* eslint-disable */
// @ts-nocheck
export function injectPendo(apiKey) {
    (function (apiKey) {
        (function (p, e, n, d, o) {
            let v, w, x, y, z;
            o = p[d] = p[d] || {};
            o._q = o._q || [];
            v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
            for (w = 0, x = v.length; w < x; ++w) {
                (function (m) {
                    o[m] = o[m] || function () {
                        // eslint-disable-next-line prefer-rest-params
                        o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
                    };
                })(v[w]);
            }
            y = e.createElement(n);
            y.async = !0;
            y.src = 'https://content.pendo.udsrv.com/agent/static/' + apiKey + '/pendo.js';
            z = e.getElementsByTagName(n)[0];
            z.parentNode.insertBefore(y, z);
        })(window, document, 'script', 'pendo');
    })(apiKey);
}
