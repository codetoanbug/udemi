import {ClientEvent} from '@udemy/event-tracking';

import {NoticeEventDetails} from 'browse/events';

interface MediaModalPopupEventDetails extends NoticeEventDetails {
    link?: string | null;
    videoDuration: number | null;
    videoCurrentTime: number | null;
}

/**
 * Fired when a user sees a modal popup notice that contains either a video or an image.
 */
export class MediaModalPopupImpressionEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    constructor({noticeId = 0, noticeType, topMembershipTargetGroupId = null}: NoticeEventDetails) {
        super('MediaModalPopupImpressionEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
    }
}

/**
 * Fired when a user clicks on the CTA button linked to a modal popup notice.
 * If an url is defined, then the CTA button redirects the user to the provided link, else
 * clicking on the CTA button closes the media modal popup
 */
export class MediaModalPopupClickEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    private link: string | null;
    private videoDuration: number | null;
    private videoCurrentTime: number | null;
    constructor({
        noticeId = 0,
        noticeType,
        topMembershipTargetGroupId = null,
        link = null,
        videoDuration = null,
        videoCurrentTime = null,
    }: MediaModalPopupEventDetails) {
        super('MediaModalPopupClickEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
        this.link = link;
        this.videoDuration = videoDuration;
        this.videoCurrentTime = videoCurrentTime;
    }
}
/**
 * Fired when a user hides a modal popup notice. User(s) can hide the modal popup by either
 * clicking on [x] hide button or by clicking anywhere outside the modal popup.
 */
export class MediaModalPopupHideEvent extends ClientEvent {
    private noticeId: NoticeEventDetails['noticeId'];
    private noticeType: NoticeEventDetails['noticeType'];
    private topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    private videoDuration: number | null;
    private videoCurrentTime: number | null;
    constructor({
        noticeId = 0,
        noticeType,
        topMembershipTargetGroupId = null,
        videoDuration = null,
        videoCurrentTime = null,
    }: MediaModalPopupEventDetails) {
        super('MediaModalPopupHideEvent');
        this.noticeId = noticeId;
        this.noticeType = noticeType;
        this.topMembershipTargetGroupId = topMembershipTargetGroupId;
        this.videoDuration = videoDuration;
        this.videoCurrentTime = videoCurrentTime;
    }
}
