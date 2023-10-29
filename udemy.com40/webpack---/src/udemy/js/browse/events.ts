import {CourseBadgeFamily} from '@udemy/browse-course';
import {ClientEvent} from '@udemy/event-tracking';
import {getRequestData} from '@udemy/shared-utils';

import {CollectionTypes} from 'browse/lib/constants';
import {CourseAnalyticsEntity} from 'course-taking/events-v2';
import {LectureType} from 'course-taking/lecture-view/events';

/**
 * Provides additional properties
 * for any object that can be tracked
 */
interface TrackableObject {
    /**
     * tracking ID of object
     */
    trackingId: string;
}

/**
 * A minimal representation of a buyable, or purchasable, item
 * used for event tracking
 */
interface Buyable {
    /**
     * Unique ID for given "type" of buyable
     */
    id: number;
    /**
     * Type of buyable
     */
    type: 'course' | 'subscription';
}

export type TrackableBuyable = Buyable & TrackableObject;

interface TrackableCourseBadge {
    family: CourseBadgeFamily;
}

/**
 * Auto Complete Item for eventing
 */
interface AutoCompleteItem extends TrackableObject {
    phrase: string;
    type: 'course' | 'instructor' | 'search_log';
    position: number | null;
}

export const enum BackendSourceOptions {
    DISCOVERY = 'discovery',
    TAUGHT_COURSES = 'taught_courses',
    USER_PROFILE_COURSES = 'user_profile_courses',
    USER_WISHLISTED_COURSES = 'user_wishlisted_courses',
    USER_COLLECTIONS = 'user_collections',
    RELATED_LECTURES = 'related_lectures',
    SHOPPING_CARTS = 'shopping_carts',
    DISCOVERY_ALL_COURSES = 'discovery_all_courses',
    SEARCH_RECOMMENDATIONS = 'search_recommendations',
}
export const enum LearningProductType {
    COURSE = 'course',
}
export interface LearningProduct extends TrackableObject {
    /**
     * Id of the learning product such as course id etc.
     */
    id: number;

    /**
     * Type of the learning product
     */
    type: LearningProductType;
}

/**
 * Fired when a discovery item is seen by a user
 */
class DiscoveryItemImpressionEvent extends ClientEvent {
    private id: number;
    private type: string;
    private trackingId: string;
    private serveTrackingId: string;
    private backendSource: BackendSourceOptions;
    private position: number;
    private badges: TrackableCourseBadge[] | null;
    private relatedSourceId: string | null;
    private relatedSourceType: string | null;

    static backendSourceOptions = {
        DISCOVERY: BackendSourceOptions.DISCOVERY,
        TAUGHT_COURSES: BackendSourceOptions.TAUGHT_COURSES,
        USER_PROFILE_COURSES: BackendSourceOptions.USER_PROFILE_COURSES,
        USER_WISHLISTED_COURSES: BackendSourceOptions.USER_WISHLISTED_COURSES,
        USER_COLLECTIONS: BackendSourceOptions.USER_COLLECTIONS,
        RELATED_LECTURES: BackendSourceOptions.RELATED_LECTURES,
        SHOPPING_CARTS: BackendSourceOptions.SHOPPING_CARTS,
        DISCOVERY_ALL_COURSES: BackendSourceOptions.DISCOVERY_ALL_COURSES,
        SEARCH_RECOMMENDATIONS: BackendSourceOptions.SEARCH_RECOMMENDATIONS,
    };

    constructor({
        id,
        type,
        trackingId,
        serveTrackingId,
        backendSource,
        position,
        badgeFamilies,
        relatedSourceId,
        relatedSourceType,
    }: {
        id: number;
        type: string;
        trackingId: string;
        serveTrackingId: string;
        backendSource: BackendSourceOptions;
        position: number;
        badgeFamilies: CourseBadgeFamily[] | null;
        relatedSourceId: string | null;
        relatedSourceType: string | null;
    }) {
        super('DiscoveryItemImpressionEvent');
        this.id = id;
        this.type = type;
        this.trackingId = trackingId;
        this.serveTrackingId = serveTrackingId;
        this.backendSource = backendSource;
        this.position = position;
        this.badges = badgeFamilies?.map((family) => ({family})) ?? null;
        this.relatedSourceId = relatedSourceId;
        this.relatedSourceType = relatedSourceType;
    }
}

/**
 * Fired when a discovery item is clicked by a user
 */
class DiscoveryItemClickEvent extends ClientEvent {
    private id: number;
    private type: string;
    private trackingId: string;
    private serveTrackingId: string;
    private backendSource: BackendSourceOptions;
    private position?: number;
    private badges: TrackableCourseBadge[] | null;
    private uiRegion: string | null;

    constructor({
        id,
        type,
        trackingId,
        serveTrackingId,
        backendSource,
        position = 0,
        badgeFamilies,
        uiRegion = null,
    }: {
        id: number;
        type: string;
        trackingId: string;
        serveTrackingId: string;
        backendSource: BackendSourceOptions;
        position?: number;
        badgeFamilies: CourseBadgeFamily[] | null;
        uiRegion?: string | null;
    }) {
        super('DiscoveryItemClickEvent');
        this.id = id;
        this.type = type;
        this.trackingId = trackingId;
        this.serveTrackingId = serveTrackingId;
        this.backendSource = backendSource;
        this.position = position;
        this.badges = badgeFamilies?.map((family) => ({family})) ?? null;
        this.uiRegion = uiRegion;
    }
}

/**
 * Fired when a discovery unit is seen by a user
 */
class DiscoveryUnitViewEvent extends ClientEvent {
    private trackingId: string;
    private title: string;
    private renderType: string;
    constructor({
        trackingId,
        unitTitle,
        renderType,
    }: {
        trackingId: string;
        unitTitle: string;
        renderType: string;
    }) {
        super('DiscoveryUnitViewEvent');
        this.trackingId = trackingId;
        this.title = unitTitle;
        this.renderType = renderType;
    }
}

/**
 This event is fired when a user sees any UFB notice link on a marketplace page
 **/
class UFBNoticeImpressionEvent extends ClientEvent {
    private locale: string;
    private placement: string;
    private url: string | null;

    constructor({
        locale = getRequestData().locale,
        placement,
        url = null,
    }: {
        locale?: string;
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

const enum UFBNoticeVariant {
    TEAM_ACCESS = 'team_access',
    COURSES_AND_CERTS = 'courses_and_certs',
    COMPANIES_TRUST = 'companies_trust',
    COURSES_AND_PATHS = 'courses_and_paths',
}

/**
 This event is fired when a user clicks on any UFB notice link on a marketplace page
 */
class UFBNoticeClickEvent extends ClientEvent {
    private locale;
    private placement;
    private variant: UFBNoticeVariant | null;
    private url: string | null;

    constructor({
        locale = getRequestData().locale,
        placement,
        variant = null,
        url = null,
    }: {
        locale?: string;
        placement: string;
        variant?: UFBNoticeVariant | null;
        url?: string | null;
    }) {
        super('UFBNoticeClickEvent');
        this.locale = locale;
        this.placement = placement;
        this.variant = variant;
        this.url = url;
    }

    get eventLocale() {
        return this.locale;
    }

    get eventPlacement() {
        return this.placement;
    }

    get eventVariant() {
        return this.variant;
    }
}

/**
 * Fired when user clicks the 'Buy Now' button
 */
class BuyNowEvent extends ClientEvent {
    private buyable: TrackableBuyable;
    constructor({buyable}: {buyable: TrackableBuyable}) {
        super('BuyNowEvent');
        this.buyable = buyable;
    }
}

/**
 * Fired when user clicks the 'Enroll now' button
 */
class EnrollNowEvent extends ClientEvent {
    private buyable: TrackableBuyable;
    constructor({buyable}: {buyable: TrackableBuyable}) {
        super('EnrollNowEvent');
        this.buyable = buyable;
    }
}

/**
 * Fired when quick view is viewed by a user
 */
class QuickViewBoxOpenEvent extends ClientEvent {
    private id: number;
    private type?: string;
    private trackingId?: string;
    constructor({id, type, trackingId}: {id: number; type?: string; trackingId?: string}) {
        super('QuickViewBoxOpenEvent');
        this.id = id;
        this.trackingId = trackingId;
        this.type = type;
    }
}

/**
 * Fired when user clicks the 'Wishlist' button
 */
class WishlistEvent extends ClientEvent {
    private id: number;
    private trackingId: string;
    constructor({id, trackingId}: {id: number; trackingId: string}) {
        super('WishlistEvent');
        this.id = id;
        this.trackingId = trackingId;
    }
}

/**
 * Fire when an auto-complete item is clicked
 */
class AutoCompleteItemClickEvent extends ClientEvent {
    private resultTrackingId: string;
    private autoCompleteItem: AutoCompleteItem;
    constructor({
        resultTrackingId,
        autoCompleteItem,
    }: {
        resultTrackingId: string;
        autoCompleteItem: AutoCompleteItem;
    }) {
        super('AutoCompleteItemClickEvent');
        this.resultTrackingId = resultTrackingId;
        this.autoCompleteItem = autoCompleteItem;
    }
}

/**
 * Fired when auto-complete results are displayed to user
 */
class AutoCompleteResultImpressionEvent extends ClientEvent {
    private resultTrackingId: string;
    private query: string;
    constructor({resultTrackingId, query}: {resultTrackingId: string; query: string}) {
        super('AutoCompleteResultImpressionEvent');
        this.resultTrackingId = resultTrackingId;
        this.query = query;
    }
}

/**
 * Fired when user bounces from auto-complete results
 */
class AutoCompleteResultBounceEvent extends ClientEvent {
    private resultTrackingId: string;
    constructor({resultTrackingId}: {resultTrackingId: string}) {
        super('AutoCompleteResultBounceEvent');
        this.resultTrackingId = resultTrackingId;
    }
}

/**
 * Fired when user clicks clear history in auto complete results
 */
class AutoCompleteClearHistoryClickEvent extends ClientEvent {
    constructor(private resultTrackingId: string) {
        super('AutoCompleteClearHistoryClickEvent');
    }
}

/**
 * Fires when gift flow starts
 */
class GiftBuyablesStartEvent extends ClientEvent {
    constructor(private buyables: TrackableBuyable[], private uiRegion: string) {
        super('GiftBuyablesStartEvent');
    }

    get allBuyables() {
        return this.buyables;
    }
}

/**
 * Fires when the user clicks/taps on the share button
 * on a Course Landing Page.
 */
class CourseShareEvent extends ClientEvent {
    constructor(private courseId: number) {
        super('CourseShareEvent');
    }
}

export type CourseShareChannel =
    | 'clipboard'
    | 'facebook'
    | 'twitter'
    | 'messenger'
    | 'whatsapp'
    | 'mail_ref'
    | 'mailto';

/**
 * Fires when the user clicks/taps on a specific share channel from the share modal
 * on a Course Landing Page.
 */
class CourseShareToChannelEvent extends ClientEvent {
    constructor(private courseId: number, private channel: CourseShareChannel) {
        super('CourseShareToChannelEvent');
    }
}

type CouponApplicationMethod = 'manual_entry' | 'url_param';

/**
 * Fired whenever a coupon is applied on the CLP or cart page, either by manual
 * entry from the user or being included as a URL param
 */
class CouponApplyEvent extends ClientEvent {
    constructor(
        private buyables: TrackableBuyable[],
        private couponCode: string,
        private applicationMethod: CouponApplicationMethod,
    ) {
        super('CouponApplyEvent');
    }
}

/**
 * Fired whenever a coupon is removed from the CLP or cart page
 */
class CouponRemoveEvent extends ClientEvent {
    constructor(private buyables: TrackableBuyable[], private couponCode: string) {
        super('CouponRemoveEvent');
    }
}

/**
 * Fired when user switches to MX or consumer subscription only courses in search and browse pages.
 */

type CollectionType = keyof typeof CollectionTypes;

class CollectionTypeSwitchEvent extends ClientEvent {
    private query: string;
    private resultCount: number;
    private fromCollectionType: CollectionType;
    private toCollectionType: CollectionType;
    constructor({
        query,
        resultCount,
        toCollectionType,
        fromCollectionType,
    }: {
        query: string;
        resultCount: number;
        fromCollectionType: CollectionType;
        toCollectionType: CollectionType;
    }) {
        super('CollectionTypeSwitchEvent');
        this.query = query;
        this.resultCount = resultCount;
        this.fromCollectionType = fromCollectionType;
        this.toCollectionType = toCollectionType;
    }
}

/**
 * Fires when a user manually changes the language sort option provided by search QLI
 */
class SearchInferenceLanguageChangeEvent extends ClientEvent {
    constructor(private language: string, private trackingId: string) {
        super('SearchInferenceLanguageChangeEvent');
    }
}

/**
 * Fires when a user sees the "related searches" container in the search experience
 */
class RelatedSearchesImpressionEvent extends ClientEvent {
    constructor(private resultTrackingId: string) {
        super('RelatedSearchesImpressionEvent');
    }
}

/**
 * Fires when a user clicks on a "related search" in the search experience
 */
class RelatedSearchesItemClickEvent extends ClientEvent {
    constructor(private trackingId: string, private resultTrackingId: string) {
        super('RelatedSearchesItemClickEvent');
    }
}

/**
 *  Fired when filters are applied on course directory in search and browse pages.
 */

class DirectoryFilterChangeEvent extends ClientEvent {
    private query: string;
    private aggregation: string;
    private option: string;
    private isCheckedOnClick: boolean;
    constructor({
        query,
        aggregation,
        option,
        isCheckedOnClick,
    }: {
        query: string;
        aggregation: string;
        option: string;
        isCheckedOnClick: boolean;
    }) {
        super('DirectoryFilterChangeEvent');
        this.query = query;
        this.aggregation = aggregation;
        this.option = option;
        this.isCheckedOnClick = isCheckedOnClick;
    }
}

const enum NoticeType {
    WEB_BANNER = 'web_banner',
    FEATURED_BANNER = 'featured_banner',
    HOME_BANNER = 'home_banner',
    MOBILE_BANNER = 'mobile_banner',
    SMART_BAR = 'smart_bar',
    // TODO: Remove the notice type after mobile teams have switched over to using just the smart_bar
    UFB_SMART_BAR = 'ufb_smart_bar',
    INSTRUCTOR_BAR = 'instructor_bar',
    CART_SUCCESS_MESSAGE = 'cart_success_message',
    PURCHASE_SUCCESS_MESSAGE = 'purchase_success_message',
    FALLBACK_BANNER = 'fallback_banner',
    WEB_CAROUSEL_SLIDE = 'web_carousel_slide',
    FEATURED_CAROUSEL_SLIDE = 'featured_carousel_slide',
    HOME_CAROUSEL_SLIDE = 'home_carousel_slide',
    BANNER_CAROUSEL_SLIDE = 'banner_carousel_slide',
    MODAL_POPUP = 'modal_popup',
}

interface NoticeEventDetails {
    noticeId: number;
    noticeType: string | NoticeType;
    personalizedNoticeSetId?: number | null;
    personalizedNoticeSetName?: string | null;
    topMembershipTargetGroupId?: number | null;
}

interface BannerEventDetails extends NoticeEventDetails {
    slideNumber: number | null;
    url: string | null;
    uiRegion: string | null;
}

class BannerImpressionEvent extends ClientEvent {
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

class BannerClickEvent extends ClientEvent {
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

class SmartbarImpressionEvent extends ClientEvent {
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

class SmartbarClickEvent extends ClientEvent {
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

class SmartbarHideEvent extends ClientEvent {
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

/**
 * Fired when a user clicks on the CTA button on the smart bar on the logged-in-home-page
 * or on the CTA button on the smart bar in the shopping cart page, when a user is targeted with a
 * campaign that requires them to manually opt in to deals as part of pricing and legal compliance efforts.
 */

class DealOptInEvent extends ClientEvent {
    private noticeId: number;
    constructor(noticeId = 0) {
        super('DealOptInEvent');
        this.noticeId = noticeId;
    }
}

interface OccupationEventData {
    occupationId: number;
    occupationName: string;
}

interface OccupationCardEventData extends OccupationEventData {
    index: number;
    uiRegion: string;
}

class OccupationCardImpressionEvent extends ClientEvent {
    private occupationId: number;
    private occupationName: string;
    private index: number;
    private uiRegion: string;

    constructor({occupationId, occupationName, index, uiRegion}: OccupationCardEventData) {
        super('OccupationCardImpressionEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.index = index;
        this.uiRegion = uiRegion;
    }
}

class OccupationCardClickEvent extends ClientEvent {
    private occupationId: number;
    private occupationName: string;
    private index: number;
    private uiRegion: string;

    constructor({occupationId, occupationName, index, uiRegion}: OccupationCardEventData) {
        super('OccupationCardClickEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.index = index;
        this.uiRegion = uiRegion;
    }
}

class OccupationRelatedSearchesImpressionEvent extends ClientEvent {
    private queryId: string;

    constructor(queryId: string) {
        super('OccupationRelatedSearchesImpressionEvent');
        this.queryId = queryId;
    }
}

class OccupationRelatedSearchesItemClickEvent extends ClientEvent {
    private queryId: string;
    private searchPhrase: string;

    constructor(queryId: string, searchPhrase: string) {
        super('OccupationRelatedSearchesItemClickEvent');
        this.queryId = queryId;
        this.searchPhrase = searchPhrase;
    }
}

class MFABannerImpressionEvent extends ClientEvent {
    constructor() {
        super('MFABannerImpressionEvent');
    }
}

class MFAFlowEnableEvent extends ClientEvent {
    constructor() {
        super('MFAFlowEnableEvent');
    }
}

class MFAModalLaunchEvent extends ClientEvent {
    constructor() {
        super('MFAModalLaunchEvent');
    }
}
class MFAFlowDisableEvent extends ClientEvent {
    constructor() {
        super('MFAFlowDisableEvent');
    }
}

class InstructorNoticeImpressionEvent extends ClientEvent {
    private uiRegion: string;

    constructor(uiRegion: string) {
        super('InstructorNoticeImpressionEvent');
        this.uiRegion = uiRegion;
    }
}

class InstructorNoticeClickEvent extends ClientEvent {
    private uiRegion: string;

    constructor(uiRegion: string) {
        super('InstructorNoticeClickEvent');
        this.uiRegion = uiRegion;
    }
}

class BlogCTAImpressionEvent extends ClientEvent {
    private url: string;

    constructor(url: string) {
        super('BlogCTAImpressionEvent');
        this.url = url;
    }
}

class BlogCTAClickEvent extends ClientEvent {
    private url: string;

    constructor(url: string) {
        super('BlogCTAClickEvent');
        this.url = url;
    }
}

/**
 * Fires when a user see Coding Exercise Count
 */
class CodingExerciseCountImpressionEvent extends ClientEvent {
    private id: number | null;
    private trackingId: string | null;
    private numCodingExercises: number;
    constructor({
        id = null,
        trackingId = null,
        numCodingExercises,
    }: {
        id?: number | null;
        trackingId?: string | null;
        numCodingExercises: number;
    }) {
        super('CodingExerciseCountImpressionEvent');
        this.id = id;
        this.trackingId = trackingId;
        this.numCodingExercises = numCodingExercises;
    }
}

interface TestimonialEventData {
    id: string;
    type: string;
    uiRegion: string;
}

interface TestimonialClickEventData extends TestimonialEventData {
    url: string | null;
}

/**
Fired when a user is presented with a testimonial
*/
class TestimonialImpressionEvent extends ClientEvent {
    private id: string;
    private type: string;
    private uiRegion: string;

    constructor({id, type, uiRegion}: TestimonialEventData) {
        super('TestimonialImpressionEvent');
        this.id = id;
        this.type = type;
        this.uiRegion = uiRegion;
    }
}

/**
Fired when a user clicks on a link in the testimonial
*/
class TestimonialClickEvent extends ClientEvent {
    private id: string;
    private type: string;
    private url: string | null;
    private uiRegion: string;

    constructor({id, type, uiRegion, url = null}: TestimonialClickEventData) {
        super('TestimonialClickEvent');
        this.id = id;
        this.type = type;
        this.uiRegion = uiRegion;
        this.url = url;
    }
}

interface InstructorProfileClickEventData {
    instructorId: number;
    uiRegion: string;
}

class InstructorProfileClickEvent extends ClientEvent {
    private instructorId: number;
    private uiRegion: string;

    constructor({instructorId, uiRegion}: InstructorProfileClickEventData) {
        super('InstructorProfileClickEvent');
        this.instructorId = instructorId;
        this.uiRegion = uiRegion;
    }
}

interface LectureDiscoveryCardEventData {
    backendSource: BackendSourceOptions;
    id: number;
    position: number;
    serveTrackingId: string;
    trackingId: string;
    uiRegion: string | null;
}

class LectureDiscoveryCardClickEvent extends ClientEvent {
    private backendSource: BackendSourceOptions;
    private id: number;
    private position: number;
    private serveTrackingId: string;
    private trackingId: string;
    private uiRegion: string | null;
    constructor({
        backendSource,
        id,
        position,
        serveTrackingId,
        trackingId,
        uiRegion = null,
    }: LectureDiscoveryCardEventData) {
        super('LectureDiscoveryCardClickEvent');
        this.backendSource = backendSource;
        this.id = id;
        this.position = position;
        this.serveTrackingId = serveTrackingId;
        this.trackingId = trackingId;
        this.uiRegion = uiRegion;
    }
}

class LectureDiscoveryCardImpressionEvent extends ClientEvent {
    private backendSource: BackendSourceOptions;
    private id: number;
    private position: number;
    private serveTrackingId: string;
    private trackingId: string;
    private uiRegion: string | null;
    constructor({
        backendSource,
        id,
        position,
        serveTrackingId,
        trackingId,
        uiRegion = null,
    }: LectureDiscoveryCardEventData) {
        super('LectureDiscoveryCardImpressionEvent');
        this.backendSource = backendSource;
        this.id = id;
        this.position = position;
        this.serveTrackingId = serveTrackingId;
        this.trackingId = trackingId;
        this.uiRegion = uiRegion;
    }
}

interface LectureStartedEventData {
    id: number;
    trackingId: string | null;
}

class LectureStartedEvent extends ClientEvent {
    private id: number;
    private trackingId: string | null;
    constructor({id, trackingId = null}: LectureStartedEventData) {
        super('LectureStartedEvent');
        this.id = id;
        this.trackingId = trackingId;
    }
}

export const enum LectureTileUnitToggleOptions {
    COLLAPSED = 'collapsed',
    EXPANDED = 'expanded',
}

interface LectureTileUnitToggledEventData {
    action: LectureTileUnitToggleOptions;
    backendSource: BackendSourceOptions;
    initialState: LectureTileUnitToggleOptions;
    serveTrackingId: string;
    trackingId: string;
    uiRegion: string | null;
}

class LectureTileUnitToggledEvent extends ClientEvent {
    private action: LectureTileUnitToggleOptions;
    private backendSource: BackendSourceOptions;
    private initialState: LectureTileUnitToggleOptions;
    private serveTrackingId: string;
    private trackingId: string;
    private uiRegion: string | null;
    constructor({
        action,
        backendSource,
        initialState,
        serveTrackingId,
        trackingId,
        uiRegion = null,
    }: LectureTileUnitToggledEventData) {
        super('LectureTileUnitToggledEvent');
        this.action = action;
        this.backendSource = backendSource;
        this.initialState = initialState;
        this.serveTrackingId = serveTrackingId;
        this.trackingId = trackingId;
        this.uiRegion = uiRegion;
    }
}

export interface LectureAnalyticsEntity {
    id: number;
    type: LectureType;
}

class LectureDrawerClosed extends ClientEvent {
    constructor(public lecture: LectureAnalyticsEntity, public course: CourseAnalyticsEntity) {
        super('LectureDrawerClosed');
    }
}

class ExperimentImpressionEvent extends ClientEvent {
    private experimentIds: number[];
    private isLocalDefaultShown = false;
    constructor(experimentIds: number[], isLocalDefaultShown: boolean) {
        super('ExperimentImpressionEvent');
        this.experimentIds = experimentIds;
        this.isLocalDefaultShown = isLocalDefaultShown;
    }
}

/* export events in alphabetical order*/
export {
    AutoCompleteClearHistoryClickEvent,
    AutoCompleteItemClickEvent,
    AutoCompleteResultBounceEvent,
    AutoCompleteResultImpressionEvent,
    BannerClickEvent,
    BannerImpressionEvent,
    BlogCTAClickEvent,
    BlogCTAImpressionEvent,
    BuyNowEvent,
    CollectionTypeSwitchEvent,
    CouponApplyEvent,
    CouponRemoveEvent,
    CourseShareEvent,
    CourseShareToChannelEvent,
    DealOptInEvent,
    DirectoryFilterChangeEvent,
    DiscoveryItemClickEvent,
    DiscoveryItemImpressionEvent,
    DiscoveryUnitViewEvent,
    EnrollNowEvent,
    ExperimentImpressionEvent,
    GiftBuyablesStartEvent,
    CodingExerciseCountImpressionEvent,
    InstructorNoticeClickEvent,
    InstructorNoticeImpressionEvent,
    InstructorProfileClickEvent,
    LectureDiscoveryCardClickEvent,
    LectureDiscoveryCardImpressionEvent,
    LectureDrawerClosed,
    LectureStartedEvent,
    LectureTileUnitToggledEvent,
    MFABannerImpressionEvent,
    MFAFlowDisableEvent,
    MFAFlowEnableEvent,
    MFAModalLaunchEvent,
    OccupationCardClickEvent,
    OccupationCardImpressionEvent,
    OccupationRelatedSearchesImpressionEvent,
    OccupationRelatedSearchesItemClickEvent,
    QuickViewBoxOpenEvent,
    RelatedSearchesImpressionEvent,
    RelatedSearchesItemClickEvent,
    SearchInferenceLanguageChangeEvent,
    SmartbarClickEvent,
    SmartbarHideEvent,
    SmartbarImpressionEvent,
    TestimonialClickEvent,
    TestimonialImpressionEvent,
    UFBNoticeClickEvent,
    UFBNoticeImpressionEvent,
    WishlistEvent,
};

export type {
    BannerEventDetails,
    Buyable,
    CouponApplicationMethod,
    InstructorProfileClickEventData,
    LectureDiscoveryCardEventData,
    NoticeEventDetails,
    OccupationEventData,
    OccupationCardEventData,
    TestimonialClickEventData,
    TestimonialEventData,
};
