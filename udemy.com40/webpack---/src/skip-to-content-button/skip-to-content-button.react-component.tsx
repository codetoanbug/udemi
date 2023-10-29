import {findFocusables} from '@udemy/design-system-utils';
import {Button, ButtonHtmlProps} from '@udemy/react-core-components';
import React, {useState, useEffect} from 'react';

import styles from './skip-to-content-button.module.less';

/** React prop interface for SkipToButton component.  Extends {@link ButtonHtmlProps} */
interface SkipToContentButtonProps extends ButtonHtmlProps {
    /** The label for the button. Normally "Skip to content". */
    label: string;
    /**
     *  The query selector to jump to.  Ex: '.ud-main-content'
     *
     *  @remarks
     *  This field is deprecated, and is being kept for backwards compatibility purposes.
     *  You should define your content point with an anchor, and use the goToContentAnchorId
     *  prop instead.
     **/
    goToContentSelector: string;
    /**
     *  The id of the anchor field to skip to.
     *  To follow best accessibility practices, this anchor should be hidden
     *  and removed from the normal tab flow. Use the SkipToContentAnchor component for this.
     *
     *  @remarks
     *  If this content anchor's ID exists, it will take priority over the legacy goToContentSelector behaviour.
     *
     * @defaultValue `main-content-anchor` in `SkipToContentButton`
     **/
    goToContentAnchorId?: string;
}

/**
 * SkipToContentButton component
 *
 * @remarks
 * This is an accessibility tool that will allow a user who relies on keyboard navigation to skip over all the
 * superfluous links in the header to the main content of any given page.
 */
export const SkipToContentButton = ({
    goToContentSelector,
    goToContentAnchorId = 'main-content-anchor',
    label,
    ...buttonProps
}: SkipToContentButtonProps) => {
    const [source, setSource] = useState('');

    useEffect(() => {
        setSource(window.location.pathname);
    }, []);

    const onSkipToContent = () => {
        const goToAnchorElement = document.getElementById(goToContentAnchorId);
        if (goToAnchorElement) {
            /* istanbul ignore next */
            goToAnchorElement.scrollIntoView({behavior: 'smooth'});
        } else {
            const goToElement = document.querySelector(goToContentSelector);
            if (goToElement !== null) {
                const firstFocusable = findFocusables(goToElement as HTMLElement)[0];

                /* istanbul ignore next */
                firstFocusable?.focus();
                /* istanbul ignore next */
                firstFocusable?.scrollIntoView({behavior: 'smooth'});
                // One cannot spy on a function on an element that does not exist, thus ignoring code coverage for these two lines.
                // A bug in babel & istanbul make it think preceding line is terminated with a semicolon, this this comment is here instead of above.
            }
        }
    };

    return (
        <div className={styles['skip-to-content']}>
            <Button
                className={styles['skip-to-content-btn']}
                onClick={onSkipToContent}
                componentClass="a"
                href={`${source}#${goToContentAnchorId}`}
                {...buttonProps}
            >
                <span aria-hidden="true" className={styles['skip-to-content-shadow']} />
                <span style={{margin: 0}}>{label}</span>
            </Button>
        </div>
    );
};
