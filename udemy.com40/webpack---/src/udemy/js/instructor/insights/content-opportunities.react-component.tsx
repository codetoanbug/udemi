import {useI18n} from '@udemy/i18n';
import {
    FilterAggregationOption,
    OpportunityRootStore,
    OpportunityRootStoreParams,
    FilterMenu,
    FilterButton,
    OpportunityList,
} from '@udemy/instructor';
import {Button} from '@udemy/react-core-components';
import {AlertBanner, Badge} from '@udemy/react-messaging-components';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import qs from 'qs';
import React, {useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import './content-opportunities.less';

import Raven from '../../utils/ud-raven';
import {fireOpportunityImpressionEvent} from '../common/events';
import {useIsComponentMounted} from '../hooks/use-is-component-mounted';
import {ContentOpportunitiesStore} from './content-opportunities.mobx-store';

interface ContentOpportunitiesProps {
    isInstructorPartner: boolean;
    isFinancialIncentiveBannerEnabled: boolean;
}

export const ContentOpportunities = observer(
    ({
        isInstructorPartner = false,
        isFinancialIncentiveBannerEnabled = false,
    }: ContentOpportunitiesProps) => {
        const location = useLocation();
        const history = useHistory();
        const {gettext, locale} = useI18n();

        const queryParams = qs.parse(location.search, {ignoreQueryPrefix: true});
        const storeParams: OpportunityRootStoreParams = {
            queryParams,
            itemCountPerPage: 10,
            isIP: isInstructorPartner,
            gettext,
        };
        const [store] = React.useState(() => new OpportunityRootStore(storeParams));
        const [contentOpportunityStore] = React.useState(() => new ContentOpportunitiesStore());
        const [isLoading, setIsLoading] = React.useState(true);
        const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
        const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

        const isFinancialIncentiveBannerVisible =
            isFinancialIncentiveBannerEnabled && isInstructorPartner;

        const isComponentMounted = useIsComponentMounted();

        function shareFeedbackLink() {
            const userId = UD?.me?.id;
            return `https://survey.alchemer.com/s3/7536605/UB-opportunity-page-ICSAT/?user_id=${userId}`;
        }

        useEffect(() => {
            const updateDimensions = () => {
                setScreenWidth(window.innerWidth);
            };

            window.addEventListener('resize', updateDimensions);

            return () => {
                window.removeEventListener('resize', updateDimensions);
            };
        }, []);

        useEffect(() => {
            if (screenWidth < 768) {
                setIsSidebarVisible(false);
            } else {
                setIsSidebarVisible(true);
            }
        }, [screenWidth]);

        useEffect(
            (async () => {
                await store.opportunityListStore.fetchOpportunitiesFromStaticList(store, gettext);
            }) as VoidFunction,
            [],
        );

        function handleFilterButtonClick() {
            setIsSidebarVisible(!isSidebarVisible);
        }

        function openFinancialIncentiveAndCourseProposalApplicationPage() {
            window.open('https://survey.alchemer.com/s3/7408200/00a5ed33cdbe');
        }

        function updateQueryString() {
            history.replace({
                pathname: location.pathname,
                search: store.getParams(),
            });
        }

        useEffect(
            (async () => {
                updateQueryString();
                await runInAction(async () => {
                    await store.opportunityListStore.fetchOpportunitiesFromStaticList(
                        store,
                        gettext,
                    );
                });
                if (isComponentMounted.current) {
                    setIsLoading(false);
                }
                try {
                    const startIndex =
                        (store.opportunityListStore.activePage - 1) *
                        store.opportunityListStore.itemCountPerPage;
                    const endIndex =
                        store.opportunityListStore.activePage *
                        store.opportunityListStore.itemCountPerPage;
                    const visibleOpportunities = store.opportunityListStore.opportunities.slice(
                        startIndex,
                        endIndex,
                    );
                    const checkedCourseLanguages: string[] = store.filterMenuStore.languageFilterStore.checkedOptions.map(
                        (language: FilterAggregationOption) => language.key,
                    );
                    const checkedDomains: string[] = store.filterMenuStore.domainFilterStore.checkedOptions.map(
                        (domain: FilterAggregationOption) => domain.key,
                    );
                    if (visibleOpportunities && visibleOpportunities.length > 0) {
                        // Fire events to track the opportunity impressions
                        fireOpportunityImpressionEvent(
                            visibleOpportunities,
                            store.opportunityListStore.itemCountPerPage,
                            store.opportunityListStore.activePage,
                            checkedCourseLanguages,
                            checkedDomains,
                        );
                    }
                } catch (e) {
                    Raven.captureException(
                        `Supply Gaps opportunity impression event firing exception (Content Opportunities UI) ${e}`,
                    );
                    throw new Error(
                        `Supply Gaps opportunity impression event firing exception (Content Opportunities UI) ${e}`,
                    );
                }
            }) as VoidFunction,
            [
                store.filterMenuStore.domainFilterStore.checkedOptions,
                store.filterMenuStore.languageFilterStore.checkedOptions,
                store.opportunityListStore.activePage,
                store.opportunityListStore.itemCountPerPage,
            ],
        );

        const userLocale = locale ? locale.replace('_', '-') : 'en-US';
        const lastUpdateDate = new Date('10/02/23').toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

        return (
            <div data-purpose="content-opportunities-component" styleName="main-area">
                <div styleName="main-area-header">
                    <div>
                        <h1 className="ud-heading-serif-xxl">
                            {gettext('Udemy Business content opportunities')}
                        </h1>
                    </div>
                    <div styleName="header-badge">
                        <Badge styleName="green-badge">{gettext('New')}</Badge>
                    </div>
                    <div>
                        <div>
                            <Button
                                udStyle="link-underline"
                                typography="ud-text-sm"
                                componentClass="a"
                                href={shareFeedbackLink()}
                                target="_blank"
                                size="xsmall"
                            >
                                {gettext('Share feedback')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <p styleName="heading-text">
                        {gettext(
                            "Udemy's Content Strategy team identifies opportunities based on recent demand from professional learners and their employers. Factors that influence the list include industry trends, customer requests, Udemy learner searches and enrollments, and analysis of the current Udemy Business collection. Content published on these subjects is more likely (but not guaranteed) to be curated into the Udemy Business collection. Learn more about ",
                        )}
                        <a
                            href={`https://teach.udemy.com/${UD.me?.language}/optimize-your-course-for-udemy-for-business/`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {gettext('maximizing your chances of inclusion.')}
                        </a>
                    </p>
                    <p styleName="heading-text">
                        <strong>{gettext('Last updated: ')}</strong>
                        {lastUpdateDate}
                    </p>
                    {isFinancialIncentiveBannerVisible && (
                        <AlertBanner
                            styleName="alert-banner"
                            data-purpose="dismissible-message"
                            showCta={false}
                            dismissButtonProps={false}
                            title={
                                'The Financial Incentive and Course Proposal Application is now open!'
                            }
                            body={
                                <p>
                                    {' As an Instructor Partner, you have'}
                                    <a href="https://community.udemy.com/t5/Instructor-Partner-Program/Udemy-Business-Priority-Topics-List-amp-Course-Creation/ta-p/115255">
                                        {
                                            ' the benefit of applying for financial incentive consideration'
                                        }
                                    </a>
                                    {
                                        ' for select opportunities as well as propose new courses for expedited inclusion in Udemy Business. The application window is open from Thursday, October 12, 2023 to Thursday, October 26, 2023.'
                                    }
                                    <br></br>
                                    <Button
                                        udStyle="primary"
                                        size="medium"
                                        type="submit"
                                        styleName="apply-button"
                                        onClick={
                                            openFinancialIncentiveAndCourseProposalApplicationPage
                                        }
                                    >
                                        {'Apply'}
                                    </Button>
                                </p>
                            }
                        />
                    )}
                    {contentOpportunityStore.showLocalizationWarningBanner && (
                        <AlertBanner
                            styleName={'localization-warning'}
                            udStyle={'warning'}
                            title={gettext(
                                'Udemy Business content opportunities currently display in English, even when an opportunity targets a course in another language. The Udemy team is working to enable official translations of all opportunities.',
                            )}
                            data-purpose="localization-warning"
                            showCta={true}
                            actionButtonProps={false}
                            dismissButtonText={gettext('Dismiss')}
                            onDismiss={contentOpportunityStore.hideLocalizationWarningBanner}
                        ></AlertBanner>
                    )}
                </div>
                <div styleName="content-tools">
                    <FilterButton
                        isSidebarVisible={isSidebarVisible}
                        onClickHandler={handleFilterButtonClick}
                    />
                </div>
                <div styleName="content-area">
                    <FilterMenu store={store.filterMenuStore} isVisible={isSidebarVisible} />
                    <div styleName="card-list">
                        {!isLoading && (
                            <OpportunityList
                                isSelectable={false}
                                opportunityListStore={store.opportunityListStore}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    },
);
