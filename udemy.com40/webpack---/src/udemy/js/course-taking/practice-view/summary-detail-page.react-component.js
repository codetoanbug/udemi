import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {runInAction, action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ITEM_TYPES} from '../curriculum/constants';
import CurriculumItemLoader from '../curriculum/curriculum-item-loader.react-component';
import ItemLink from '../curriculum/item-link.react-component';
import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PAGES} from './constants';
import Feedback from './feedback.react-component';
import Submission from './submission.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './practice.less';
import styles from './summary-detail-page.less';
/* eslint-enable no-unused-vars,import/order */

@requires('practiceViewStore')
@observer
export default class SummaryDetailPage extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        location: PropTypes.object,
    };

    static defaultProps = {
        location: window.location,
    };

    componentWillUnmount() {
        this.props.practiceViewStore.resetSubmissionDetail();
    }

    @observable submissionVisible = false;
    @observable feedbackId;

    @autobind
    onPracticeInitialized() {
        const match = this.props.location.pathname.match(/summary\/(.*)\/feedback\/(.*)/);
        const submissionId = match[1];
        runInAction(() => {
            this.feedbackId = parseInt(match[2], 10);
        });
        return this.props.practiceViewStore.setSubmissionDetail(parseInt(submissionId, 10));
    }

    @autobind
    @action
    toggleSubmissionVisibility() {
        this.submissionVisible = !this.submissionVisible;
    }

    renderSubmissionToggle() {
        let toggleText, Icon;
        const userName = this.props.practiceViewStore.submissionDetail.user.name;
        if (!this.submissionVisible) {
            toggleText = interpolate(gettext("View %s's work"), [userName]);
            Icon = ExpandIcon;
        } else {
            toggleText = interpolate(gettext("Hide %s's work"), [userName]);
            Icon = CollapseIcon;
        }
        return (
            <Button
                data-purpose="toggle-text"
                size="medium"
                udStyle="ghost"
                onClick={this.toggleSubmissionVisibility}
            >
                {toggleText}
                <Icon label={false} />
            </Button>
        );
    }

    render() {
        const {practiceViewStore} = this.props;
        return (
            <BasePage
                onPracticeInitialized={this.onPracticeInitialized}
                pageType={PAGES.SUMMARY_DETAIL_PAGE}
            >
                {!practiceViewStore.submissionDetail && <CurriculumItemLoader />}
                {practiceViewStore.submissionDetail && (
                    <>
                        <div>
                            <Button
                                componentClass={ItemLink}
                                itemType={ITEM_TYPES.PRACTICE}
                                itemId={practiceViewStore.practice.id}
                                subPath="/summary"
                                udStyle="ghost"
                            >
                                <ArrowLeftIcon label={false} />
                                {gettext('Back to all feedback')}
                            </Button>
                        </div>
                        <div styleName="baseStyles.panel">
                            <div styleName="styles.panel-heading">
                                <div className="ud-heading-md" styleName="styles.panel-title">
                                    {practiceViewStore.practice.title}
                                </div>
                                {this.renderSubmissionToggle()}
                            </div>
                            {this.submissionVisible && (
                                <div styleName="styles.submission">
                                    <Submission submission={practiceViewStore.submissionDetail} />
                                </div>
                            )}
                            {practiceViewStore.submissionDetail.peerFeedbacks
                                .filter((feedback) => feedback.answer.id === this.feedbackId)
                                .map((feedback) => (
                                    <Feedback
                                        feedback={feedback}
                                        key={feedback.answer.id || 'new-feedback'}
                                    />
                                ))}
                        </div>
                    </>
                )}
            </BasePage>
        );
    }
}
