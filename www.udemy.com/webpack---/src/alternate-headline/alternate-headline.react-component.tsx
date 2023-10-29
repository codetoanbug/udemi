import classNames from 'classnames';
import React from 'react';

import styles from './alternate-headline.module.less';

/** React props interface for the AlternateHeadlines component. */
export interface AlternateHeadlineProps {
    /** A custom className, if any.*/
    className?: string;
    /** The size of the layout to use.*/
    layoutVariant?: 'compact' | 'default' | 'large';
    /** Text to use as the subtitle, if any. */
    secondaryText?: string;
    /**
     *
     * A custom class for the subtitle, if any.
     *
     * @defaultValue `ud-text-md` in `AlternateHeadline`
     **/
    secondaryTextClass?: string;
    /**
     *
     * A custom style for the subtitle, if any.
     *
     * @defaultValue `secondary-text` in `AlternateHeadline`
     **/
    secondaryTextStyle?: string;
    /** Text to use as the title. */
    title: string;
    /** A custom class for the title, if any.*/
    titleClass?: string;
    /** A custom id for the title, if any.*/
    titleId?: string;
    /**
     *
     * A custom style for the title, if any.
     *
     * @defaultValue `title` in `AlternateHeadline`
     **/
    titleStyle?: 'title' | 'title-compact' | 'topic-page-title' | 'title-no-margin';
    /**
     *
     * The HTML tag to use for the title.
     *
     * @remarks
     * This shouldn't be changed from the default, unless specifically asked for by SEO.
     *
     * @defaultValue `div` in `AlternateHeadline`
     **/
    titleTag?: 'div' | 'h1' | 'h2';
}

/**
 *
 * The AlternateHeadline component.
 * Used to render a title and possibly a subtitle, for use above discovery units.
 */
export const AlternateHeadline = ({
    className,
    layoutVariant = 'default',
    secondaryText,
    secondaryTextClass = 'ud-text-md',
    secondaryTextStyle = 'secondary-text',
    title,
    titleClass,
    titleId = '',
    titleStyle = 'title',
    titleTag = 'div',
}: AlternateHeadlineProps) => {
    let defaultTitleClass = 'ud-heading-xl';
    let headingStyle = styles[titleStyle];

    switch (layoutVariant) {
        case 'compact':
            defaultTitleClass = 'ud-heading-lg';
            headingStyle = styles['title-compact'];
            secondaryTextClass = 'ud-text-sm';
            break;
        case 'default':
            defaultTitleClass = 'ud-heading-xl';
            break;
        case 'large':
            defaultTitleClass = 'ud-heading-xxl';
            break;
    }

    titleClass = titleClass ?? defaultTitleClass;
    titleId = titleId !== '' ? titleId : title;
    const titleText = React.createElement(
        titleTag,
        {
            id: titleId,
            className: titleClass,
            'data-purpose': 'alternate-headline-title',
        },
        title,
    );

    return (
        <div className={classNames(styles['title-container'], className)}>
            <div className={headingStyle}>{titleText}</div>
            {secondaryText && (
                <p className={classNames(secondaryTextClass, styles[secondaryTextStyle])}>
                    {secondaryText}
                </p>
            )}
        </div>
    );
};
