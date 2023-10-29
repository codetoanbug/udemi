/* this polyfill adds the composedPath to event function when it's not available (eg. ie11) */
// https://gist.github.com/rockinghelvetica/00b9f7b5c97a16d3de75ba99192ff05c
function polyfillComposedPath(E, d, w) {
    if (!E.composedPath) {
        E.composedPath = function () {
            if (this.path) {
                return this.path;
            }
            let target = this.target;

            this.path = [];
            while (target.parentNode !== null) {
                this.path.push(target);
                target = target.parentNode;
            }
            this.path.push(d, w);
            return this.path;
        };
    }
}
if (typeof Event !== 'undefined' && typeof window !== 'undefined') {
    polyfillComposedPath(Event.prototype, document, window);
}
