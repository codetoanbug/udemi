/** A function to generate an `href` with query parameters
 *
 *  @param page the number of the page you are on
 *
 *  @returns the full `window.location.pathname` string with query parameters.
 */
export function paginatedLink(page: number) {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
        params.set('p', page.toString());
    } else {
        params.delete('p');
    }
    params.sort();

    const query = params.toString() ? `?${params.toString()}` : '';
    return `${window.location.pathname}${query}`;
}
