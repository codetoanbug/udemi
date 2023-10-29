import udLink from 'utils/ud-link';

// eslint-disable-next-line import/prefer-default-export
export function addDefaultSrc(ev) {
    ev.target.src = udLink.toStorageStaticAsset('skills_navigator/default.svg');
}
