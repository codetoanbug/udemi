import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import PracticeTestSummary from '../practice-test-summary.react-component';
import ResultPanel from './result-panel.react-component';

import './results-group.less';

@inject('practiceTestStore')
@observer
export default class ResultsGroup extends Component {
    static propTypes = {
        getScrollContainer: PropTypes.func.isRequired,
        practiceTestStore: PropTypes.object.isRequired,
        versionGroup: PropTypes.object.isRequired,
        versionIndex: PropTypes.number.isRequired,
    };

    @autobind
    onClickShowChangelog() {
        const {practiceTestStore, versionGroup} = this.props;
        practiceTestStore.showChangelogModalUpToVersion(versionGroup.version);
    }

    renderGroupHeader() {
        const {practiceTestStore, versionGroup, versionIndex} = this.props;
        const versionGroups = practiceTestStore.testResultsByVersion;
        if (versionGroups.length <= 1) {
            return null;
        }
        return (
            <>
                <div className="ud-text-lg" styleName="group-header">
                    {interpolate(
                        gettext('Version %(number)s'),
                        {number: versionGroup.version},
                        true,
                    )}
                    {versionIndex !== versionGroups.length - 1 &&
                    versionGroup.version <= practiceTestStore.latestPublishedTestVersion ? (
                        <IconButton
                            size="xsmall"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={this.onClickShowChangelog}
                            data-purpose="show-changelog"
                        >
                            <InfoIcon label={gettext('Show changelog')} size="small" />
                        </IconButton>
                    ) : null}
                </div>
                <PracticeTestSummary
                    styleName="summary"
                    durationHours={versionGroup.durationHours}
                    durationMinutes={versionGroup.durationMinutes}
                    numAssessments={versionGroup.numAssessments}
                    passPercent={versionGroup.passPercent}
                />
            </>
        );
    }

    render() {
        return (
            <div styleName="results-group">
                {this.renderGroupHeader()}
                {this.props.versionGroup.results.map((result) => (
                    <ResultPanel
                        key={result.id}
                        result={result}
                        getScrollContainer={this.props.getScrollContainer}
                    />
                ))}
            </div>
        );
    }
}
