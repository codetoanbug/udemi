import {LocalizedHtml, useI18n} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import {ConfirmModal, Modal, ModalTrigger} from '@udemy/react-dialog-components';
import React from 'react';

import {LabDuration} from 'labs/lab-duration-timer/lab-duration.react-component';
import leaveLabImage from 'labs/lab-launcher/leave_lab_image.png';

import styles from './leave-modal.less';

interface LeaveModalProps {
    timeRemainingInSeconds: number;
    isOpen: boolean;
    onClose: () => void;
    onLeaveLab: () => Promise<void>;
    onEndLab: () => Promise<void>;
    isEndingLab?: boolean;
}

export const LeaveModal = ({
    timeRemainingInSeconds,
    isOpen,
    onClose,
    onLeaveLab,
    onEndLab,
    isEndingLab = false,
}: LeaveModalProps) => {
    const {gettext} = useI18n();

    return (
        <Modal
            title={gettext('Good things take time')}
            isOpen={isOpen}
            onClose={onClose}
            requireExplicitAction={false}
            fullPage={false}
        >
            <div className={styles.container}>
                <Image
                    src={leaveLabImage}
                    alt={gettext('Good things take time')}
                    width={200}
                    height={180}
                    className={styles.image}
                />
                <p className={styles.text}>
                    {gettext(
                        'We understand working on a project can take a little longer. If you end your lab, your progress will be lost and all data will be cleared.',
                    )}
                </p>
                <LocalizedHtml
                    html={gettext(
                        ' If you <b>leave</b> this lab, we will keep your progress for <span class="labDuration">%(labDuration)s</span>',
                    )}
                    interpolate={{
                        labDuration: (
                            <LabDuration
                                durationInSeconds={timeRemainingInSeconds}
                                shouldShowTimeOnly={true}
                                withIcon={false}
                                isCountDownEnabled={false}
                            />
                        ),
                    }}
                />
                <div className={styles.buttons}>
                    <ModalTrigger
                        trigger={
                            <Button
                                udStyle="ghost"
                                className="ud-link-neutral"
                                data-purpose="end-lab-button"
                            >
                                {gettext('End lab')}
                            </Button>
                        }
                        renderModal={({isOpen}) => (
                            <ConfirmModal
                                loading={isEndingLab}
                                isOpen={isOpen}
                                title={gettext('Are you sure you want to end this lab?')}
                                onCancel={onClose}
                                confirmText={gettext('Yes, end lab')}
                                cancelText={gettext('Actually, no')}
                                onConfirm={onEndLab}
                                requireExplicitAction={true}
                            >
                                {gettext(
                                    'Ending your lab means that any progress will be lost and all data will be cleared.',
                                )}
                            </ConfirmModal>
                        )}
                    />
                    <Button udStyle="primary" onClick={onLeaveLab} data-purpose="leave-lab-button">
                        {gettext('Leave lab')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
