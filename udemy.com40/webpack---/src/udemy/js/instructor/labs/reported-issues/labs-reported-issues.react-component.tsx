import {Checkbox} from '@udemy/react-form-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {inject, observer, Provider} from 'mobx-react';
import React from 'react';
import {Route, RouteComponentProps} from 'react-router-dom';

import EmptyState from 'instructor/common/empty-state.react-component';
import FilterBar from 'instructor/common/filter-bar.react-component';
import {SORT_LABELS} from 'instructor/labs/constants';
import LabsStore from 'instructor/labs/labs.mobx-store';
import DescriptionDropdown from 'instructor/layout/description-dropdown.react-component';
import {SimpleIAResponsiveHeader} from 'instructor/layout/ia-responsive-header.react-component';
import TwoPaneStore from 'instructor/layout/two-pane.mobx-store';
import TwoPane from 'instructor/layout/two-pane.react-component';
import udLink from 'utils/ud-link';

import {BetaBadge, BetaBanner} from './beta-banner.react-component';
import {LabsDropdown} from './labs-dropdown.react-component';
import {LabsReportedIssuesStore} from './labs-reported-issues.mobx-store';
import {ReportedIssueDetail} from './reported-issue-detail.react-component';
import {ReportedIssuesList} from './reported-issues-list.react-component';

import './labs-reported-issues.less';

export interface LabsReportedIssuesProps {
    labsStore: LabsStore;
    baseUrl: string;
    location: RouteComponentProps['location'];
}

@inject('labsStore')
@observer
export class LabsReportedIssues extends React.Component<LabsReportedIssuesProps> {
    constructor(props: LabsReportedIssuesProps) {
        super(props);
        this.reportedIssueStore = new LabsReportedIssuesStore(
            props.baseUrl,
            new TwoPaneStore(),
            props.labsStore,
        );
    }

    async componentDidMount() {
        await this.reportedIssueStore.loadOwnedLabs();
        await this.reportedIssueStore.loadIssueTypes();
        await this.reportedIssueStore.loadReports();
        await this.reportedIssueStore.setReportFromPathName(this.props.location.pathname);
    }

    async componentDidUpdate(prevProps: LabsReportedIssuesProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            await this.reportedIssueStore.setReportFromPathName(this.props.location.pathname);
        }
    }

    componentWillUnmount() {
        this.reportedIssueStore.reactionDisposer();
    }

    reportedIssueStore: LabsReportedIssuesStore;

    renderFilterItems() {
        return [
            <Checkbox
                data-purpose="unread-checkbox"
                name="checkbox-unread"
                checked={this.reportedIssueStore.filterUnread}
                onChange={(event) => this.reportedIssueStore.setFilterUnread(event.target.checked)}
            >
                {`${gettext('Unread')} (${this.reportedIssueStore.labsStore.numUnreadReports})`}
            </Checkbox>,
            <DescriptionDropdown
                data-purpose="ordering-filter"
                description={gettext('Sort by')}
                labels={SORT_LABELS}
                value={this.reportedIssueStore.ordering}
                setValue={(value: keyof typeof SORT_LABELS) =>
                    this.reportedIssueStore.setOrdering(value)
                }
            />,
            <DescriptionDropdown
                data-purpose="issue-type-filter"
                description={gettext('Issue type')}
                labels={this.reportedIssueStore.issueTypes}
                value={this.reportedIssueStore.selectedIssueType}
                setValue={(value: string) => this.reportedIssueStore.setSelectedIssueType(value)}
            />,
        ];
    }

    renderEmptyState() {
        return (
            <div styleName="empty-state">
                <EmptyState
                    src={udLink.toStorageStaticAsset('communication/empty-search.jpg')}
                    src2x={udLink.toStorageStaticAsset('communication/empty-search-2x.jpg')}
                    headerText={gettext('No reported issues yet')}
                    subText=""
                />
            </div>
        );
    }

    renderTwoPane() {
        return (
            <Provider reportedIssueStore={this.reportedIssueStore}>
                <TwoPane twoPaneStore={this.reportedIssueStore.twoPaneStore}>
                    <Route component={ReportedIssuesList} />
                    {this.reportedIssueStore.selectedReportDetail && (
                        <ReportedIssueDetail
                            selectedReportDetail={this.reportedIssueStore.selectedReportDetail}
                        />
                    )}
                </TwoPane>
            </Provider>
        );
    }

    render() {
        const {ownedLabs, isLoading, isLabsListLoading, labFilterTitle} = this.reportedIssueStore;

        return (
            <>
                <SimpleIAResponsiveHeader
                    title={
                        <>
                            {gettext('Reported issues')}
                            <BetaBadge isBadgeOnly={true} />
                        </>
                    }
                    rightCTA={
                        <div styleName="dropdown-container">
                            <LabsDropdown
                                labs={ownedLabs}
                                title={labFilterTitle}
                                onLabSelect={(labId?: number) =>
                                    this.reportedIssueStore.setSelectedLabId(labId)
                                }
                                disabled={isLabsListLoading}
                            />
                        </div>
                    }
                />
                <BetaBanner />
                <FilterBar leftItems={this.renderFilterItems()} />
                {isLoading ? (
                    <MainContentLoader />
                ) : (
                    <div styleName="two-pane">
                        {this.reportedIssueStore.reports.length === 0 &&
                        !this.reportedIssueStore.isFilteredSelected
                            ? this.renderEmptyState()
                            : this.renderTwoPane()}
                    </div>
                )}
            </>
        );
    }
}
