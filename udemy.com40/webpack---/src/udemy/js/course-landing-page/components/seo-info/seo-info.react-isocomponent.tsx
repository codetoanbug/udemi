import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

export const daysAgo = (days: number) => Date.now() - days * 24 * 60 * 60 * 1000;

const htmlTag = /(<([^>]+)>)/gi;

export interface SEOInfoProps {
    /** Stringified schema.org JSON representation of the page */
    schema?: string;
    /** A date string representing the last updated date for the course */
    lastModifiedForSEO: string;
}

/**
 * Renders a hidden component with schema.org compliant markup for SEO
 * Only renders the last modified date when the course was modified in the last 60 days
 */
export const SEOInfo = ({schema, lastModifiedForSEO}: SEOInfoProps) => {
    const schemaMarkup = schema ? (
        <div id="schema_markup" data-purpose="schema_markup">
            <script
                type="application/ld+json"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'course-landing-page/seo-info',
                    html: schema.replace(htmlTag, ''),
                })}
            ></script>
        </div>
    ) : null;
    const modifiedDateEnabled = new Date(lastModifiedForSEO).valueOf() > daysAgo(60);
    const modifiedDate = !modifiedDateEnabled ? null : (
        <div className="seo-info" itemScope={true} itemType="http://schema.org/CreativeWork">
            <span className="hidden" itemProp="dateModified">
                {lastModifiedForSEO}
            </span>
        </div>
    );
    return (
        <>
            {modifiedDate}
            {schemaMarkup}
        </>
    );
};

export default isomorphic(SEOInfo);
