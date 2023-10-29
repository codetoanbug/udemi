/**
 * This is a replacement for dangerouslySetInnerHTML (REVIEWED_BY_APPSEC) that uses
 * DOMPurify.sanitize.
 *
 * Example:
 *
 *    <span
 *        {...safelySetInnerHTML({
 *            descriptionOfCaller: 'course-card:course-description',
 *            html: course.description,
 *        })}
 *    />
 *
 * Use this function if you have some HTML and you want to sanitize it a bit. If you just want to
 * treat a piece of content as plain text, use escape-html instead.
 *
 * Note, we sanitize on the client even if we've already sanitized on the server because it's really
 * difficult to know for certain that that was done. We also sanitize on the client in any case
 * where we would otherwise have to use dangerouslySetInnerHTML (REVIEWED_BY_APPSEC)
 * because people tend to make a lot of mistakes that open us up to XSS vulnerabilities.
 *
 * This function will also set data-purpose which you may use in your tests. You can either pass
 * your own value, or it'll use `safely-set-inner-html:${descriptionOfCaller}`.
 *
 * - descriptionOfCaller: (Required) A string such as 'course-card:course-description' to
 *   describe the caller.
 * - html: (Required) The HTML to be sanitized.
 * - dataPurpose: (Optional) Use this to override the data-purpose used on the outer tag.
 * - domPurifyConfig: (Optional) This is passed to `DOMPurify.sanitize`. For instance, you can
 *   permit `target="_blank"` in `<a>` tags via `domPurifyConfig: {ADD_ATTR: ['target']}`.
 *   See https://github.com/cure53/DOMPurify near "Can I configure DOMPurify?".
 *
 * See also this doc:
 * https://docs.google.com/document/d/1ZqUgwNTDxmzk434xX9KFTIR1T08_vydcVlA-khWXdOs/edit#heading=h.aruds4ngow8u
 *
 * @param {{descriptionOfCaller: string; html: string; dataPurpose?: string | null; domPurifyConfig?: any}} options
 */
export function safelySetInnerHTML({
    descriptionOfCaller,
    html,
    dataPurpose = undefined,
    domPurifyConfig = undefined,
}) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {DOMPurify} = require('../iso/iso-dompurify');
    const sanitizedHtml = DOMPurify.sanitize(html, domPurifyConfig);
    dataPurpose = dataPurpose || `safely-set-inner-html:${descriptionOfCaller}`;
    return {
        'data-purpose': dataPurpose,
        'data-testid': dataPurpose,
        dangerouslySetInnerHTML: {__html: sanitizedHtml}, // REVIEWED_BY_APPSEC
    };
}
