/**
 * This file exposes strings needing localization support while localization support matures for Frontends platform
 */
export function includeTranslations() {
    // DSW ErrorPage strings
    // https://github.com/udemy/design-system-web/blob/main/packages/react-structure-components/src/error-page/error-page.react-component.tsx
    gettext('We can’t find the page you’re looking for');
    gettext('Visit our <a class="link">support page</a> for further assistance.');
}
