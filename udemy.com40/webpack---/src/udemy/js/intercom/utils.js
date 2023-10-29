export const loadIntercom = (intercomSettings = {}, w = window) => {
    // to load intercom with given settings using plain JS
    // https://developers.intercom.com/installing-intercom/docs/basic-javascript
    const ic = w.Intercom;
    if (typeof ic === 'function') {
        ic('reattach_activator');
        ic('update', intercomSettings);
    } else {
        const i = function () {
            i.c(arguments); // eslint-disable-line prefer-rest-params
        };
        i.q = [];
        i.c = function (args) {
            i.q.push(args);
        };
        w.Intercom = i;
        const l = function () {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${intercomSettings.app_id}`;
            const x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === 'complete') {
            l();
        } else if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
        }
    }
};

export const patchHistory = (w = window) => {
    // to trigger update each time the route changes in the React app
    const history = w.history;
    if (w.Intercom && !history.hasIntercomPatch) {
        const originalPushState = history.pushState;
        history.pushState = function (state) {
            if (typeof history.onpushstate == 'function') {
                history.onpushstate({state});
            }
            w.Intercom('update');

            return originalPushState.apply(history, arguments); // eslint-disable-line prefer-rest-params
        };
        history.hasIntercomPatch = true;
    }
};
