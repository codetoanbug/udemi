export default {
    addListener(eventName, handler) {
        document.addEventListener(eventName, (event) => {
            handler(event.detail);
        });
    },
    once(eventName, handler) {
        function oneTimeHandler(event) {
            document.removeEventListener(eventName, oneTimeHandler);
            handler(event.detail);
        }
        document.addEventListener(eventName, oneTimeHandler);
    },
    emit(eventName, detail) {
        document.dispatchEvent(new CustomEvent(eventName, {detail}));
    },
};
