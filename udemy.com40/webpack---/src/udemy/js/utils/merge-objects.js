// Merges n objects together the way you would expect from Object.assign(),
// except that array values are also merged. Array merge is implemented as
// concatenating the arrays and removing duplicates.
export function mergeObjectsWithArrayMerge(obj, ...args) {
    obj = {...obj};
    args.forEach((source) => {
        for (const prop in source) {
            if (Array.isArray(obj[prop]) && Array.isArray(source[prop])) {
                obj[prop] = mergeArrays(obj[prop], source[prop]);
            } else if (
                obj[prop] &&
                typeof obj[prop] === 'object' &&
                source[prop] &&
                typeof source[prop] === 'object'
            ) {
                obj[prop] = mergeObjectsWithArrayMerge(obj[prop], source[prop]);
            } else {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
}

export function mergeArrays(...arrays) {
    const seen = new Set();
    const merged = [];
    arrays.forEach((array) => {
        array.forEach((item) => {
            if (!seen.has(item)) {
                merged.push(item);
                seen.add(item);
            }
        });
    });
    return merged;
}
