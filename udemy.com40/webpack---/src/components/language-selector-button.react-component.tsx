import classNames from 'classnames';
import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import LanguageIcon from '@udemy/icons/dist/language.ud-icon';
import {Button, IconButton, ButtonProps} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import {ACTIONS, LanguageSelectorActionEvent} from '../events';
import styles from './language-selector-button.module.less';

export type LanguageSelectorButtonProps = {
    /**
     * If a value is provided, a `LanguageSelectorActionEvent` with the given `uiRegion`
     * will be published when the button is clicked
     */
    publishEvents?: {
        uiRegion: string;
    };
    withLabel?: boolean;
} & ButtonProps;

/**
 * Standard language selector button component. Shows a globe icon along with the currently
 * selected language
 */
export const LanguageSelectorButton = React.forwardRef<
    React.ComponentRef<typeof Button | typeof IconButton>,
    LanguageSelectorButtonProps
>(({publishEvents, withLabel = true, className, size = 'medium', onClick, ...buttonProps}, ref) => {
    const {locale: currentLocale} = useI18n();
    const {Config} = useUDData();

    const currentLanguage = Config.supported_languages.find(
        (language) => language.locale === currentLocale,
    );

    function handleClick(e: React.MouseEvent<HTMLElement>) {
        if (publishEvents) {
            Tracker.publishEvent(
                new LanguageSelectorActionEvent({
                    action: ACTIONS.openSelector,
                    selectorLocation: publishEvents.uiRegion,
                    selectedLocale: null,
                }),
            );
        }

        onClick?.(e);
    }

    const ButtonComponent = withLabel ? Button : IconButton;

    return (
        <ButtonComponent
            ref={ref}
            className={classNames(
                {
                    [styles['button']]: withLabel,
                },
                className,
            )}
            udStyle="secondary"
            size={size}
            typography="ud-text-md"
            onClick={handleClick}
            {...buttonProps}
        >
            <>
                <LanguageIcon label={false} size="small" color="neutral" />
                {withLabel && <span>{currentLanguage?.name}</span>}
            </>
        </ButtonComponent>
    );
});
