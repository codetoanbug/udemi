export function getBrowseURL(url: string, hasOrganization: boolean) {
    if (hasOrganization) {
        return `/organization/home${url}`;
    }
    return url;
}
