// eslint-disable-next-line import/prefer-default-export
export function getFileExtension(fileName) {
    return (fileName || '').split('.').pop();
}
