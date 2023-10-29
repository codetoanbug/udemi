import Cookies from 'js-cookie';

import {generateTrackingId} from './helpers';

export const sessionIdTimeoutMillis = 30 * 60 * 1000;
export const sessionCookieKey = 'eventing_session_id';
export const udemyRootDomain = '.udemy.com';

/**
 * Keeps the event tracking session information. The event tracking session is a cookie based
 * session ID that expires with specific amount of inactivity. It stays the same as long as the user
 * is active. This class also manages the low level (serialization, read from cookie, write to
 * cookie) operations.
 */
export class EventTrackingSession {
    constructor(
        public sessionId = generateTrackingId(),
        public expirationDate = EventTrackingSession.produceSessionExpirationDate(),
    ) {}

    isExpired() {
        return Date.now() > this.expirationDate.getTime();
    }

    resetExpiration() {
        this.expirationDate = EventTrackingSession.produceSessionExpirationDate();
    }

    toString() {
        return `${this.sessionId}-${this.expirationDate.getTime()}`;
    }

    static produceSessionExpirationDate() {
        return new Date(Date.now() + sessionIdTimeoutMillis);
    }

    static readSessionFromCookie() {
        const sessionCookieValue = Cookies.get(sessionCookieKey);
        if (!sessionCookieValue) {
            return null;
        }
        const cookieParts = sessionCookieValue.split('-');
        if (cookieParts.length !== 2) {
            return null;
        }
        const sessionId = cookieParts[0];
        const expirationDateEpoch = parseInt(cookieParts[1], 10);
        if (isNaN(expirationDateEpoch)) {
            return null;
        }
        const expirationDate = new Date(expirationDateEpoch);
        return new EventTrackingSession(sessionId, expirationDate);
    }

    static disableSecureCookieForTest = false;

    static writeSessionToCookie(session: EventTrackingSession) {
        // Use Udemy root domain when possible to share session ID between sub-domains
        let cookieDomain = window.location.hostname;
        if (cookieDomain.includes(udemyRootDomain)) {
            cookieDomain = udemyRootDomain;
        }

        Cookies.set(sessionCookieKey, session.toString(), {
            expires: session.expirationDate,
            path: '/',
            domain: cookieDomain,
            sameSite: 'strict',
            secure: !EventTrackingSession.disableSecureCookieForTest,
        });
    }

    /**
     * Gets the event tracking session ID.
     *
     * Warning: Do not cache session IDs and call this function whenever needed because this method
     * signifies activity and keeps the session expiration date refreshed.
     */
    static getEventTrackingSessionId() {
        let session = EventTrackingSession.readSessionFromCookie();

        if (!session || session.isExpired()) {
            session = new EventTrackingSession();
        } else {
            session.resetExpiration();
        }
        EventTrackingSession.writeSessionToCookie(session);

        return session.sessionId;
    }
}
