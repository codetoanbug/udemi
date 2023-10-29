import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {UnreadMessagesBadge} from '../../../badges.react-component';
import {useHeaderStore} from '../../../hooks/use-header-store';
import styles from '../mobile-nav.module.less';
import {MobileNavItem, MobileNavL1Nav, MobileNavSection} from '../mobile-nav.react-component';

export const MobileInstructorCommunicationNav = observer(() => {
    const udData = useUDData();
    const udConfig = udData.Config;
    const headerStore = useHeaderStore();
    const {instructorURLs} = headerStore;
    const {gettext} = useI18n();
    return (
        <MobileNavL1Nav id="header-toggle-side-nav-instructor-communication">
            <MobileNavSection>
                {udConfig.brand.is_discussions_enabled && (
                    <MobileNavItem href={instructorURLs.Q_AND_A}>{gettext('Q&A')}</MobileNavItem>
                )}
                {headerStore.isFeaturedQuestionsEnabled && (
                    <MobileNavItem href={instructorURLs.FEATURED_QUESTIONS}>
                        {gettext('Featured Questions')}
                    </MobileNavItem>
                )}
                {udConfig.brand.is_messaging_enabled && (
                    <MobileNavItem href={instructorURLs.MESSAGES}>
                        {gettext('Messages')}
                        <UnreadMessagesBadge className={styles['inline-notification-badge']} />
                    </MobileNavItem>
                )}
                <MobileNavItem href={instructorURLs.ASSIGNMENTS}>
                    {gettext('Assignments')}
                </MobileNavItem>
                <MobileNavItem href={instructorURLs.ANNOUNCEMENTS}>
                    {gettext('Announcements')}
                </MobileNavItem>
            </MobileNavSection>
        </MobileNavL1Nav>
    );
});
