export const assetTypes = Object.freeze({
    article: 'Article',
    audio: 'Audio',
    ebook: 'E-Book',
    externalLink: 'ExternalLink',
    file: 'File',
    iFrame: 'IFrame',
    importContent: 'ImportContent',
    misc: 'Misc',
    presentation: 'Presentation',
    sourceCode: 'SourceCode',
    video: 'Video',
    videoMashup: 'VideoMashup',
});

export const videoBasedAssetTypes = Object.freeze(
    new Set([assetTypes.video, assetTypes.videoMashup]),
);

export const textBasedAssetTypes = Object.freeze(
    new Set([assetTypes.article, assetTypes.importContent, assetTypes.iFrame]),
);

export const assetLabels = {
    [assetTypes.article]: gettext('Article'),
    [assetTypes.audio]: gettext('Audio'),
    [assetTypes.ebook]: gettext('E-Book'),
    [assetTypes.externalLink]: gettext('External Link'),
    [assetTypes.file]: gettext('File'),
    [assetTypes.iFrame]: gettext('IFrame'),
    [assetTypes.importContent]: gettext('Imported Content'),
    [assetTypes.misc]: gettext('File'),
    [assetTypes.presentation]: gettext('Presentation'),
    [assetTypes.sourceCode]: gettext('Source Code'),
    [assetTypes.video]: gettext('Video'),
    [assetTypes.videoMashup]: gettext('Video & Slide Mashup'),
};

export const assetStatuses = Object.freeze({
    uploading: 'uploading', // this is an artificial state that we use only while uploading the file.
    queued: -2,
    failed: -1,
    processing: 0,
    success: 1,
});

export const lhaTypes = Object.freeze({
    main: 'main',
    supplementary: 'supplementary',
});
