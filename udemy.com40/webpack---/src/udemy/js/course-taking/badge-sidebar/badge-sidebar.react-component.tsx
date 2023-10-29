import {Tracker} from '@udemy/event-tracking';
import {useDeviceType} from '@udemy/hooks';
import {LocalizedHtml} from '@udemy/i18n';
import CancelIcon from '@udemy/icons/dist/cancel.ud-icon';
import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import ReloadIcon from '@udemy/icons/dist/reload.ud-icon';
import SuccessOutlineIcon from '@udemy/icons/dist/success-outline.ud-icon';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button, IconButton, Image} from '@udemy/react-core-components';
import {DatePicker, FormGroup} from '@udemy/react-form-components';
import {Badge, Confetti} from '@udemy/react-messaging-components';
import {TextSkeleton} from '@udemy/react-reveal-components';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React, {useEffect, useState} from 'react';

import {CertificationModel} from 'open-badges/certification.mobx-model';
import {UserAssignmentStore} from 'subscription-retention/stores/user-assignment-store';
import {
    AssignmentRelatedObjectType,
    UserAssignment,
} from 'subscription-retention/types/user-assignment';
import udExpiringLocalStorage from 'utils/ud-expiring-local-storage';

import styles from './badge-sidebar.less';
import {
    BadgeDueDateEdited,
    BadgeDueDateRemoved,
    BadgeDueDateSelectedReadyForExam,
    BadgeDueDateSet,
    BadgeDueDateTrackerCollapsed,
    BadgeDueDateTrackerExpanded,
    BadgeDueDateTrackerPresented,
    BadgeDueDateTrackerRefreshed,
    BadgeSelected,
} from './events';

interface BadgeSidebarProps {
    badge: CertificationModel;
    userId: number;
    courseId: number;
}

const enum BadgeSidebarStates {
    INITIAL,
    LOADING,
    DATE_SET,
    DATE_REMOVED,
    MARKED_READY,
}

export const BadgeSidebar: React.FunctionComponent<BadgeSidebarProps> = React.memo(
    ({badge, userId, courseId}) => {
        const [userAssignmentStore] = useState(() => new UserAssignmentStore());
        const [showExpanded, setShowExpanded] = useState(false);
        const [state, setState] = useState(BadgeSidebarStates.LOADING);
        const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>();
        const {Config} = useUDData();

        useEffect(() => {
            document.getElementById('main-header')?.classList.add(styles['fade-in']);
        });

        function titleText() {
            if (state === BadgeSidebarStates.DATE_REMOVED) {
                return gettext('Your due date has been removed');
            }

            if (state === BadgeSidebarStates.DATE_SET) {
                return gettext('Date set!');
            }

            if (state === BadgeSidebarStates.MARKED_READY) {
                return gettext('Congratulations!');
            }

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
                                gettext(
                                    '<span class="bold">%(timeLeft)s days</span> till due date',
                                ),
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

        function subtitleText() {
            if (
                state === BadgeSidebarStates.DATE_REMOVED ||
                state === BadgeSidebarStates.DATE_SET
            ) {
                return '';
            }

            if (state === BadgeSidebarStates.MARKED_READY) {
                return gettext(
                    'You stayed on track and met your certification preparation goals. Good luck on your exam!',
                );
            }

            if (assignedDueDate && daysDiff < 2) {
                return interpolate(
                    gettext('Are you prepared to take the %(certName)s exam?'),
                    {certName: badge.name},
                    true,
                );
            }
            return badge.name;
        }

        function setDueDate() {
            if (!selectedDueDate) {
                return;
            }
            setState(BadgeSidebarStates.DATE_SET);
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
            setShowExpanded(false);

            if (assignment) {
                userAssignmentStore.updateUserAssignment(assignment, dueDate).finally(() => {
                    loadAfterDateSet();
                    Tracker.publishEvent(
                        new BadgeDueDateEdited({
                            badgeId: parseInt(badge.id, 10),
                        }),
                    );
                });
            } else {
                userAssignmentStore.createUserAssignment(userAssignment).finally(() => {
                    loadAfterDateSet();
                });
                Tracker.publishEvent(
                    new BadgeDueDateSet({
                        badgeId: parseInt(badge.id, 10),
                    }),
                );
            }
        }

        function initialLoadUserAssignments() {
            userAssignmentStore.loadUserAssignments(orgId).finally(() => {
                const isAssignedADate = userAssignmentStore.userAssignments.length > 0;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dateInFuture = isAssignedADate
                    ? new Date(userAssignmentStore.userAssignments[0].dueDate) >= today
                    : false;
                const eventState = isAssignedADate
                    ? dateInFuture
                        ? 'date_set'
                        : 'date_passed'
                    : 'zero_date';
                Tracker.publishEvent(
                    new BadgeDueDateTrackerPresented({
                        badgeId: parseInt(badge.id, 10),
                        state: eventState,
                    }),
                );
                setState(BadgeSidebarStates.INITIAL);
            });
        }

        function loadUserAssignments() {
            document.getElementById('main-header')?.classList.remove(styles['fade-in']);
            setState(BadgeSidebarStates.LOADING);
            userAssignmentStore.loadUserAssignments(orgId).finally(() => {
                setState(BadgeSidebarStates.INITIAL);
            });
        }

        function loadAfterDateSet() {
            Promise.all([
                userAssignmentStore.loadUserAssignments(orgId),
                new Promise((resolve) => setTimeout(resolve, 1000)),
            ]).finally(() => {
                document.getElementById('main-header')?.classList.remove(styles['fade-in']);
                setTimeout(() => setState(BadgeSidebarStates.INITIAL), 250);
            });
        }

        function renderHeader() {
            return (
                <div className={styles['badge-details']}>
                    {state === BadgeSidebarStates.DATE_REMOVED ? (
                        <TickIcon
                            color="neutral"
                            size="medium"
                            label={gettext('Action confirmed')}
                        />
                    ) : (
                        <Image
                            className={styles['certificate-image']}
                            alt={badge.name}
                            src={badge.image.id}
                        />
                    )}
                    <div className={classNames([styles.header])} id={'main-header'}>
                        <div className={classNames('ud-heading-md', [styles.title])}>
                            {titleText()}
                        </div>
                        <div className={classNames('ud-text-xs', [styles.details])}>
                            {subtitleText()}
                        </div>
                        {state === BadgeSidebarStates.INITIAL && showExpanded && (
                            <Badge className={styles['beta-badge']}>{gettext('Beta')}</Badge>
                        )}
                        {state === BadgeSidebarStates.MARKED_READY && (
                            <div className={styles['badge-action-buttons']}>
                                <Button
                                    udStyle="link"
                                    typography="ud-text-sm"
                                    size="small"
                                    componentClass="a"
                                    href={`/open-badges/${badge.id}`}
                                    onClick={() => {
                                        Tracker.publishEvent(
                                            new BadgeSelected({
                                                badgeId: parseInt(badge.id, 10),
                                                uiRegion: 'badge_due_date_tracker',
                                            }),
                                        );
                                    }}
                                    data-purpose="view-badge-details"
                                >
                                    <span className={'ud-text-bold'}>
                                        {gettext('View badge details')}
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        function renderExpandedContent() {
            if (state === BadgeSidebarStates.INITIAL && showExpanded) {
                if (assignedDueDate) {
                    return (
                        <>
                            <div className={styles['badge-details']}>
                                <FormGroup
                                    label={gettext('Extend your due date')}
                                    labelProps={{className: 'ud-text-md'}}
                                >
                                    <div className={styles['date-picker-container']}>
                                        <DatePicker
                                            min={'TODAY'}
                                            size="medium"
                                            value={selectedDueDate ?? assignedDueDate}
                                            onChange={setSelectedDueDate}
                                            onCloseCalendar={() => {
                                                document
                                                    .getElementById('main-header')
                                                    ?.classList.remove(styles['fade-in']);
                                                setTimeout(() => setDueDate(), 250);
                                            }}
                                        />
                                        {isMobile && (
                                            <Button
                                                udStyle="primary"
                                                typography="ud-text-sm"
                                                disabled={!selectedDueDate}
                                                size="medium"
                                                onClick={() => {
                                                    document
                                                        .getElementById('main-header')
                                                        ?.classList.remove(styles['fade-in']);
                                                    setTimeout(() => setDueDate(), 250);
                                                }}
                                            >
                                                {gettext('Save')}
                                            </Button>
                                        )}
                                    </div>
                                </FormGroup>
                            </div>
                            <div className={styles['badge-details']}>
                                <div className={styles['badge-action-buttons']}>
                                    <Button
                                        udStyle="link"
                                        typography="ud-text-sm"
                                        size="small"
                                        onClick={() => {
                                            document
                                                .getElementById('main-header')
                                                ?.classList.remove(styles['fade-in']);
                                            setTimeout(
                                                () => setState(BadgeSidebarStates.MARKED_READY),
                                                250,
                                            );
                                            if (assignment) {
                                                userAssignmentStore.deleteUserAssignment(
                                                    assignment,
                                                );
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
                                            label={gettext('Ready for the exam')}
                                        />
                                        <p className={'ud-text-bold'}>
                                            {gettext('Ready for the exam')}
                                        </p>
                                    </Button>
                                    <Button
                                        udStyle="link"
                                        typography="ud-text-sm"
                                        size="small"
                                        onClick={() => {
                                            document
                                                .getElementById('main-header')
                                                ?.classList.remove(styles['fade-in']);
                                            setTimeout(
                                                () => setState(BadgeSidebarStates.DATE_REMOVED),
                                                250,
                                            );
                                            if (assignment) {
                                                userAssignmentStore.deleteUserAssignment(
                                                    assignment,
                                                );
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
                                        />
                                        <p className={'ud-text-bold'}>
                                            {gettext('Cancel due date')}
                                        </p>
                                    </Button>
                                </div>
                            </div>
                        </>
                    );
                }
                return (
                    <div className={styles['badge-details']}>
                        <FormGroup
                            label={gettext('When do you want to be ready for your exam?')}
                            labelProps={{className: 'ud-text-md'}}
                        >
                            <div className={styles['date-picker-container']}>
                                <DatePicker
                                    min={'TODAY'}
                                    size="medium"
                                    onChange={setSelectedDueDate}
                                    onCloseCalendar={() => {
                                        document
                                            .getElementById('main-header')
                                            ?.classList.remove(styles['fade-in']);
                                        setTimeout(() => setDueDate(), 250);
                                    }}
                                />
                                {isMobile && (
                                    <Button
                                        udStyle="primary"
                                        typography="ud-text-sm"
                                        disabled={!selectedDueDate}
                                        size="medium"
                                        onClick={() => {
                                            document
                                                .getElementById('main-header')
                                                ?.classList.remove(styles['fade-in']);
                                            setTimeout(() => setDueDate(), 250);
                                        }}
                                    >
                                        {gettext('Save')}
                                    </Button>
                                )}
                            </div>
                        </FormGroup>
                    </div>
                );
            }
            return <></>;
        }

        function renderActionButton() {
            if (state !== BadgeSidebarStates.INITIAL) {
                return (
                    <IconButton
                        udStyle="ghost"
                        size="medium"
                        disabled={false}
                        onClick={() => {
                            loadUserAssignments();
                            Tracker.publishEvent(
                                new BadgeDueDateTrackerRefreshed({
                                    badgeId: parseInt(badge.id, 10),
                                }),
                            );
                        }}
                        data-purpose="expand-badge-details-button"
                        className={styles.expand}
                    >
                        <ReloadIcon color="neutral" size="medium" label={gettext('Refresh')} />
                    </IconButton>
                );
            }
            return (
                <IconButton
                    udStyle="ghost"
                    size="medium"
                    disabled={false}
                    onClick={() => {
                        setShowExpanded(!showExpanded);
                        if (showExpanded) {
                            Tracker.publishEvent(
                                new BadgeDueDateTrackerCollapsed({
                                    badgeId: parseInt(badge.id, 10),
                                }),
                            );
                        } else {
                            Tracker.publishEvent(
                                new BadgeDueDateTrackerExpanded({
                                    badgeId: parseInt(badge.id, 10),
                                }),
                            );
                        }
                    }}
                    data-purpose="collapse-badge-details-button"
                    className={styles.expand}
                >
                    {showExpanded ? (
                        <CollapseIcon color="neutral" size="medium" label={gettext('Collapse')} />
                    ) : (
                        <ExpandIcon color="neutral" size="medium" label={gettext('Expand')} />
                    )}
                </IconButton>
            );
        }

        const isMobile = useDeviceType() === 'mobile';

        const orgId = Config.brand.organization ? Config.brand.organization.id : 0;
        useEffect(initialLoadUserAssignments, []);

        if (state === BadgeSidebarStates.LOADING) {
            return (
                <div className={styles['badge-container']}>
                    <TextSkeleton withTitle={true} lineCountPerParagraph={3} />
                </div>
            );
        }

        const BADGE_VIEW_EXPIRATION = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const localStorage = udExpiringLocalStorage(
            'badge-side-bar',
            'view',
            BADGE_VIEW_EXPIRATION,
        );

        if (!showExpanded && !localStorage.get(badge.id)) {
            localStorage.set(badge.id, true);
            setShowExpanded(true);
        }

        const courseAssignment = userAssignmentStore.userAssignments.find((assignment) => {
            return (
                assignment.relatedObjectType === AssignmentRelatedObjectType.COURSE &&
                assignment.relatedObjectId === courseId &&
                assignment.dueDate
            );
        });

        const assignment = userAssignmentStore.userAssignments.find((assignment) => {
            return (
                assignment.relatedObjectType === AssignmentRelatedObjectType.OPEN_BADGE &&
                assignment.relatedObjectId.toString() == badge.id
            );
        });

        const dateSplit = assignment
            ? assignment.dueDate.split('-').map((x) => parseInt(x, 10))
            : undefined;
        const assignedDueDate = dateSplit
            ? new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], 23, 59, 59)
            : undefined;
        const daysDiff = assignedDueDate
            ? Math.round((assignedDueDate.valueOf() - new Date().valueOf()) / (1000 * 3600 * 24))
            : 0;

        if (courseAssignment || assignment?.assignedTo !== assignment?.assignedBy) {
            return <></>;
        }

        return (
            <div
                className={classNames(
                    styles['badge-container'],
                    state === BadgeSidebarStates.MARKED_READY ? styles['hidden-overflow'] : false,
                )}
            >
                {renderActionButton()}
                {renderHeader()}
                {renderExpandedContent()}
                {state === BadgeSidebarStates.MARKED_READY && (
                    <div className={styles['confetti-container']}>
                        <Confetti width={600} height={200} />
                    </div>
                )}
            </div>
        );
    },
);
