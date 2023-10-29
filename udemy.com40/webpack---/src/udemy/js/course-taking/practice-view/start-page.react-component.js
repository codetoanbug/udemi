import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';

import NextItemLink from '../curriculum/next-item-link.react-component';
import requires from '../registry/requires';
import BasePage from './base-page.react-component';
import {PAGES} from './constants';
import FooterButton from './footer-button.react-component';
import {DurationMessage, SubmissionMessage} from './messages.react-component';

import './practice.less';

@requires('courseTakingStore', 'practiceViewStore')
@observer
export default class StartPage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        practiceViewStore: PropTypes.object.isRequired,
    };

    @autobind
    renderRightButtons() {
        const {nextUrl, hasCompletedPractice} = this.props.practiceViewStore;
        const {isMediumScreenViewportSize} = this.props.courseTakingStore;
        if (hasCompletedPractice) {
            return (
                <Button
                    componentClass={NextItemLink}
                    size="small"
                    data-purpose="next-item"
                    id="next-item"
                >
                    {isMediumScreenViewportSize ? gettext('Next') : gettext('Next lecture')}
                </Button>
            );
        }
        return (
            <>
                <Button
                    componentClass={NextItemLink}
                    className="ud-link-neutral"
                    udStyle="ghost"
                    size="small"
                    data-purpose="next-item"
                    id="next-item"
                >
                    {isMediumScreenViewportSize ? gettext('Skip') : gettext('Skip assignment')}
                </Button>
                <FooterButton data-purpose="start-assignment" id="start" url={nextUrl}>
                    {isMediumScreenViewportSize ? gettext('Start') : gettext('Start assignment')}
                </FooterButton>
            </>
        );
    }

    get subtitleContents() {
        const {isPracticeLoaded, practice} = this.props.practiceViewStore;
        const content = [
            isPracticeLoaded && !!practice.estimatedDuration && (
                <DurationMessage key="duration" duration={practice.estimatedDuration} />
            ),
            isPracticeLoaded && practice.numSubmissions > 0 && (
                <SubmissionMessage key="num-submissions" amount={practice.numSubmissions} />
            ),
        ].filter(Boolean);
        return content.length > 0 ? content : null;
    }

    render() {
        const {practice} = this.props.practiceViewStore;
        return (
            <BasePage
                title={practice ? interpolate(gettext('Assignment: %s'), [practice.title]) : null}
                subtitle={this.subtitleContents}
                pageType={PAGES.START_PAGE}
                renderRightButtons={this.renderRightButtons}
                styleName="mt-xxxl"
            >
                {practice.description && (
                    <RichTextViewer
                        data-purpose="practice-description"
                        unsafeHTML={practice.description}
                    />
                )}
            </BasePage>
        );
    }
}
