import {getUniqueId} from '@udemy/design-system-utils';
import {Button, Image} from '@udemy/react-core-components';
import {ModalProps, Modal} from '@udemy/react-dialog-components';
import {Meter} from '@udemy/react-messaging-components';
import classnames from 'classnames';
import React, {useState} from 'react';

import {Step} from './types';
import styles from './welcome-modal.less';

export interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFinish?: () => void;
    steps: Array<Step>;
    finishButtonText?: string;
    nextButtonText?: string;
    disableFooterView?: boolean;
    modalProps?: Partial<ModalProps>;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
    isOpen,
    onClose,
    onFinish,
    steps,
    finishButtonText = gettext('Done'),
    nextButtonText = gettext('Continue'),
    modalProps = {},
    disableFooterView = false,
}) => {
    const [progress, setProgress] = useState({value: 1, min: 0, max: steps.length});
    const [step, setStep] = useState(steps[0]);
    const [titleId] = useState<string>(getUniqueId('welcome-modal-title'));

    if (!step) return null;

    const prev = () => {
        const current = Math.max(0, progress.value);
        setProgress({...progress, value: current - 1});
        setStep(steps[current - 2]);
    };

    const next = () => {
        const current = Math.min(steps.length - 1, progress.value);
        setProgress({...progress, value: current + 1});
        setStep(steps[current]);
    };

    const done = () => {
        onClose();
        onFinish?.();
    };

    return (
        <Modal
            isOpen={isOpen}
            title=""
            renderTitle={() => [titleId, null]}
            onClose={() => onClose()}
            className={styles['welcome-modal']}
            {...modalProps}
        >
            <div className={styles['modal-title']}>
                <h2 id={titleId} className="ud-heading-xl">
                    {step.title}
                </h2>
            </div>
            <div className={`ud-text-md ${styles['modal-description']}`}>{step.description}</div>
            <div className={styles['image-container']}>
                {steps.map((stp) => (
                    <Image
                        key={stp.imageSource}
                        src={stp.imageSource}
                        alt=""
                        styleName={classnames('modal-image', {
                            visible: step.imageSource === stp.imageSource,
                        })}
                        lazy={false}
                    />
                ))}
            </div>
            <div className={`${styles.footer} ${disableFooterView && styles['no-shadow']}`}>
                {!disableFooterView && <Meter label="" {...progress} />}
                <div
                    className={`${styles['footer-controls']} ${
                        disableFooterView && styles['medium-padding']
                    }`}
                >
                    <div>
                        {progress.value > 1 && (
                            <Button udStyle="secondary" onClick={prev} data-purpose="prev">
                                {gettext('Previous')}
                            </Button>
                        )}
                    </div>
                    <div>
                        {steps.length > 1 && (
                            <div className={`ud-text-sm ${styles['progress-text']}`}>
                                {`${progress.value} / ${progress.max}`}
                            </div>
                        )}
                    </div>
                    <div className={styles['next-button']}>
                        <Button
                            onClick={progress.value === steps.length ? done : next}
                            data-purpose="next"
                        >
                            {progress.value === steps.length ? finishButtonText : nextButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
