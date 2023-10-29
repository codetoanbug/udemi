import NextIcon from '@udemy/icons/dist/next.ud-icon';
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

@inject('practiceTestStore', 'quizShortcutsMenuItemProps')
@requires('quizViewStore')
@observer
export default class StartFooter extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        quizShortcutsMenuItemProps: PropTypes.object.isRequired,
    };

    @autobind
    renderRightButtons() {
        const disableBeginTest =
            this.props.quizViewStore.isPreparingNewAttempt ||
            !this.props.quizViewStore.quiz.numAssessments;
        return (
            <>
                {!this.props.practiceTestStore.isStartingARetake && !getIsMobileApp() ? (
                    <Button
                        componentClass={NextItemLink}
                        size="small"
                        className="ud-link-neutral"
                        udStyle="ghost"
                        data-purpose="next-item"
                    >
                        {gettext('Skip test')}
                    </Button>
                ) : null}
                <Button
                    size="small"
                    autoFocus={true}
                    data-purpose="start-quiz"
                    disabled={disableBeginTest}
                    onClick={this.props.practiceTestStore.startTest}
                >
                    {gettext('Begin test')}
                    <NextIcon label={false} />
                </Button>
            </>
        );
    }

    render() {
        return (
            <CurriculumItemFooter
                renderRightButtons={this.renderRightButtons}
                reportId={this.props.quizViewStore.quiz.id}
                reportType={ITEM_TYPES.QUIZ}
                shortcutsMenuItemProps={this.props.quizShortcutsMenuItemProps}
            />
        );
    }
}
