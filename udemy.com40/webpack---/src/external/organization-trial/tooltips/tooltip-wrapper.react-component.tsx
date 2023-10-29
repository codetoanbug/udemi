import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {BasicPopover, BasicPopoverProps} from '@udemy/react-popup-components';

import {setupTooltipLocalStorage} from './setup-tooltip-local-storage';
import styles from './tooltip-wrapper.module.less';

export interface TooltipContent {
    type: string;
    title: string;
    text: string;
    position?: string;
}

export interface TooltipWrapperProps extends BasicPopoverProps {
    content: TooltipContent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentClass?: React.ComponentType<any>;
    isOpen?: boolean;
}

export const TooltipWrapper = observer(
    ({content, componentClass = BasicPopover, isOpen, ...rest}: TooltipWrapperProps) => {
        const [storage] = React.useState(setupTooltipLocalStorage(content.type));
        const [tooltipVisible, setTooltipVisible] = React.useState(false);
        const {gettext} = useI18n();

        React.useEffect(() => {
            if (isOpen && storage.get('tooltip_type') !== content.type) {
                setTooltipVisible(true);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [content.type, isOpen]);

        const onClose = () => {
            setTooltipVisible(false);
            storage.set('tooltip_type', content.type);
        };

        const PopoverComponent = componentClass;
        return (
            <PopoverComponent {...rest} isOpen={tooltipVisible}>
                <div data-testid="tooltip-title" className={styles['tooltip-title']}>
                    {content.title}
                </div>
                <div data-testid="tooltip-text" className={styles['tooltip-text']}>
                    {content.text}
                </div>
                <Button
                    udStyle="secondary"
                    onClick={onClose}
                    size="medium"
                    data-testid="tooltip-cta"
                    className={styles['tooltip-cta']}
                >
                    {gettext('Dismiss')}
                </Button>
            </PopoverComponent>
        );
    },
);
