import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

import styles from './popover-styles.less';
import {Step} from './types';

export interface PopoverTourProps {
    open: boolean;
    startingStep?: number;
    onClose: () => void;
    onFinish?: () => void;
    onRedirect?: (redirectUrl?: {pathname: string; search: string}) => void;
    steps: Step[];
    maxInterval?: number;
    hideStepNumbers?: boolean;
    hideDismissOnLastStep?: boolean;
}
export const PopoverTour: React.FC<PopoverTourProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = useState<boolean>(props.open);
    const [triggerParent, setTriggerParent] = useState<Element | null>(null);
    const [trigger, setTrigger] = useState<Element | null>(null);
    const [interval, setInterval] = useState<number>(0);
    const [stepNumber, setStepNumber] = useState<number>(props.startingStep ?? 0);
    const [step, setStep] = useState<Step>(props.steps[stepNumber]);

    const isOpenRef = useRef<boolean>(isOpen);
    const triggerRef = useRef<Element | null>(trigger);
    const triggerParentRef = useRef<Element | null>(triggerParent);

    const isLastStep = stepNumber === props.steps.length - 1;

    useEffect(() => {
        if (!props.open) return;
        const elementFound = document.querySelector(step.selector);
        if (!elementFound) {
            setOpen(false);
            setTimeout(() => {
                if (interval < (props.maxInterval ?? 20)) {
                    setInterval(interval + 1);
                }
            }, 500);
            return;
        }
        setTrigger(elementFound as Element);
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-purpose', 'popover-tour-wrapper');
        elementFound.parentElement?.replaceChild(wrapper, elementFound);
        if (step.wrapperStyle) {
            Object.keys(step.wrapperStyle).forEach((key: string) => {
                // @ts-expect-error passed
                wrapper.style[key] = step.wrapperStyle?.[key];
            });
        }
        setTriggerParent(wrapper);
    }, [interval, props.maxInterval, props.open, step]);

    useEffect(() => {
        if (!ref.current) return;
        ref.current?.appendChild(trigger as Node);
        setOpen(true);
    }, [trigger, triggerParent]);

    useEffect(() => {
        if (!scrollRef.current) return;
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }, 200);
    }, [scrollRef, trigger, isOpen]);

    /**
     * When unmounting the component without dismiss, component should roll back the popover replacements.
     * Inorder to access the latest value of trigger, we need to cache it with triggerRef object. Likewise for the triggerParent.
     * useLayoutEffect works synchronously on unmount time un-likely to useEffect so makes us able to access ref objects' latest value.
     * https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing
     */
    useEffect(() => {
        isOpenRef.current = isOpen;
        triggerRef.current = trigger;
        triggerParentRef.current = triggerParent;
    }, [isOpen, trigger, triggerParent]);

    useLayoutEffect(
        (() => {
            return () => {
                if (isOpenRef.current) {
                    rollbackReplacements();
                }
            };
        }) as VoidFunction,
        [],
    );

    const rollbackReplacements = () => {
        triggerParentRef.current?.parentElement?.replaceChild(
            triggerRef.current as Node,
            triggerParentRef.current,
        );
    };

    const dismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpen(false);
        isOpenRef.current = false;
        rollbackReplacements();
        props.onClose();
    };
    const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        rollbackReplacements();
        if (stepNumber === props.steps.length - 1) {
            dismiss(e);
            props.onFinish?.();
            return;
        }
        const nextStepNumber = stepNumber + 1;
        setStep(props.steps[nextStepNumber]);
        setStepNumber(nextStepNumber);
        if (props.onRedirect) {
            setOpen(false);
            props.onRedirect(step.redirectUrl);
        }
    };

    if (!trigger) return null;
    return ReactDOM.createPortal(
        <Popover
            isOpen={isOpen}
            trigger={<div ref={ref} />}
            withArrow={true}
            {...step.popoverProps}
        >
            <div className="ud-heading-sm">{step.message}</div>
            <div className={styles.footer}>
                <div>{props.hideStepNumbers ? '' : `${stepNumber + 1}/${props.steps.length}`}</div>
                <div ref={scrollRef} className={styles.buttons}>
                    {!(isLastStep && props.hideDismissOnLastStep) && (
                        <Button
                            udStyle="secondary"
                            size="medium"
                            data-purpose="popover-dismiss"
                            onClick={dismiss}
                        >
                            {gettext('Dismiss')}
                        </Button>
                    )}
                    <Button size="medium" onClick={nextStep} data-purpose="popover-next">
                        {isLastStep ? gettext('Get started') : gettext('Next')}
                    </Button>
                </div>
            </div>
        </Popover>,
        triggerParent as Element,
    );
};
