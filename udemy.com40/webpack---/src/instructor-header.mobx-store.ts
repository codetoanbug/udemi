import {getLinkPaths} from '@udemy/instructor';
import {serverOrClient} from '@udemy/shared-utils';

import {HeaderStore, HeaderData, HeaderStoreProps} from './header.mobx-store';

export interface InstructorContext {
    isDisplayPracticeInsightsNewPageWithFunnelViewEnabled?: boolean;
    isInstructor?: boolean;
    isFeaturedQuestionsEnabled?: boolean;
    isPayoutSettingsEnabled?: boolean;
    isRevenueReportEnabled?: boolean;
    organizationState: unknown;
    organizationManageMenu: unknown[];
    user?: {
        id: number;
        display_name: string;
        email: string;
        image_75x75: string;
        initials: string;
        logout_url: string;
        num_unread_threads: number;
        num_of_unread_activity_notifications: number;
        url: string;
    };
}

export interface InstructorHeaderStoreProps extends HeaderStoreProps {
    instructorContext: InstructorContext;
}

export class InstructorHeaderStore extends HeaderStore {
    readonly isPayoutSettingsEnabled;
    readonly isRevenueReportEnabled;

    constructor(props: InstructorHeaderStoreProps) {
        super(props);
        this.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled =
            props.instructorContext.isDisplayPracticeInsightsNewPageWithFunnelViewEnabled ?? false;
        this.isFeaturedQuestionsEnabled = props.instructorContext.isFeaturedQuestionsEnabled;
        this.isPayoutSettingsEnabled = props.instructorContext.isPayoutSettingsEnabled;
        this.isRevenueReportEnabled = props.instructorContext.isRevenueReportEnabled;
        this.setUserSpecificContext({
            isInstructor: props.instructorContext.isInstructor,
            user: props.instructorContext.user,
            organizationState: props.instructorContext.organizationState,
            organizationManageMenu: props.instructorContext.organizationManageMenu,
        } as unknown as HeaderData);
    }

    getInstructorPerformancePaths() {
        const basePath = '/instructor/performance';
        const searchParams = new URLSearchParams(serverOrClient.global.location.search);
        const searchDict: Record<string, string> = {};
        for (const [k, v] of searchParams.entries()) {
            searchDict[k] = v;
        }
        const paths = getLinkPaths(searchDict);
        return {basePath, paths};
    }
}
