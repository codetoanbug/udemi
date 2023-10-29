import React from 'react';

import {useUDData} from '@udemy/ud-data';

import {useGetLocaleUrl} from '../hooks/use-get-locale-url';

// This is a allow list of pages where we'd like to to render locale SEO link piles
// Pages with very similar content should not be included in this list
export const ALLOW_PAGES_LOCALE_SEO_LINKS = [
    'consumer_subscription_landing_page',
    'discovery_category',
    'discovery_logged_out_home',
    'discovery_subcategory',
    'discovery_topic',
    'sitemap',
    'teaching',
];

export interface LanguageSeoLinksProps {
    /**
     * The current URL of the page. This is necessary during server-side rendering
     * to generate correct locale links since `window.location` is not available
     */
    currentUrl?: string;
}

/**
 * This component renders hidden links for all of our supported languages so that they can
 * be indexed by crawlers. This is should be used when the actual language selector content is
 * rendered in a modal or overlay which does not exist in the DOM until the user clicks on the trigger.
 */
export const LanguageSeoLinks = React.forwardRef<HTMLDivElement, LanguageSeoLinksProps>(
    ({currentUrl}, ref) => {
        const {Config, userAgnosticTrackingParams} = useUDData();
        const getLocaleUrl = useGetLocaleUrl(currentUrl);

        if (!ALLOW_PAGES_LOCALE_SEO_LINKS.includes(userAgnosticTrackingParams?.page_key)) {
            return null;
        }

        return (
            <div
                ref={ref}
                className="ud-sr-only"
                aria-hidden={true}
                data-testid="seo-link-container"
            >
                {Config.supported_languages.map((language) => (
                    <a
                        key={language.locale}
                        href={getLocaleUrl(language.locale).path}
                        tabIndex={-1}
                    >
                        {language.name}
                    </a>
                ))}
            </div>
        );
    },
);
