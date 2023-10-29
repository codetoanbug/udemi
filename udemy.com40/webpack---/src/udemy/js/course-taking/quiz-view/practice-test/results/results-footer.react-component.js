import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import {ITEM_TYPES} from '../../../curriculum/constants';
import CurriculumItemFooter from '../../../curriculum/controls/curriculum-item-footer.react-component';
import NextItemLink from '../../../curriculum/next-item-link.react-component';
import requires from '../../../registry/requires';

@inject('practiceTestStore')
@requires('quizViewStore')
@observer
export default class ResultsFooter extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
    };

    renderRetakeButton() {
        const {passed} = this.props.practiceTestStore.firstTestResult;
        return (
            <Button
                size="small"
                className={!passed ? null : 'ud-link-neutral'}
                udStyle={!passed ? 'primary' : 'ghost'}
                onClick={this.props.practiceTestStore.retakeTest}
            >
                {gettext('Retake test')}
            </Button>
        );
    }

    renderContinueButton() {
        const {passed} = this.props.practiceTestStore.firstTestResult;
        return (
            !getIsMobileApp() && (
                <Button
                    componentClass={NextItemLink}
                    size="small"
                    className={passed ? null : 'ud-link-neutral'}
                    udStyle={passed ? 'primary' : 'ghost'}
                    data-purpose="next-item"
                >
                    {gettext('Continue')}
                </Button>
            )
        );
    }

    @autobind
    renderRightButtons() {
        const {firstTestResult} = this.props.practiceTestStore;
        if (!firstTestResult) {
            return null;
        }
        return (
            <>
                {firstTestResult.passed ? this.renderRetakeButton() : this.renderContinueButton()}
                {firstTestResult.passed ? this.renderContinueButton() : this.renderRetakeButton()}
            </>
        );
    }

    render() {
        return (
            <CurriculumItemFooter
                renderRightButtons={this.renderRightButtons}
                reportId={this.props.quizViewStore.quiz.id}
                reportType={ITEM_TYPES.QUIZ}
            />
        );
    }
}
