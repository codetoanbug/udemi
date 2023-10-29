import {observable} from 'mobx';

import udExternalLoaders from 'utils/ud-external-loaders';

declare global {
    interface Window {
        google: any;
    }
}
export class GoogleCalendarAuthStore {
    @observable.ref tokenClient: any | null = null;
    accessToken: {
        access_token: string | null;
        scope: string | null;
        expires_in: number | null;
        error: string | null;
    } | null = null;

    googleClientId: string | null = null;

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    scopes = 'https://www.googleapis.com/auth/calendar.events';

    constructor(googleClientId: string) {
        this.googleClientId = googleClientId;
    }

    updateAccessToken(tokenResponse: any) {
        this.accessToken = {
            access_token: tokenResponse.access_token,
            scope: tokenResponse.scope,
            expires_in: tokenResponse.expires_in,
            error: tokenResponse.error,
        };
    }

    loadGoogleAuth() {
        udExternalLoaders.loadGoogleAuth(() => {
            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: this.googleClientId,
                scope: this.scopes,
                callback: '',
                error_callback: '',
                ux_mode: 'popup',
            });
        });
    }
}
