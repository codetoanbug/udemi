import {LocalizedHtml} from '@udemy/i18n';
import {Link, Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import React from 'react';

import PreserveScroll from 'instructor/layout/preserve-scroll.react-component';
import {LAB_COMPLETION_MODES} from 'lab-taking/mode-selector/v2/constants';
import Question from 'question-answer/question.react-component';
import escapeHtml from 'utils/escape/escape-html';

import {ReportDetailAPIData} from '../types';
import {ActionsDropdown} from './actions-dropdown.react-component';
import {LabsReportedIssuesStore} from './labs-reported-issues.mobx-store';

import './reported-issue-detail.less';

interface ReportedIssueDetailProps {
    selectedReportDetail: ReportDetailAPIData;
    reportedIssueStore: LabsReportedIssuesStore;
}

@inject('reportedIssueStore')
@observer
export class ReportedIssueDetail extends React.Component<ReportedIssueDetailProps> {
    static defaultProps: ReportedIssueDetailProps;

    // this is need to correctly mark an item as read/unread in then UnreadIndicator component
    stopMarkAsReadProps = {onClick: (event: React.MouseEvent) => event.stopPropagation()};

    get labLink() {
        const {selectedReportDetail} = this.props;

        return (
            <LocalizedHtml
                html={interpolate(
                    gettext('Reported on <a class="link">%(labTitle)s</a>'),
                    {labTitle: escapeHtml(selectedReportDetail.lab.title)},
                    true,
                )}
                interpolate={{
                    link: (
                        <a
                            href={selectedReportDetail.lab.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-purpose="lab-url"
                        />
                    ),
                }}
            />
        );
    }

    @autobind
    onDetailClick() {
        const {reportedIssueStore, selectedReportDetail} = this.props;

        if (reportedIssueStore.isReadStateSaving) {
            return;
        }
        reportedIssueStore.markAsRead(selectedReportDetail);
    }

    render() {
        const {reportedIssueStore, selectedReportDetail} = this.props;
        const reportContent = {
            created: selectedReportDetail.created,
            body: selectedReportDetail.body,
            title: selectedReportDetail.subject,
            user: selectedReportDetail.user,
        };
        const labMode = LAB_COMPLETION_MODES[selectedReportDetail.lab_mode];

        // ActionsDropdown handle "mark as read" a11y.
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div styleName="two-pane-container" onClick={this.onDetailClick}>
                <div className="ud-text-sm" styleName="thread-header">
                    <Button
                        componentClass={Link}
                        to={`${reportedIssueStore.baseUrl}/${selectedReportDetail.id}/`}
                        udStyle="ghost"
                        styleName="back"
                        typography="ud-heading-sm"
                    >
                        {gettext('Back')}
                    </Button>
                    <div styleName="thread-header-message-info">
                        <div styleName="lab-header-link">{this.labLink}</div>
                        {labMode && (
                            <>
                                {' | '}
                                <div data-purpose="lab-mode" styleName="lab-mode">
                                    {labMode.label}
                                </div>
                            </>
                        )}
                    </div>
                    <div {...this.stopMarkAsReadProps}>
                        <ActionsDropdown
                            selectedReportDetail={selectedReportDetail}
                            reportedIssueStore={this.props.reportedIssueStore}
                        />
                    </div>
                </div>
                <PreserveScroll autoScrollToBottom={true} contentId={selectedReportDetail.id}>
                    {reportedIssueStore.isDetailLoading ? (
                        <Loader styleName="loader" block={true} size="large" />
                    ) : (
                        <Question thread={reportContent} showFeaturedQuestionsBadge={false} />
                    )}
                </PreserveScroll>
            </div>
        );
    }
}
