import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {debounce} from '@udemy/shared-utils';
import classNames from 'classnames';
import React, {createRef, useRef, useEffect, useState} from 'react';

import {withCounter} from '../with-counter/with-counter';
import styles from './text-area-with-counter.module.less';
import {TextArea, TextAreaProps} from './text-area.react-component';

/** React prop interface for the `TextAreaWithCounter` component */
export interface TextAreaWithCounterProps extends TextAreaProps {
    /** The number to indicate the number of characters left in the `TextArea` component */
    count?: number;
    /** The max amount of characters allowed in the `TextArea` component. */
    maxLength: number;
}

/**
 * ### TextAreaWithCounter
 *
 * @remarks
 * This component will alert the user to the amount of allowed characters left in the `TextArea`
 */
export const TextAreaWithCounter = withCounter<TextAreaWithCounterProps>(
    ({count, ...props}: TextAreaWithCounterProps) => {
        const {interpolate, ngettext} = useI18n();
        const counterId = getUniqueId('text-area-with-counter');
        // initial state of 600 is ~ the default rendering size.
        const [containerWidth, setContainerWidth] = useState(600);
        const resizeElement = createRef<HTMLTextAreaElement>();

        const resizeObserver = useRef(
            new ResizeObserver(
                debounce((entries: ResizeObserverEntry[]) => {
                    // borderBoxSize returns the computed width + border
                    updateContainerSize(entries[0].borderBoxSize[0].inlineSize);
                }, 10),
            ),
        );

        useEffect(() => {
            /**
             * Per eslint:
             * The ref value 'resizeObserver.current' will likely have changed by the time this effect
             * cleanup function runs. If this ref points to a node rendered by React,
             * copy 'resizeObserver.current' to a variable inside the effect, and use
             * that variable in the cleanup function.
             */
            const resizeObserverCurrent = resizeObserver.current;
            if (resizeElement.current) {
                resizeObserver?.current.observe(resizeElement.current);
            }

            return () => {
                resizeObserverCurrent.disconnect();
            };
        }, [resizeElement, resizeObserver]);

        const updateContainerSize = (newWidth: number) => {
            setContainerWidth(newWidth);
        };

        return (
            <div className={styles['text-area-container']} style={{width: containerWidth}}>
                <TextArea
                    ref={resizeElement}
                    {...props}
                    aria-describedby={counterId}
                    className={classNames(props.className, styles.textarea)}
                />
                <span
                    aria-hidden="true"
                    className={classNames(styles.counter, {
                        [styles['counter-error']]: (count ?? 0) < 0,
                    })}
                >
                    {count}
                </span>
                <span className="ud-sr-only" aria-live="polite" id={counterId}>
                    {interpolate(
                        ngettext(
                            'You have %(count)s character of %(maxLength)s remaining.',
                            'You have %(count)s characters of %(maxLength)s remaining.',
                            count as number,
                        ),
                        {count, maxLength: props.maxLength},
                        true,
                    )}
                </span>
            </div>
        );
    },
);
