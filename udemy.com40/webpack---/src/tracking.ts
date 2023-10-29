import {ClickEvent, Tracker} from '@udemy/event-tracking';

import {consentChangeHandlers} from './onetrust-consent-change-handlers';
import {ConsentEvent} from './types';

export const ONETRUST_TRACKING = {
    BANNER_OK: 'onetrust.banner.ok', // User selects OneTrust banner `OK` button
    CENTER_CONFIRM: 'onetrust.preferencecenter.confirm', // User confirms settings in OneTrust preference center
    CENTER_ACCEPT_ALL: 'onetrust.preferencecenter.acceptall', // User accepts all cookies in OneTrust preference center
    FOOTER_LINK: 'onetrust.footer.settings', // User selects footer link to launch OneTrust preference center
};

export function handleOneTrustRelatedClicks(ev: Event) {
    // Qualify click event to OneTrust element
    let componentName: string | boolean = false;
    const el = ev.target as Element;
    const elDataPurpose = el.getAttribute('data-purpose');
    const elClassName = el.getAttribute('class') || '';
    const elId = el.id;

    if (elId === 'onetrust-accept-btn-handler') {
        componentName = ONETRUST_TRACKING.BANNER_OK;
    } else if (elClassName.includes('save-preference-btn-handler')) {
        componentName = ONETRUST_TRACKING.CENTER_CONFIRM;
    } else if (elId === 'accept-recommended-btn-handler') {
        componentName = ONETRUST_TRACKING.CENTER_ACCEPT_ALL;
    } else if (elDataPurpose === 'footer.links.cookie_preferences') {
        componentName = ONETRUST_TRACKING.FOOTER_LINK;
    } else {
        // no-op
        return false;
    }

    Tracker.publishEvent(
        new ClickEvent({
            componentName,
        }),
    );
    return true;
}

export function processOnConsentChanged() {
    // Save any events already added
    const consentChangedEvents = window.__onConsentChanged || [];
    // Replace `__onConsentChanged` with API
    window.__onConsentChanged = {
        push: (consentEvent: ConsentEvent) => {
            for (const i in consentChangeHandlers) {
                try {
                    consentChangeHandlers[i](consentEvent);
                } catch (e) {
                    // Ignore failing handlers
                }
            }
        },
    };
    // Process any consent changed events already added
    if (consentChangedEvents && (consentChangedEvents.length as number) > 0) {
        for (const i in consentChangedEvents as Array<ConsentEvent>) {
            const consentEvent: ConsentEvent = consentChangedEvents[
                i as keyof typeof consentChangedEvents
            ] as unknown as ConsentEvent;
            window.__onConsentChanged.push(consentEvent);
        }
    }
}

export function setUpTrackingForOneTrust() {
    if (typeof window === undefined || window.isOneTrustActive === false) {
        return;
    }
    // Implement global click handler to capture and process events related to OneTrust
    window.addEventListener('click', handleOneTrustRelatedClicks, {
        passive: true,
        capture: true,
    });
    processOnConsentChanged();
}
