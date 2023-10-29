import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import React from 'react';

import EmptyState from 'instructor/common/empty-state.react-component';
import UserCommunicationCard from 'instructor/common/user-communication-card.react-component';
import udLink from 'utils/ud-link';

import {ReportAPIData} from '../types';
import {LabsReportedIssuesStore} from './labs-reported-issues.mobx-store';

import './reported-issues-list.less';

interface ReportedIssuesListProps {
    reportedIssueStore: LabsReportedIssuesStore;
}

@inject('reportedIssueStore')
@observer
export class ReportedIssuesList extends React.Component<ReportedIssuesListProps> {
    static defaultProps: ReportedIssuesListProps;

    @autobind
    onUnreadClick(event: React.MouseEvent, report: ReportAPIData) {
        event.preventDefault();
        if (this.props.reportedIssueStore.isReadStateSaving) {
            return;
        }
        this.props.reportedIssueStore.toggleRead(report);
    }

    renderEmptyState() {
        return (
            <div styleName="empty-state">
                <EmptyState
                    src={udLink.toStorageStaticAsset('communication/empty-search.jpg')}
                    src2x={udLink.toStorageStaticAsset('communication/empty-search-2x.jpg')}
                    headerText={gettext('No results')}
                    subText={gettext('Try a different filter')}
                />
            </div>
        );
    }

    render() {
        const {reportedIssueStore} = this.props;

        if (reportedIssueStore.reports.length === 0 && reportedIssueStore.isFilteredSelected) {
            return this.renderEmptyState();
        }

        return (
            <div styleName="reports-list-container">
                <div styleName="reports-list">
                    {reportedIssueStore.reports.map((report) => {
                        const {created, user} = report;
                        const response = {created, user, content: ''};

                        return (
                            <UserCommunicationCard
                                key={report.id}
                                to={`${reportedIssueStore.baseUrl}/${report.id}/detail/`}
                                thread={report}
                                isSelected={report == reportedIssueStore.selectedReport}
                                response={response}
                                headline={report.subject}
                                onUnreadClick={this.onUnreadClick}
                                showFeaturedQuestionBadge={false}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
