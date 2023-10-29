import classNames from 'classnames';
import React from 'react';

// Note: FooterButtons CSS is served up via the react-structure-components.global.css file;

/** React prop interface for FooterButton component. */
interface FooterButtonsProps extends React.ComponentPropsWithoutRef<'div'> {
    /** Alignment of the footer buttons, left side or right side. */
    alignment?: 'left' | 'right';
}

/**
 * ### The FooterButtons component.
 *
 * @remarks
 * This component requires global CSS.
 * You must add this import to your application's `_app.tsx` global CSS import manifest:
 *
 * @example
 * `@import '~@udemy/react-structure-components/dist/react-structure-components.global.css';`
 */
export const FooterButtons = ({alignment = 'right', ...htmlProps}: FooterButtonsProps) => {
    const footerButtons = (
        <div
            {...htmlProps}
            className={classNames(htmlProps.className, 'ud-footer-btns')}
            style={{...htmlProps.style, textAlign: alignment}}
        />
    );

    // Modal makes the footer sticky at mobile breakpoint.
    // The spacer ensures the modal content does not overlap the sticky footer.
    return (
        <>
            {footerButtons}
            <div className="ud-footer-btns-spacer" />
        </>
    );
};
