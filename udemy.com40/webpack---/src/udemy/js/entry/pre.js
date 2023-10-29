// This file contains entry point code that must run before the rest of the code.

import {configure} from 'mobx';

IntersectionObserver.prototype.POLL_INTERVAL = 100; // Time in milliseconds.

configure({enforceActions: 'observed'});

// Newer Facebook auth adds #_=_ on the redirect. This takes it off.
if (window.location.hash === '#_=_') {
    if (window.history && window.history.replaceState) {
        const cleanHref = window.location.href.split('#')[0];
        window.history.replaceState(null, null, cleanHref);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        const scroll = {
            top: document.body.scrollTop,
            left: document.body.scrollLeft,
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
    }
}
