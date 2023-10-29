import React from 'react';

import {serverOrClient} from '@udemy/shared-utils';

// Use a detached doc so that innerHTML doesn't execute side effects
// (e.g. <img onload="alert(':(){ :|:& };:')" src="http://valid-src.jpg">).
let detachedDoc: Document | null = null;

// http://www.w3schools.com/jsref/prop_node_nodetype.asp
const TEXT_NODE_TYPE = 3;

function parse(html: string) {
    if (!detachedDoc) {
        let doc: Document;
        if (serverOrClient.isServer && serverOrClient.global?.JSDOM) {
            doc = new serverOrClient.global.JSDOM().window.document;
        } else {
            doc = document;
        }

        detachedDoc = doc.implementation.createHTMLDocument('title');
    }
    const wrapper = detachedDoc?.createElement('span') as HTMLElement;
    wrapper.innerHTML = html;
    return wrapper;
}

function reactify(
    element: HTMLElement,
    interpolate: LocalizedHtmlProps['interpolate'],
    key = 0,
): React.ReactElement {
    if (element.nodeType === TEXT_NODE_TYPE) {
        return <React.Fragment key={key}>{element.textContent}</React.Fragment>;
    }

    let children: React.ReactElement[] | null = Array.from(element.childNodes).map((child, i) => {
        return reactify(child as HTMLElement, interpolate, key + i);
    });
    if (children.length === 0) {
        // React complains about passing children={ [] } for "void elements" such as <img />.
        children = null;
    }

    const interpolatedComponent = interpolate[element.className];
    if (interpolatedComponent) {
        if (typeof interpolatedComponent === 'string') {
            return <React.Fragment key={key}>{interpolatedComponent}</React.Fragment>;
        }
        return React.cloneElement(interpolatedComponent, {key}, children);
    }
    return React.createElement(element.tagName.toLowerCase(), {key}, children);
}

/** React props interface for `LocalizedHtml` component */
export interface LocalizedHtmlProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** The content to be displayed. HTML in string format. */
    html?: string;
    /** The strings to interpolate. */
    interpolate: Record<string, React.ReactElement | string>;
    /** The data-purpose attribute. */
    dataPurpose?: string;
}

/**
 * ### LocalizedHtml
 *
 * This utility component handles localization of strings such as:
 *     This is <a href={ this.href }>a link</a> in a sentence.
 * where something like safelySetInnerHTML is insufficient, as the anchor uses a prop on the component.
 *
 * @example
 * ```
 * <LocalizedHtml
 *     html={gettext('This is <a class="reactLink">a link</a> in a sentence.')}
 *     interpolate={ { reactLink: (<a href={ this.href } />) } } />
 * ```
 *
 * Each key in `interpolate` should match the CSS class of an html tag in the
 * html template.
 *
 * Note, if you pass HTML with tags within the html prop, those tags can't have attributes other
 * than class. They'll just be ignored. You should pass that stuff using the interpolate object
 * instead.
 *
 * @see {@link https://udemywiki.atlassian.net/wiki/spaces/PDEUX/pages/127008627/Localization+Getting+Started#LocalizationGettingStarted-StringContainingReactComponent}
 */
export const LocalizedHtml = ({
    html = '',
    interpolate,
    dataPurpose,
    ...htmlProps
}: LocalizedHtmlProps) => {
    const wrapperHTMLElement = parse(html as string);
    const wrapperReactComponent = reactify(wrapperHTMLElement, interpolate);

    return (
        <span {...htmlProps} data-purpose={dataPurpose}>
            {wrapperReactComponent.props.children}
        </span>
    );
};
