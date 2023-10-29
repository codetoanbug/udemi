export function debounce(func, waitMillis) {
    let timeout = null;
    const cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    const debounced = (...args) => {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, waitMillis);
    };
    debounced.cancel = cancel;
    return debounced;
}
