import {ClientEvent} from '@udemy/event-tracking';

export const enum NoticeType {
    WEB_BANNER = 'web_banner',
    FEATURED_BANNER = 'featured_banner',
    HOME_BANNER = 'home_banner',
    MOBILE_BANNER = 'mobile_banner',
    SMART_BAR = 'smart_bar',
    UFB_SMART_BAR = 'ufb_smart_bar',
    INSTRUCTOR_BAR = 'instructor_bar',
    CART_SUCCESS_MESSAGE = 'cart_success_message',
    PURCHASE_SUCCESS_MESSAGE = 'purchase_success_message',
    FALLBACK_BANNER = 'fallback_banner',
    WEB_CAROUSEL_SLIDE = 'web_carousel_slide',
}

export interface NoticeEventDetails {
    noticeId: number;
    noticeType: string | NoticeType;
    personalizedNoticeSetId?: number | null;
    personalizedNoticeSetName?: string | null;
    topMembershipTargetGroupId?: number | null;
}

export interface BannerEventDetails extends NoticeEventDetails {
    slideNumber: number | null;
    url: string | null;
    uiRegion: string | null;
}

export class BannerImpressionEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    private personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    private slideNumber: number | null;
    constructor({
        noticeId = 0,
        noticeType,
        personalizedNoticeSetId = null,
        personalizedNoticeSetName = null,
        topMembershipTargetGroupId = null,
        slideNumber = null,
    }: BannerEventDetails) {
        super('BannerImpressionEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.personalizedNoticeSetId = personalizedNoticeSetId;
        this.personalizedNoticeSetName = personalizedNoticeSetName;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
        this.slideNumber = slideNumber;
    }
}

export class BannerClickEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    private personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    private slideNumber: number | null;
    private url: string | null;
    private uiRegion: string | null;
    constructor({
        noticeId = 0,
        noticeType,
        personalizedNoticeSetId = null,
        personalizedNoticeSetName = null,
        topMembershipTargetGroupId = null,
        slideNumber = null,
        url = null,
        uiRegion = null,
    }: BannerEventDetails) {
        super('BannerClickEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.personalizedNoticeSetId = personalizedNoticeSetId;
        this.personalizedNoticeSetName = personalizedNoticeSetName;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
        this.slideNumber = slideNumber;
        this.url = url;
        this.uiRegion = uiRegion;
    }
}

export class SmartbarImpressionEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    private personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    constructor({
        noticeId = 0,
        noticeType,
        personalizedNoticeSetId = null,
        personalizedNoticeSetName = null,
        topMembershipTargetGroupId = null,
    }: NoticeEventDetails) {
        super('SmartbarImpressionEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.personalizedNoticeSetId = personalizedNoticeSetId;
        this.personalizedNoticeSetName = personalizedNoticeSetName;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
    }
}

export class SmartbarClickEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    private personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    private url: string;
    private location: string | null;
    constructor({
        noticeId = 0,
        noticeType,
        url,
        location = 'action_url',
        personalizedNoticeSetId = null,
        personalizedNoticeSetName = null,
        topMembershipTargetGroupId = null,
    }: NoticeEventDetails & {url: string; location: string | null}) {
        super('SmartbarClickEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.personalizedNoticeSetId = personalizedNoticeSetId;
        this.personalizedNoticeSetName = personalizedNoticeSetName;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
        this.url = url;
        this.location = location;
    }
}

export class SmartbarHideEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    private personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    constructor({
        noticeId = 0,
        noticeType,
        personalizedNoticeSetId = null,
        personalizedNoticeSetName = null,
        topMembershipTargetGroupId = null,
    }: NoticeEventDetails) {
        super('SmartbarHideEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.personalizedNoticeSetId = personalizedNoticeSetId;
        this.personalizedNoticeSetName = personalizedNoticeSetName;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
    }
}

export class DealOptInEvent extends ClientEvent {
    private noticeId: number;
    constructor(noticeId = 0) {
        super('DealOptInEvent');
        this.noticeId = noticeId;
    }
}
