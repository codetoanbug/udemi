import {useI18n} from '@udemy/i18n';
import {
    FilterAggregationOption,
    FilterButton,
    FilterMenu,
    OpportunityList,
    OpportunityRootStore,
} from '@udemy/instructor';
import {Radio} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';
import './opportunities.less';
import {useHistory, useLocation} from 'react-router-dom';

import {fireOpportunityImpressionEvent} from '../../instructor/common/events';
import {useIsComponentMounted} from '../../instructor/hooks/use-is-component-mounted';
import Raven from '../../utils/ud-raven';
import CreateCourseFlowStore from '../create-course-flow.mobx-store';
import {AvailableOpportunitiesStore} from './available-opportunities.mobx-store';

interface AvailableOpportunitiesProps {
    createCourseStore: CreateCourseFlowStore;
    opportunityRootStore: OpportunityRootStore;
    availableOpportunitiesStore: AvailableOpportunitiesStore;
}
export const AvailableOpportunities = observer(
    ({
        createCourseStore,
        opportunityRootStore,
        availableOpportunitiesStore,
    }: AvailableOpportunitiesProps) => {
        const history = useHistory();
        const location = useLocation();
        const {gettext} = useI18n();
        const [store] = React.useState(() => opportunityRootStore);
        const [availableStore] = React.useState(() => availableOpportunitiesStore);
        const [radioState, setRadioState] = useState('choose_to_participate');
        const onRadioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            setRadioState(event.target.value);
        }, []);
        const [isLoading, setIsLoading] = React.useState(true);
        const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
        const isComponentMounted = useIsComponentMounted();

        useEffect(
            (async () => {
                await store.opportunityListStore.fetchOpportunitiesFromStaticList(store, gettext);
            }) as VoidFunction,
            [],
        );
        useEffect(
            (() => {
                runInAction(() => {
                    createCourseStore.setPageData({
                        uniqueOpportunityId: store.opportunityListStore.selectedOpportunityUuid,
                    });
                });
            }) as VoidFunction,
            [store.opportunityListStore.selectedOpportunityUuid],
        );
        function handleFilterButtonClick() {
            setIsSidebarVisible(!isSidebarVisible);
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
                        `Supply Gaps opportunity impression event firing exception (Course Creation Wizard UI) ${e}`,
                    );
                    throw new Error(
                        `Supply Gaps opportunity impression event firing exception (Course Creation Wizard UI) ${e}`,
                    );
                }
            }) as VoidFunction,
            [
                store.filterMenuStore.languageFilterStore.checkedOptions,
                store.opportunityListStore.activePage,
                store.opportunityListStore.itemCountPerPage,
                store.categoryId,
            ],
        );
        const renderOpportunityCards = () => {
            return (
                <div styleName="opportunity-section">
                    <div styleName="content-tools">
                        <FilterButton
                            isSidebarVisible={isSidebarVisible}
                            onClickHandler={handleFilterButtonClick}
                        />
                    </div>
                    <div styleName="content-area">
                        <FilterMenu
                            store={store.filterMenuStore}
                            isDomainFilterVisible={false}
                            isVisible={isSidebarVisible}
                        />
                        <div styleName="card-list">
                            {!isLoading && (
                                <OpportunityList
                                    isSelectable={true}
                                    opportunityListStore={store.opportunityListStore}
                                />
                            )}
                        </div>
                    </div>
                </div>
            );
        };
        if (!store.categoryId || store.categoryId === 'default' || store.categoryId == '-1') {
            return null;
        }
        return (
            <div className="available-opportunities" data-purpose="available-opportunities">
                <div data-purpose="show-available-opportunities">
                    <div styleName="show-available-opportunities-text">
                        {gettext(
                            'There are some Udemy Business content opportunities available for this category! Do you want to create course for a content opportunity?',
                        )}
                    </div>
                    <div>
                        <div styleName="show-available-opportunities-radio-group">
                            <div>
                                <Radio
                                    name="opportunityChoice"
                                    value="choose_to_participate"
                                    checked={radioState === 'choose_to_participate'}
                                    onChange={(e) => onRadioChange(e)}
                                >
                                    {gettext('Yes')}
                                </Radio>
                            </div>
                            <div>
                                <Radio
                                    name="opportunityChoice"
                                    value="choose_not_to_participate"
                                    checked={radioState === 'choose_not_to_participate'}
                                    onChange={(e) => onRadioChange(e)}
                                >
                                    {gettext('Not right now')}
                                </Radio>
                            </div>
                        </div>
                    </div>
                    <div styleName="show-available-opportunities-info-text">
                        {gettext(
                            'Select a content opportunity card and click on the continue button to create a course for it. Visit our',
                        )}
                        <a href="/instructor/opportunities" target="_blank">
                            {gettext(' Udemy Business content opportunities tool ')}
                        </a>
                        {gettext('to see the full list.')}
                    </div>
                    {availableStore.showLocalizationWarningBanner && (
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
                            onDismiss={availableStore.hideLocalizationWarningBanner}
                        ></AlertBanner>
                    )}
                    {radioState === 'choose_to_participate' && renderOpportunityCards()}
                </div>
            </div>
        );
    },
);
