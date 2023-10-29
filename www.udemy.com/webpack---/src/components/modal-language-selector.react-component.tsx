import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import {Modal, ModalTrigger} from '@udemy/react-dialog-components';

import {LanguageSelectorActionEvent, ACTIONS} from '../events';
import {LanguageList} from './language-list.react-component';
import styles from './modal-language-selector.module.less';

function trackOpenEvent(uiRegion: string) {
    Tracker.publishEvent(
        new LanguageSelectorActionEvent({
            action: ACTIONS.openSelector,
            selectorLocation: uiRegion,
            selectedLocale: null,
        }),
    );
}

export interface ModalLanguageSelectorProps {
    /**
     * The region in the UI where this component is located (e.g. header, footer).
     * Passed to `LanguageSelectorActionEvent`
     */
    uiRegion: string;
    /**
     * Component used to trigger the modal
     */
    trigger: React.ReactElement;
    /**
     * If true, will add the language prefix to navigation URLs (e.g. /fr/topic/python)
     * @default true
     */
    useLangPrefixedUrls?: boolean;
}

/**
 * Component that renders a `LanguageList` inside of a `Modal` and publishes a
 * `LanguageSelectorActionEvent` when the modal is opened
 */
export const ModalLanguageSelector = ({
    uiRegion,
    trigger,
    useLangPrefixedUrls = true,
}: ModalLanguageSelectorProps) => {
    const {gettext} = useI18n();
    const isMobile = useMatchMedia('sm-max');

    return (
        <ModalTrigger
            trigger={trigger}
            // eslint-disable-next-line react/jsx-no-bind
            renderModal={(props) => (
                <Modal
                    {...props}
                    fullPage={Boolean(isMobile)}
                    className={styles['modal']}
                    title={gettext('Choose a language')}
                    onOpen={() => trackOpenEvent(uiRegion)}
                >
                    <LanguageList uiRegion={uiRegion} useLangPrefixedUrls={useLangPrefixedUrls} />
                </Modal>
            )}
        />
    );
};
