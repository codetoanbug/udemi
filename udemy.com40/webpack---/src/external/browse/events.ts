import {ClientEvent} from '@udemy/event-tracking';
import {getRequestData} from '@udemy/shared-utils';

import {CollectionTypes} from './lib/constants';

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

type TrackableBuyable = Buyable & TrackableObject;

// TODO: Move to browse/components/badge/course-badges.react-component.js once converted to Typescript
export type CourseBadgeFamily =
    | 'bestseller'
    | 'new'
    | 'hot_and_new'
    | 'top_rated'
    | 'free'
    | 'updated_recently';

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
    id: number;
    type: string;
    trackingId: string;
    serveTrackingId: string;
    backendSource: BackendSourceOptions;
    position: number;
    badges: TrackableCourseBadge[] | null;
    relatedSourceId: string | null;
    relatedSourceType: string | null;

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
    id: number;
    type: string;
    trackingId: string;
    serveTrackingId: string;
    backendSource: BackendSourceOptions;
    position?: number;
    badges: TrackableCourseBadge[] | null;

    constructor({
        id,
        type,
        trackingId,
        serveTrackingId,
        backendSource,
        position = 0,
        badgeFamilies,
    }: {
        id: number;
        type: string;
        trackingId: string;
        serveTrackingId: string;
        backendSource: BackendSourceOptions;
        position?: number;
        badgeFamilies: CourseBadgeFamily[] | null;
    }) {
        super('DiscoveryItemClickEvent');
        this.id = id;
        this.type = type;
        this.trackingId = trackingId;
        this.serveTrackingId = serveTrackingId;
        this.backendSource = backendSource;
        this.position = position;
        this.badges = badgeFamilies?.map((family) => ({family})) ?? null;
    }
}

/**
 * Fired when a discovery unit is seen by a user
 */
class DiscoveryUnitViewEvent extends ClientEvent {
    trackingId: string;
    title: string;
    renderType: string;
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
    locale: string;
    placement: string;
    url: string | null;

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
    locale;
    placement;
    variant: UFBNoticeVariant | null;
    url: string | null;

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
    buyable: TrackableBuyable;
    constructor({buyable}: {buyable: TrackableBuyable}) {
        super('BuyNowEvent');
        this.buyable = buyable;
    }
}

/**
 * Fired when user clicks the 'Enroll now' button
 */
class EnrollNowEvent extends ClientEvent {
    buyable: TrackableBuyable;
    constructor({buyable}: {buyable: TrackableBuyable}) {
        super('EnrollNowEvent');
        this.buyable = buyable;
    }
}

/**
 * Fired when quick view is viewed by a user
 */
class QuickViewBoxOpenEvent extends ClientEvent {
    id: number;
    type?: string;
    trackingId?: string;
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
    id: number;
    trackingId: string;
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
    resultTrackingId: string;
    autoCompleteItem: AutoCompleteItem;
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
    resultTrackingId: string;
    query: string;
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
    resultTrackingId: string;
    constructor({resultTrackingId}: {resultTrackingId: string}) {
        super('AutoCompleteResultBounceEvent');
        this.resultTrackingId = resultTrackingId;
    }
}

/**
 * Fired when user clicks clear history in auto complete results
 */
class AutoCompleteClearHistoryClickEvent extends ClientEvent {
    constructor(resultTrackingId: string) {
        super('AutoCompleteClearHistoryClickEvent');
    }
}

/**
 * Fires when gift flow starts
 */
class GiftBuyablesStartEvent extends ClientEvent {
    buyables: any;
    constructor(buyables: TrackableBuyable[], uiRegion: string) {
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
    constructor(courseId: number) {
        super('CourseShareEvent');
    }
}

type CourseShareChannel =
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
    constructor(courseId: number, channel: CourseShareChannel) {
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
        buyables: TrackableBuyable[],
        couponCode: string,
        applicationMethod: CouponApplicationMethod,
    ) {
        super('CouponApplyEvent');
    }
}

/**
 * Fired whenever a coupon is removed from the CLP or cart page
 */
class CouponRemoveEvent extends ClientEvent {
    constructor(buyables: TrackableBuyable[], couponCode: string) {
        super('CouponRemoveEvent');
    }
}

/**
 * Fired when user switches to MX or consumer subscription only courses in search and browse pages.
 */

type CollectionType = keyof typeof CollectionTypes;

class CollectionTypeSwitchEvent extends ClientEvent {
    query: string;
    resultCount: number;
    fromCollectionType: CollectionType;
    toCollectionType: CollectionType;
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
    constructor(language: string, trackingId: string) {
        super('SearchInferenceLanguageChangeEvent');
    }
}

/**
 * Fires when a user sees the "related searches" container in the search experience
 */
class RelatedSearchesImpressionEvent extends ClientEvent {
    constructor(resultTrackingId: string) {
        super('RelatedSearchesImpressionEvent');
    }
}

/**
 * Fires when a user clicks on a "related search" in the search experience
 */
class RelatedSearchesItemClickEvent extends ClientEvent {
    constructor(trackingId: string, resultTrackingId: string) {
        super('RelatedSearchesItemClickEvent');
    }
}

/**
 *  Fired when filters are applied on course directory in search and browse pages.
 */

class DirectoryFilterChangeEvent extends ClientEvent {
    query: string;
    aggregation: string;
    option: string;
    isCheckedOnClick: boolean;
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
    UFB_SMART_BAR = 'ufb_smart_bar',
    INSTRUCTOR_BAR = 'instructor_bar',
    CART_SUCCESS_MESSAGE = 'cart_success_message',
    PURCHASE_SUCCESS_MESSAGE = 'purchase_success_message',
    FALLBACK_BANNER = 'fallback_banner',
    WEB_CAROUSEL_SLIDE = 'web_carousel_slide',
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
    noticeId: NoticeEventDetails['noticeId'];
    noticeType: NoticeEventDetails['noticeType'];
    personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    slideNumber: number | null;
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
    noticeId: NoticeEventDetails['noticeId'];
    noticeType: NoticeEventDetails['noticeType'];
    personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    slideNumber: number | null;
    url: string | null;
    uiRegion: string | null;
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
    noticeId: NoticeEventDetails['noticeId'];
    noticeType: NoticeEventDetails['noticeType'];
    personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
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
    noticeId: NoticeEventDetails['noticeId'];
    noticeType: NoticeEventDetails['noticeType'];
    personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
    url: string;
    location: string | null;
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
    noticeId: NoticeEventDetails['noticeId'];
    noticeType: NoticeEventDetails['noticeType'];
    personalizedNoticeSetId: NoticeEventDetails['personalizedNoticeSetId'];
    personalizedNoticeSetName: NoticeEventDetails['personalizedNoticeSetName'];
    topMembershipTargetGroupId: NoticeEventDetails['topMembershipTargetGroupId'];
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
    noticeId: number;
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
    occupationId: number;
    occupationName: string;
    index: number;
    uiRegion: string;

    constructor({occupationId, occupationName, index, uiRegion}: OccupationCardEventData) {
        super('OccupationCardImpressionEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.index = index;
        this.uiRegion = uiRegion;
    }
}

class OccupationCardClickEvent extends ClientEvent {
    occupationId: number;
    occupationName: string;
    index: number;
    uiRegion: string;

    constructor({occupationId, occupationName, index, uiRegion}: OccupationCardEventData) {
        super('OccupationCardClickEvent');
        this.occupationId = occupationId;
        this.occupationName = occupationName;
        this.index = index;
        this.uiRegion = uiRegion;
    }
}

class OccupationRelatedSearchesImpressionEvent extends ClientEvent {
    queryId: string;

    constructor(queryId: string) {
        super('OccupationRelatedSearchesImpressionEvent');
        this.queryId = queryId;
    }
}

class OccupationRelatedSearchesItemClickEvent extends ClientEvent {
    queryId: string;
    searchPhrase: string;

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
    uiRegion: string;

    constructor(uiRegion: string) {
        super('InstructorNoticeImpressionEvent');
        this.uiRegion = uiRegion;
    }
}

class InstructorNoticeClickEvent extends ClientEvent {
    uiRegion: string;

    constructor(uiRegion: string) {
        super('InstructorNoticeClickEvent');
        this.uiRegion = uiRegion;
    }
}

class BlogCTAImpressionEvent extends ClientEvent {
    url: string;

    constructor(url: string) {
        super('BlogCTAImpressionEvent');
        this.url = url;
    }
}

class BlogCTAClickEvent extends ClientEvent {
    url: string;

    constructor(url: string) {
        super('BlogCTAClickEvent');
        this.url = url;
    }
}

/**
 * Fires when a user see Coding Exercise Count
 */
class CodingExerciseCountImpressionEvent extends ClientEvent {
    id: number | null;
    trackingId: string | null;
    numCodingExercises: number;
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
    id: string;
    type: string;
    uiRegion: string;

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
    id: string;
    type: string;
    url: string | null;
    uiRegion: string;

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
    instructorId: number;
    uiRegion: string;

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
}

class LectureDiscoveryCardClickEvent extends ClientEvent {
    backendSource: BackendSourceOptions;
    id: number;
    position: number;
    serveTrackingId: string;
    trackingId: string;
    constructor({
        backendSource,
        id,
        position,
        serveTrackingId,
        trackingId,
    }: LectureDiscoveryCardEventData) {
        super('LectureDiscoveryCardClickEvent');
        this.backendSource = backendSource;
        this.id = id;
        this.position = position;
        this.serveTrackingId = serveTrackingId;
        this.trackingId = trackingId;
    }
}

class LectureDiscoveryCardImpressionEvent extends ClientEvent {
    backendSource: BackendSourceOptions;
    id: number;
    position: number;
    serveTrackingId: string;
    trackingId: string;
    constructor({
        backendSource,
        id,
        position,
        serveTrackingId,
        trackingId,
    }: LectureDiscoveryCardEventData) {
        super('LectureDiscoveryCardImpressionEvent');
        this.backendSource = backendSource;
        this.id = id;
        this.position = position;
        this.serveTrackingId = serveTrackingId;
        this.trackingId = trackingId;
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
    GiftBuyablesStartEvent,
    CodingExerciseCountImpressionEvent,
    InstructorNoticeClickEvent,
    InstructorNoticeImpressionEvent,
    InstructorProfileClickEvent,
    LectureDiscoveryCardClickEvent,
    LectureDiscoveryCardImpressionEvent,
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
    OccupationEventData,
    OccupationCardEventData,
    TestimonialClickEventData,
    TestimonialEventData,
};
