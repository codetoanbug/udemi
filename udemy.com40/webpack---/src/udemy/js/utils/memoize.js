export default function memoize(target, name, descriptor) {
    // Class method decorator syntax
    if (descriptor) {
        descriptor.value = memoize(descriptor.value);
        return descriptor;
    }

    const wrapper = function (...args) {
        const cache = wrapper.__cache;
        const cacheKey = JSON.stringify(args);

        if (!cache.has(cacheKey)) {
            cache.set(cacheKey, target.apply(this, args));
        }

        return cache.get(cacheKey);
    };

    wrapper.__cache = new Map();

    return wrapper;
}
