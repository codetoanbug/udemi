import Cookies from 'js-cookie';
import {action, computed, extendObservable, observable} from 'mobx';

import {ShoppingClient, ShoppingClientStore} from '@udemy/shopping';
import {udLink} from '@udemy/ud-data';

import {UfbContext} from './types/ufb-context';
import {FormActionParams, UserSpecificContext} from './types/user-specific-context';
import {ManageMenuL1Item} from './ufb-desktop/manage/manage-dropdown.react-component';

interface InstructorPerformancePaths {
    basePath: string;
    paths: {
        practiceInsightsPath: string;
        conversionPath: string;
        engagementPath: string;
        overviewPath: string;
        reviewsPath: string;
        studentsPath: string;
    };
}

export interface HeaderUrls {
    BROWSE: string;
    WISHLIST: string;
    SEARCH: string;
    SEARCH_SUGGESTIONS: string;
    TEACH: string;
    MY_LEARNING: string;
    MY_PROGRAMS: string;
    MY_COURSES: string;
    PREMIUM_COURSES: string;
    CART: string;
    VIEW_NOTIFICATIONS: string;
    EDIT_NOTIFICATIONS: string;
    MESSAGES: string;
    INVITE: string;
    PAYMENT_METHODS: string;
    CREDITS: string;
    PURCHASE_HISTORY: string;
    SUBSCRIPTION_MANAGEMENT: string;
    SUPPORT: string;
    ACCOUNT: string;
    EDIT_PROFILE: string;
    INSTRUCTOR_ONBOARDING: string;
}

export interface HeaderData extends UserSpecificContext {
    organizationManageMenu: ManageMenuL1Item[];
    ufbContext?: UfbContext;
    urls: HeaderUrls;
}

export type HeaderStoreProps = Pick<
    HeaderData,
    | 'currentLocale'
    | 'isInstructorSignupEnabled'
    | 'isLoggedIn'
    | 'mobileAppLink'
    | 'tryUFBPlacements'
    | 'ufbContext'
> & {
    shoppingClient?: ShoppingClientStore;
};

export class HeaderStore {
    private readonly isInstructorSignupEnabled;
    readonly mobileAppLink?;
    shoppingClient;
    readonly tryUFBPlacements?;
    readonly ufbContext?;

    /**
     * See ud_header in user_specific_ud_header_context
     * for userSpecificContext structure.
     */
    @observable.ref userSpecificContext: HeaderData = {} as HeaderData;
    @observable.ref formActionParams: FormActionParams = {src: 'ukw'};
    @observable.ref isPersonalPlanSubscriber = false;
    @observable.ref showCartDropdown = true;
    @observable.ref enableCartOnMobileNav = false;
    @observable.ref showInstructorDropdown = true;
    isFeaturedQuestionsEnabled?: boolean;
    isPayoutSettingsEnabled?: boolean;
    isRevenueReportEnabled?: boolean;
    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled = false;

    /**
     * See props in get_ud_header_react_app_props
     * for appProps structure.
     */
    constructor(props: HeaderStoreProps) {
        this.isInstructorSignupEnabled = props.isInstructorSignupEnabled;
        this.mobileAppLink = props.mobileAppLink;
        this.shoppingClient = props.shoppingClient ?? ShoppingClient;
        this.tryUFBPlacements = props.tryUFBPlacements;
        this.ufbContext = props.ufbContext;
    }

    @computed get notificationBadgeContext() {
        const {user} = this.userSpecificContext;
        const context = {
            unreadActivityNotifications: user ? user.num_of_unread_activity_notifications : 0,
            unreadMessages: user ? user.num_unread_threads : 0,
            unseenCredits: parseInt(Cookies.get('ud_credit_unseen') ?? '0', 10),
            cartBuyables: 0,
            unreadAlerts: 0,
        };

        if (this.shoppingClient) {
            context.cartBuyables = this.shoppingClient.lists.cart.items.length;
        } else {
            context.cartBuyables = user ? user.num_of_buyables_in_cart : 0;
        }

        Object.assign(context, this.ufbContext?.badgeContext || {});

        Object.values(context).forEach((count) => {
            context.unreadAlerts += count as number;
        });

        return context;
    }

    get signupParams() {
        if (this.isInstructorSignupEnabled) {
            return {
                showInstructorSignup: true,
                popupTrackingIdentifier: 'bai_header',
                nextPath: this.urls.INSTRUCTOR_ONBOARDING,
            };
        }
        return {};
    }

    @computed get urls() {
        const {isInstructor} = this.userSpecificContext;
        const ufburls = this.ufbContext?.urls?.(isInstructor);
        return {
            BROWSE: '/',
            SEARCH: '/courses/search/',
            SEARCH_SUGGESTIONS: '/search-suggestions/',
            TEACH: isInstructor ? '/instructor/' : '/teaching/?ref=teach_header',
            MY_LEARNING: '/home/my-courses/',
            MY_PROGRAMS: '/home/my-courses/programs/',
            MY_COURSES: '/home/my-courses/learning/',
            PREMIUM_COURSES: '/home/my-courses/premium/',
            WISHLIST: '/home/my-courses/wishlist/',
            CART: '/cart/',
            VIEW_NOTIFICATIONS: isInstructor
                ? '/instructor/user/view-notifications/'
                : '/user/view-notifications/',
            EDIT_NOTIFICATIONS: isInstructor
                ? '/instructor/account/notifications/'
                : '/user/edit-notifications/',
            MESSAGES: '/message/',
            INVITE: '/invite/',
            PAYMENT_METHODS: '/user/edit-payment-methods/',
            CREDITS: '/dashboard/credit-history/',
            PURCHASE_HISTORY: '/dashboard/purchase-history/',
            SUBSCRIPTION_MANAGEMENT: '/user/manage-subscriptions/',
            SUPPORT: '/support/',
            ACCOUNT: isInstructor ? '/instructor/account/security/' : '/user/edit-account/',
            EDIT_PROFILE: isInstructor
                ? '/instructor/profile/basic-information/'
                : '/user/edit-profile/',
            INSTRUCTOR_ONBOARDING: '/home/teaching/onboarding/teaching-experience/',
            ...(ufburls ?? {}),
        };
    }

    @computed get instructorURLs() {
        return {
            ...this.urls,
            COMMUNITY: udLink.toInstructorCommunity(),
            TEST_VIDEO: '/home/teaching/test-video/',
            API_CLIENTS: '/instructor/account/api/',
            CLOSE_ACCOUNT: '/instructor/account/close/',
            EDIT_NOTIFICATIONS: '/instructor/account/notifications/',
            ACCOUNT: '/instructor/account/security/',
            ANNOUNCEMENTS: '/instructor/communication/announcements/',
            ASSIGNMENTS: '/instructor/communication/assignments/',
            FEATURED_QUESTIONS: '/instructor/communication/featured_questions/',
            MESSAGES: '/instructor/communication/messages/',
            Q_AND_A: '/instructor/communication/qa/',
            COURSES: '/instructor/courses/',
            MARKETPLACE_INSIGHTS: '/instructor/marketplace-insights/',
            EDIT_PROFILE: '/instructor/profile/basic-information/',
            EDIT_PHOTO: '/instructor/profile/photo/',
            EDIT_PRIVACY: '/instructor/profile/privacy/',
            PAYOUT_SETTINGS: '/instructor/user/edit-instructor-info/',
            VIEW_NOTIFICATIONS: '/instructor/user/view-notifications/',
            INSIGHTS: '/instructor/insights/',
            REVENUE_REPORT: '/revenue-report/',
            SUPPORT: '/support/?type=instructor',
            TEACH_HUB: '/udemy-teach-hub/?ref=teach_header',
        };
    }

    @action
    setUserSpecificContext(context: HeaderData) {
        if (context.user) {
            const {num_of_unread_activity_notifications, ...user} = context.user;
            extendObservable(user, {num_of_unread_activity_notifications});
            context.user = user;
            if (context.user.consumer_subscription_active) {
                this.isPersonalPlanSubscriber = true;
                this.formActionParams = {
                    ...this.formActionParams,
                    subs_filter_type: 'subs_only',
                };
                this.showCartDropdown = false;
                this.enableCartOnMobileNav = true;
                this.showInstructorDropdown = !!context.isInstructor;
            }
        }
        this.userSpecificContext = context;
    }

    // Implement in subclasses
    getInstructorPerformancePaths(): InstructorPerformancePaths {
        throw new Error('Not implemented');
    }
}
