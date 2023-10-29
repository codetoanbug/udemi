// eslint-disable-next-line import/prefer-default-export
export function reportAbuseLink({category, objectId, objectType, extraParams}) {
    const searchParams = new URLSearchParams();
    searchParams.set('related_object_type', objectType);
    searchParams.set('related_object_id', objectId);
    if (category) {
        searchParams.set('category', category);
    }
    if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => {
            searchParams.set(k, v);
        });
    }
    return `/feedback/report/?${searchParams.toString()}`;
}
