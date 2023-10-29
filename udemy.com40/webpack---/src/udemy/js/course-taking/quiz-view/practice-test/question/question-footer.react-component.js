import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import PreviousIcon from '@udemy/icons/dist/previous.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumItemFooter from '../../../curriculum/controls/curriculum-item-footer.react-component';
import requires from '../../../registry/requires';

@inject('practiceTestStore', 'quizShortcutsMenuItemProps')
@requires('courseTakingStore', 'quizViewStore')
@observer
export default class QuestionFooter extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        quizViewStore: PropTypes.object.isRequired,
        quizShortcutsMenuItemProps: PropTypes.object.isRequired,
    };

    renderResponsiveButton(longLabel, shortLabel, icon, desktopIconPlacement, buttonProps) {
        // On mobile, we only show icon.
        // On desktop (aka not-mobile), we may show:
        // - Only the label (desktopIconPlacement: false)
        // - Icon followed by label (desktopIconPlacement: 'BEFORE')
        // - Label followed by icon (desktopIconPlacement: 'AFTER')
        const {isMobileViewportSize, isMediumScreenViewportSize} = this.props.courseTakingStore;
        if (isMobileViewportSize) {
            return (
                <IconButton size="small" {...buttonProps}>
                    {React.cloneElement(icon, {'aria-label': longLabel})}
                </IconButton>
            );
        }

        const desktopIcon = React.cloneElement(icon, {'aria-hidden': true});
        return (
            <Button size="small" {...buttonProps}>
                {desktopIconPlacement === 'BEFORE' && desktopIcon}
                <span aria-label={isMediumScreenViewportSize ? longLabel : null}>
                    {isMediumScreenViewportSize ? shortLabel : longLabel}
                </span>
                {desktopIconPlacement === 'AFTER' && desktopIcon}
            </Button>
        );
    }

    @autobind
    renderLeftButtons() {
        const {isQuestionNavOpen, toggleQuestionNav} = this.props.practiceTestStore;
        return this.renderResponsiveButton(
            isQuestionNavOpen ? gettext('Hide questions') : gettext('See all questions'),
            isQuestionNavOpen ? gettext('Hide questions') : gettext('See all'),
            <MenuIcon label={false} size="large" />,
            false,
            {
                className: 'ud-link-neutral',
                udStyle: 'ghost',
                'data-purpose': 'toggle-question-nav',
                onClick: toggleQuestionNav,
            },
        );
    }

    @autobind
    renderRightButtons() {
        const {courseTakingStore, practiceTestStore, quizViewStore} = this.props;
        const {
            goToPreviousQuestion,
            goToNextQuestion,
            skipTestQuestion,
            isProcessingAnswerTestQuestion,
        } = practiceTestStore;
        const {isAnswered, questionIndex} = quizViewStore.currentQuestion;

        let longNextText, shortNextText;
        if (questionIndex === quizViewStore.questions.length) {
            longNextText = gettext('Finish test');
            shortNextText = gettext('Finish');
        } else if (isAnswered) {
            longNextText = gettext('Next question');
            shortNextText = gettext('Next');
        } else {
            longNextText = gettext('Skip question');
            shortNextText = gettext('Skip');
        }

        return (
            <>
                {questionIndex > 1 &&
                    this.renderResponsiveButton(
                        gettext('Back'),
                        gettext('Back'),
                        <PreviousIcon label={false} />,
                        false,
                        {
                            className: courseTakingStore.isMobileViewportSize
                                ? null
                                : 'ud-link-neutral',
                            udStyle: courseTakingStore.isMobileViewportSize ? 'secondary' : 'ghost',
                            'data-purpose': 'go-to-prev-question',
                            onClick: goToPreviousQuestion,
                            disabled: isProcessingAnswerTestQuestion,
                        },
                    )}
                {this.renderResponsiveButton(
                    longNextText,
                    shortNextText,
                    <NextIcon label={false} />,
                    'AFTER',
                    {
                        udStyle: isAnswered ? 'primary' : 'secondary',
                        'data-purpose': isAnswered ? 'go-to-next-question' : 'skip-question',
                        onClick: isAnswered ? goToNextQuestion : skipTestQuestion,
                        disabled: isProcessingAnswerTestQuestion,
                    },
                )}
            </>
        );
    }

    render() {
        return (
            <CurriculumItemFooter
                renderLeftButtons={this.renderLeftButtons}
                renderRightButtons={this.renderRightButtons}
                reportId={this.props.quizViewStore.currentQuestion.id}
                reportType="assessment"
                shortcutsMenuItemProps={this.props.quizShortcutsMenuItemProps}
            />
        );
    }
}
