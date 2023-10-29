import {Tracker} from '@udemy/event-tracking';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useState, MouseEvent} from 'react';

import {ReportAbuseDesktop, ReportAbuseMobile} from 'course-landing-page/components/report-abuse';
import {ReviewReportEvent} from 'course-landing-page/events';
import HelpfulnessStore from 'course-reviews/display/helpfulness.mobx-store';

import styles from './review-report.less';

interface ReviewReportProps {
    helpfulnessStore: HelpfulnessStore;
    frontendTrackingId?: string;
    reviewableObjectId: number;
    reviewableObjectType: string;
    isMobile: boolean;
    isFeaturedReview?: boolean;
    shouldUseDeattachedDropdown?: boolean;
    shouldClosePopper?: boolean;
    placement?: 'bottom-end' | 'top-end';
    reviewAuthorName: string;
}

export const ReviewReport = observer(
    ({
        helpfulnessStore,
        frontendTrackingId,
        reviewableObjectId,
        reviewableObjectType,
        isMobile,
        isFeaturedReview = false,
        shouldUseDeattachedDropdown = false,
        shouldClosePopper = false,
        placement = 'bottom-end',
        reviewAuthorName,
    }: ReviewReportProps) => {
        const [isOpen, setIsOpen] = useState(false);
        const ReportAbuseComponent = isMobile ? ReportAbuseMobile : ReportAbuseDesktop;

        useEffect(() => {
            if (shouldClosePopper && isOpen) {
                setIsOpen(false);
            }
        }, [isOpen, shouldClosePopper]);

        const handleReportClick = (event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            if (frontendTrackingId) {
                Tracker.publishEvent(
                    new ReviewReportEvent(
                        frontendTrackingId,
                        helpfulnessStore.reviewId,
                        isFeaturedReview,
                        reviewableObjectId,
                        reviewableObjectType,
                    ),
                );
            }
        };

        return (
            <Dropdown
                useDrawer={false}
                isOpen={isOpen}
                onToggle={setIsOpen}
                menuWidth="auto"
                detachFromTarget={shouldUseDeattachedDropdown}
                placement={placement}
                trigger={
                    <IconButton udStyle="ghost">
                        <MoreIcon
                            label={interpolate(
                                gettext('Additional actions for review by %(name)s'),
                                {name: reviewAuthorName},
                                true,
                            )}
                            color="neutral"
                        />
                    </IconButton>
                }
            >
                <Dropdown.Menu>
                    <Dropdown.MenuItem componentClass="div" className={styles['menu-item']}>
                        <ReportAbuseComponent
                            className={classNames('ud-heading-sm', styles['report-abuse-label'])}
                            objectId={helpfulnessStore.reviewId}
                            objectType="coursereview"
                            onClick={handleReportClick}
                            size="medium"
                            text={gettext('Report')}
                        />
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </Dropdown>
        );
    },
);
