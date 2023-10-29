import {action, computed} from 'mobx';

import {discoveryTracker} from 'browse/tracking';
import serverOrClient from 'utils/server-or-client';
import udLink from 'utils/ud-link';
import udMe from 'utils/ud-me';

/**
 * Store for gifting course
 */
export class GiftCourseStore {
    constructor(private courseId: number, private courseTrackingId: string) {}

    /**
     * Determines if gifting course is loading
     * @returns True if gift course is loading
     */
    @computed get isLoading() {
        return udMe.isLoading;
    }

    /**
     * Determines if gifting course is disabled
     * @returns True if gifting course is disabled
     */
    isDisabled(giftThisCourseLink: string | undefined) {
        return !giftThisCourseLink;
    }

    /**
     * Provides url for gifting course
     */
    getGiftThisCourseLink(giftCourseLink: string | undefined) {
        return udMe.id
            ? giftCourseLink
            : udLink.toAuth({
                  showLogin: false,
                  nextUrl: giftCourseLink,
                  returnUrl: (serverOrClient.global as Window)?.location?.href || '',
                  source: 'course_landing_page',
                  responseType: 'html',
                  showInstructorSignup: false,
                  locale: null,
                  nextPath: null,
                  popupTrackingIdentifier: null,
              });
    }

    /**
     * Actions to perform when gifting course has been clicked
     */
    @action handleGiftCourseClick(uiRegion: string) {
        discoveryTracker.trackGiftBuyablesStartEvent(
            [
                {
                    type: 'course',
                    id: this.courseId,
                    trackingId: this.courseTrackingId,
                },
            ],
            uiRegion,
        );
    }
}
