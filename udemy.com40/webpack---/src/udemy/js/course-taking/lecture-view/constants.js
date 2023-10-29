// eslint-disable-next-line import/prefer-default-export
export const API_LECTURE_FIELDS = Object.freeze({
    'fields[lecture]': [
        'asset',
        'description',
        'download_url',
        'is_free',
        'last_watched_second',
    ].join(','),
    'fields[asset]': [
        'asset_type',
        'length',
        'media_license_token',
        'course_is_drmed',
        'media_sources',
        'captions',
        'thumbnail_sprite',
        'slides',
        'slide_urls',
        'download_urls',
        'external_url',
    ].join(','),
});

export const API_LECTURE_MEDIA_LICENSE_FIELDS = Object.freeze({
    'fields[asset]': 'media_license_token',
});
