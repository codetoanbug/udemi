import udBrowse from 'utils/ud-browse';

export default function preloadedData(pathString) {
    const keys = pathString.split('.');
    let value = udBrowse;
    keys.forEach((key) => {
        value = value && value[key] !== undefined ? value[key] : undefined;
    });
    return value;
}
