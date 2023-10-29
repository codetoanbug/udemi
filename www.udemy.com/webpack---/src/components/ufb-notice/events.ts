import {ClientEvent} from '@udemy/event-tracking';

/**
 This event is fired when a user clicks on any UFB notice link on a marketplace page
 */
export class UFBNoticeClickEvent extends ClientEvent {
    private locale;
    private placement;

    constructor({locale, placement}: {locale: string; placement: string}) {
        super('UFBNoticeClickEvent');
        this.locale = locale;
        this.placement = placement;
    }

    get eventLocale() {
        return this.locale;
    }

    get eventPlacement() {
        return this.placement;
    }
}

/**
 This event is fired when a user sees any UFB notice link on a marketplace page
 **/
export class UFBNoticeImpressionEvent extends ClientEvent {
    private locale: string;
    private placement: string;
    private url: string | null;

    constructor({
        locale,
        placement,
        url = null,
    }: {
        locale: string;
        placement: string;
        url?: string | null;
    }) {
        super('UFBNoticeImpressionEvent');
        this.locale = locale;
        this.placement = placement;
        this.url = url;
    }

    get eventLocale() {
        return this.locale;
    }

    get eventPlacement() {
        return this.placement;
    }
}
