import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import requires from '../../../registry/requires';
import {PAGE_TYPES} from '../constants';
import PracticeTestSummary from '../practice-test-summary.react-component';

import './results-header.less';

@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class ResultsHeader extends Component {
    static propTypes = {
        pageType: PropTypes.oneOf([PAGE_TYPES.RESULTS, PAGE_TYPES.DETAILED_RESULT]).isRequired,
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    @autobind
    onClickShowChangelog() {
        const {practiceTestStore} = this.props;
        practiceTestStore.showChangelogModalUpToVersion(
            practiceTestStore.latestPublishedTestVersion,
        );
    }

    render() {
        const {pageType, practiceTestStore, quizViewStore} = this.props;
        const versionGroups = practiceTestStore.testResultsByVersion;
        return (
            <section styleName="results-header">
                {practiceTestStore.isVersionAlertShown && pageType === PAGE_TYPES.RESULTS ? (
                    <AlertBanner
                        styleName="version-alert-banner"
                        data-purpose="version-alert"
                        ctaText={gettext('Dismiss')}
                        dismissButtonProps={false}
                        title={gettext('A new version of this practice test is now available.')}
                        body={
                            <>
                                {gettext('Retake the test to see the latest version.')}{' '}
                                <Button
                                    className="ud-link-underline"
                                    typography="ud-text-sm"
                                    udStyle="link"
                                    onClick={this.onClickShowChangelog}
                                    data-purpose="show-changelog"
                                >
                                    {gettext('What changed?')}
                                </Button>
                            </>
                        }
                    />
                ) : null}
                <h2 className="ud-heading-xl" data-purpose="title" styleName="title">
                    {interpolate(
                        gettext('%(title)s - Results'),
                        {title: quizViewStore.quiz.title},
                        true,
                    )}
                </h2>
                {versionGroups.length === 1 && pageType === PAGE_TYPES.RESULTS ? (
                    <PracticeTestSummary
                        styleName="summary"
                        size="lg"
                        durationHours={versionGroups[0].durationHours}
                        durationMinutes={versionGroups[0].durationMinutes}
                        numAssessments={versionGroups[0].numAssessments}
                        passPercent={versionGroups[0].passPercent}
                    />
                ) : null}
            </section>
        );
    }
}
