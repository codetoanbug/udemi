import {getUniqueId} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import {withCounter} from '../with-counter/with-counter';
import {TextInputContainer} from './text-input-container.react-component';
import styles from './text-input-with-counter.module.less';
import {TextInput, TextInputProps} from './text-input.react-component';

/** React prop interface for the `TextInputWithCounter` component */
export interface TextInputWithCounterProps extends TextInputProps {
    /** The number to indicate the number of characters left in the `TextInput` component */
    count?: number;
    /** The max amount of characters allowed in the `Input` component. */
    maxLength: number;
}

/**
 * ### TextInputWithCounter
 *
 * @remarks
 * This component will alert the user to the amount of allowed characters left in the `TextInput`
 */
export const TextInputWithCounter = Object.assign(
    withCounter<TextInputWithCounterProps>(({count, ...props}: TextInputWithCounterProps) => {
        const {interpolate, ngettext} = useI18n();
        const counterId = getUniqueId('text-area-with-counter');

        return (
            <TextInputContainer>
                <TextInput {...props} aria-describedby={counterId} />
                <span>
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
                </span>
            </TextInputContainer>
        );
    }),
    {displayName: 'TextInputWithCounter'},
);
