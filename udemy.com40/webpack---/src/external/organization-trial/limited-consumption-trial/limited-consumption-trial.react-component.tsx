import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {useUDData, useSiteStats} from '@udemy/ud-data';

import {AvailableLectures} from '../available-lectures/available-lectures.react-component';
import {NOTIFICATION_EVENTS} from '../constants';
import {LockedLectureModal} from '../locked-lecture-modal/locked-lecture-modal.react-component';
import {NudgeOwnerModal} from '../nudge-owner-modal/nudge-owner-modal.react-component';
import {useGetTooltipProps} from '../tooltips/tooltip-hooks';
import {TooltipWrapper} from '../tooltips/tooltip-wrapper.react-component';
import {UnlockButton} from '../unlock-button/unlock-button.react-component';
import {LimitedConsumptionTrialStore} from './limited-consumption-trial.mobx-store';
import styles from './limited-consumption-trial.module.less';

export const LimitedConsumptionTrial = observer(() => {
    const {Config} = useUDData();
    const stats = useSiteStats();
    const i18n = useI18n();
    const getTooltipProps = useGetTooltipProps();
    const [store] = React.useState(
        new LimitedConsumptionTrialStore(getTooltipProps, stats.getOrgNumericSiteStat),
    );

    React.useEffect(() => {
        function addEventListeners() {
            // To handle events from external sources like course-taking of invitation
            NOTIFICATION_EVENTS.forEach((eventName) => {
                document.addEventListener(eventName, store.handleEvent);
            });
        }

        function removeEventListeners() {
            NOTIFICATION_EVENTS.forEach((eventName) => {
                document.removeEventListener(eventName, store.handleEvent);
            });
        }

        addEventListeners();
        store.getStatus();

        return () => {
            removeEventListeners();
        };
    }, [store]);

    function renderNudgeOwnerButton() {
        const button = (
            <UnlockButton onClick={store.showNudgeOwnerModal} ownerName={store.ownerName} />
        );
        if (button && store.currentTooltip?.position === 'unlock_button') {
            return (
                <TooltipWrapper
                    content={store.currentTooltip}
                    placement="top-end"
                    isOpen={true}
                    trigger={button}
                />
            );
        }
        return button;
    }

    function renderBuyButton() {
        const availableButtonPositions = ['buy_button', 'unlock_button'];

        if (
            store.isOwner &&
            store.currentTooltip?.position &&
            availableButtonPositions.includes(store.currentTooltip?.position)
        ) {
            return (
                <TooltipWrapper
                    isOpen={true}
                    placement="top-end"
                    trigger={<UnlockButton />}
                    content={store.currentTooltip}
                />
            );
        }
        return <UnlockButton />;
    }

    return (
        <>
            <LockedLectureModal
                isOpen={store.isLockedLectureModalVisible}
                onClose={store.hideLockedLecturesModal}
            />
            {!store.isLoading && (
                <div data-testid="trial-footer" className={styles['trial-footer']}>
                    <Image
                        alt={Config.brand.product_name}
                        src={Config.brand.product_logo}
                        className={classNames('ufb-logo', styles['logo'])}
                        width={Math.round(34 * Config.brand.product_logo_aspect_ratio)}
                        height={34}
                    />
                    <AvailableLectures
                        availableLectures={store.availableLectures}
                        currentTooltip={store.currentTooltip}
                        usedLectures={store.usedLectures}
                    />
                    <div className={styles['timer-container']}>
                        <div data-testid="timer-text" className={styles['timer-text']}>
                            {i18n.ninterpolate(
                                '%s day left',
                                '%s days left',
                                store.activeRemainingDays,
                            )}
                        </div>
                        {store.isOwner ? renderBuyButton() : renderNudgeOwnerButton()}
                    </div>
                    <NudgeOwnerModal
                        isOpen={store.isNudgeOwnerModalVisible}
                        ownerName={store.ownerName}
                        onClose={store.hideNudgeOwnerModal}
                    />
                </div>
            )}
        </>
    );
});
