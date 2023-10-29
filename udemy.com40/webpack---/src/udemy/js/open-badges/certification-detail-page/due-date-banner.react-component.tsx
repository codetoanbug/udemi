import {Tracker} from '@udemy/event-tracking';
import {useDeviceType} from '@udemy/hooks';
import {LocalizedHtml, useI18n} from '@udemy/i18n';
import Calendar30Icon from '@udemy/icons/dist/calendar-30.ud-icon';
import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import SuccessOutlineIcon from '@udemy/icons/dist/success-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {DatePicker, FormGroup} from '@udemy/react-form-components';
import {AlertBannerProps, ToasterStore as toasterStore} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
    BadgeDueDateEdited,
    BadgeDueDateRemoved,
    BadgeDueDateSelectedReadyForExam,
    BadgeDueDateSet,
} from 'course-taking/badge-sidebar/events';
import {UserAssignmentStore} from 'subscription-retention/stores/user-assignment-store';
import {
    AssignmentRelatedObjectType,
    UserAssignment,
} from 'subscription-retention/types/user-assignment';

import styles from '../../course-taking/badge-sidebar/badge-sidebar.less';
import {CertificationModel} from '../certification.mobx-model';
import detailStyles from '../detail-page.less';

interface BadgeSidebarProps {
    badge: CertificationModel;
}

const enum DueDateBannerStates {
    INITIAL,
    LOADING,
    DATE_EDIT,
}

function showSuccessToast(title: string, body: string | undefined = undefined) {
    const bannerProps: AlertBannerProps = {
        udStyle: 'success',
        title,
        body,
        showCta: false,
        dismissButtonProps: false,
    };
    toasterStore.addAlertBannerToast(bannerProps, {autoDismiss: true});
}

export const DueDateBanner: React.FunctionComponent<BadgeSidebarProps> = ({badge}) => {
    const userAssignmentStore = useMemo(() => new UserAssignmentStore(), []);
    const [state, setState] = useState(DueDateBannerStates.LOADING);
    const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>();
    const {Config} = useUDData();

    const {gettext, locale} = useI18n();
    const userLocale = locale ? locale.replace('_', '-') : 'en-US';

    function titleText() {
        if (assignedDueDate) {
            if (daysDiff < 0) {
                return gettext('Your due date passed');
            } else if (daysDiff < 1) {
                return gettext('Today is your due day!');
            } else if (daysDiff < 2) {
                return gettext('Tomorrow is your due day!');
            } else if (daysDiff < 14) {
                return (
                    <LocalizedHtml
                        html={interpolate(
                            gettext('<span class="bold">%(timeLeft)s days</span> till due date'),
                            {timeLeft: daysDiff},
                            true,
                        )}
                        interpolate={{
                            large: <span className="ud-text-bold" />,
                        }}
                    />
                );
            }
            return (
                <LocalizedHtml
                    html={interpolate(
                        gettext('<span class="bold">%(timeLeft)s weeks</span> till due date'),
                        {timeLeft: Math.round(daysDiff / 7)},
                        true,
                    )}
                    interpolate={{
                        large: <span className="ud-text-bold" />,
                    }}
                />
            );
        }

        return gettext('Set a certification due date');
    }

    function setDueDate() {
        if (!selectedDueDate) {
            return;
        }
        setState(DueDateBannerStates.LOADING);
        const dueDate = `${selectedDueDate.getFullYear()}-${
            selectedDueDate.getMonth() + 1
        }-${selectedDueDate.getDate()}`;
        const userAssignment: UserAssignment = {
            relatedObjectId: parseInt(badge.id, 10),
            relatedObjectType: AssignmentRelatedObjectType.OPEN_BADGE,
            orgId,
            dueDate,
            assignedBy: userId,
            assignedTo: userId,
        };
        setSelectedDueDate(undefined);

        if (assignment) {
            userAssignmentStore.updateUserAssignment(assignment, dueDate).finally(() => {
                loadUserAssignments();
                Tracker.publishEvent(
                    new BadgeDueDateEdited({
                        badgeId: parseInt(badge.id, 10),
                    }),
                );
            });
        } else {
            userAssignmentStore.createUserAssignment(userAssignment).finally(() => {
                loadUserAssignments();
            });
            Tracker.publishEvent(
                new BadgeDueDateSet({
                    badgeId: parseInt(badge.id, 10),
                }),
            );
        }
    }

    const isMobile = useDeviceType() === 'mobile';
    const userId = UD ? UD.me?.id : 0;
    const orgId = Config.brand.organization ? Config.brand.organization.id : 0;

    const loadUserAssignments = useCallback(() => {
        userAssignmentStore.loadUserAssignments(orgId).finally(() => {
            setState(DueDateBannerStates.INITIAL);
        });
    }, [userAssignmentStore, orgId]);

    useEffect(() => {
        let currentlyRendered = true;
        userAssignmentStore.load().finally(() => {
            if (currentlyRendered) {
                loadUserAssignments();
            }
        });
        return () => {
            currentlyRendered = false;
        };
    }, [loadUserAssignments, userAssignmentStore]);

    if (state === DueDateBannerStates.LOADING) {
        return (
            <div className={classNames(styles.loader, 'ud-container')}>
                <Loader size="large" block={true} />
            </div>
        );
    }

    const assignment = userAssignmentStore.userAssignments.find((assignment) => {
        return (
            assignment.relatedObjectType === AssignmentRelatedObjectType.OPEN_BADGE &&
            assignment.relatedObjectId.toString() == badge.id
        );
    });

    if (
        !userAssignmentStore.badgeDueDateTrackerEnabled ||
        assignment?.assignedTo !== assignment?.assignedBy ||
        orgId === 0 ||
        userId === 0
    ) {
        return <></>;
    }

    const dateSplit = assignment
        ? assignment.dueDate.split('-').map((x) => parseInt(x, 10))
        : undefined;
    const assignedDueDate = dateSplit
        ? new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], 23, 59, 59)
        : undefined;
    const daysDiff = assignedDueDate
        ? Math.round((assignedDueDate.valueOf() - new Date().valueOf()) / (1000 * 3600 * 24))
        : 0;

    return (
        <div className={classNames(detailStyles['badge-detail-container'], 'ud-container')}>
            <div className={classNames(detailStyles['badge-detail-info-container'])}>
                <div className={classNames(detailStyles['icon-container'])}>
                    <Calendar30Icon
                        label={false}
                        size="large"
                        className={classNames(detailStyles['card-icon'], detailStyles.assessment)}
                    />
                </div>
                <div>
                    <div className={classNames('ud-heading-md')}>{titleText()}</div>
                    {assignedDueDate && (
                        <div className={classNames('ud-text-sm', styles['details-page-date-edit'])}>
                            <div>
                                {interpolate(
                                    gettext('Current due date: %(date)s'),
                                    {
                                        date: assignedDueDate.toLocaleDateString(userLocale, {
                                            month: 'short',
                                            year: 'numeric',
                                            day: 'numeric',
                                        }),
                                    },
                                    true,
                                )}
                            </div>
                            {state !== DueDateBannerStates.DATE_EDIT && (
                                <Button
                                    udStyle="link"
                                    typography="ud-text-sm"
                                    size="small"
                                    onClick={() => {
                                        setState(DueDateBannerStates.DATE_EDIT);
                                    }}
                                    data-purpose="set-date"
                                >
                                    <EditIcon
                                        color="info"
                                        size="small"
                                        label={gettext('Set Date')}
                                    />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {state === DueDateBannerStates.DATE_EDIT || !assignment ? (
                <FormGroup
                    label={gettext('When do you want to be ready for your exam?')}
                    labelProps={{className: 'ud-sr-only'}}
                    className={styles['details-page-date-picker']}
                >
                    <div className={styles['date-picker-container']}>
                        <DatePicker
                            min={'TODAY'}
                            value={selectedDueDate ?? assignedDueDate ?? undefined}
                            size="medium"
                            onChange={setSelectedDueDate}
                            onCloseCalendar={setDueDate}
                        />
                        {isMobile && (
                            <Button
                                udStyle="primary"
                                typography="ud-text-sm"
                                disabled={!selectedDueDate}
                                size="medium"
                                onClick={setDueDate}
                            >
                                {gettext('Save')}
                            </Button>
                        )}
                    </div>
                </FormGroup>
            ) : (
                <div
                    className={classNames(
                        styles['badge-action-buttons'],
                        styles['details-page-buttons'],
                    )}
                >
                    <Button
                        udStyle="link"
                        typography="ud-text-md"
                        size="medium"
                        onClick={() => {
                            if (assignment) {
                                setState(DueDateBannerStates.LOADING);
                                userAssignmentStore.deleteUserAssignment(assignment).finally(() => {
                                    loadUserAssignments();
                                    showSuccessToast(
                                        gettext('Congratulations!'),
                                        gettext(
                                            'You stayed on track and met your certification preparation goals. Good luck on your exam!',
                                        ),
                                    );
                                });

                                Tracker.publishEvent(
                                    new BadgeDueDateSelectedReadyForExam({
                                        badgeId: parseInt(badge.id, 10),
                                    }),
                                );
                            }
                        }}
                        data-purpose="mark-ready-for-exam"
                    >
                        <SuccessOutlineIcon
                            color="inherit"
                            size="small"
                            className={classNames(detailStyles['badge-link-icon'])}
                            label={gettext('Ready for the exam')}
                        />
                        <p className={'ud-heading-md'}>{gettext('Ready for the exam')}</p>
                    </Button>
                    <Button
                        udStyle="link"
                        typography="ud-text-md"
                        size="medium"
                        onClick={() => {
                            if (assignment) {
                                setState(DueDateBannerStates.LOADING);
                                userAssignmentStore.deleteUserAssignment(assignment).finally(() => {
                                    loadUserAssignments();
                                    showSuccessToast(gettext('Due date canceled'));
                                });
                                Tracker.publishEvent(
                                    new BadgeDueDateRemoved({
                                        badgeId: parseInt(badge.id, 10),
                                    }),
                                );
                            }
                        }}
                        data-purpose="clear-date"
                    >
                        <CancelIcon
                            color="inherit"
                            size="small"
                            label={gettext('Cancel due date')}
                            className={classNames(detailStyles['badge-link-icon'])}
                        />
                        <p className={'ud-heading-md'}>{gettext('Cancel due date')}</p>
                    </Button>
                </div>
            )}
        </div>
    );
};
