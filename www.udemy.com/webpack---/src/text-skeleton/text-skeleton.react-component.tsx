import {range} from '@udemy/shared-utils';
import classNames from 'classnames';
import React from 'react';

import {Block} from '../block/block.react-component';
import {Skeleton} from '../skeleton/skeleton.react-component';
import styles from './text-skeleton.module.less';

/**
 * React component prop interface for the Paragraph component.
 * @internal
 */
interface ParagraphProps {
    /** The number of lines of mock paragraph text to display. */
    lineCount: number;
    /**
     * Flag to mimic a the appearance of justified text in the paragraph.
     *
     * @see {@link ParagraphProps['justified']}
     */
    justified: boolean;
}

/**
 * The Paragraph component. A `<p>` tab with several {@link Block} components rendered.
 * @internal
 */
const Paragraph = ({lineCount, justified}: ParagraphProps) => (
    <p className={classNames({[styles['not-justified']]: !justified})}>
        {range(lineCount).map((i) => (
            <Block key={i} className={classNames('ud-text-skeleton-line', styles.line)} />
        ))}
    </p>
);

/** React component props for the TextSkeleton component. */
interface TextSkeletonProps extends React.ComponentPropsWithoutRef<'div'> {
    /** The number of mock paragraph text lines to display per 'paragraph'. */
    lineCountPerParagraph?: number;
    /** The number of mock paragraphs to render. */
    paragraphCount?: number;
    /** Flag to render a mocked heading. */
    withTitle?: boolean;
    /**
     * Mock a portion of justified text on the last line of TextSkeleton.
     *
     * @remarks
     * If `true`, the last line of this component will be rendered at 60% width, otherwise
     * it will be 100%.
     *
     * @defaultValue false in `TextSkeleton` component
     */
    justified?: boolean;
}

/** The TextSkeleton component. Mimics scaffolding for paragraphs of content while loading. */
export const TextSkeleton = ({
    lineCountPerParagraph = 5,
    paragraphCount = 1,
    withTitle,
    justified = false,
    className,
}: TextSkeletonProps) => (
    <Skeleton className={classNames('ud-text-skeleton', styles['text-skeleton'], className)}>
        {withTitle && <Block className={classNames('ud-text-skeleton-title', styles.title)} />}
        {range(paragraphCount).map((i) => (
            <Paragraph key={i} justified={justified} lineCount={lineCountPerParagraph} />
        ))}
    </Skeleton>
);
