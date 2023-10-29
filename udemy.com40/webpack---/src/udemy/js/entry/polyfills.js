import '../../../../webpack/babel/polyfills';

// IntersectionObserver polyfill for IE and Safari.
import 'intersection-observer';

// requestIdleCallback not supported in all modern browsers.
// https://developers.google.com/web/updates/2015/08/using-requestidlecallback
window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
        const start = Date.now();
        return setTimeout(() => {
            cb({
                didTimeout: false,
                timeRemaining() {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };
