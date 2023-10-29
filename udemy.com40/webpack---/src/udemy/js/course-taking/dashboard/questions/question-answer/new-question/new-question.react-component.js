import {Button} from '@udemy/react-core-components';
import {ToggleInputBlockFormGroup, RadioBlock} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {AVAILABILITY_OPTIONS, UNSPECIFIED} from 'course-manage-v2/availability/constants';

import requires from '../../../../registry/requires';
import InstructorCourseStatus from '../instructor-course-status.react-component';
import QuestionEditor from '../question-editor.react-component';
import './new-question.less';
import {
    CERTIFICATE_CATEGORY,
    AUDIO_VIDEO_CATEGORY,
    DOWNLOADING_RESOURCE_CATEGORY,
    OTHER_CATEGORY,
    NEW_QUESTION,
    SUPPORT_REQUEST,
    CERTIFICATION,
    VIDEO,
    DOWNLOADING,
    OTHER,
} from './constants';

@requires('courseTakingStore', 'questionAnswerStore')
@observer
export default class NewQuestion extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        questionAnswerStore: PropTypes.object.isRequired,
        editorTheme: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.newQuestion = this.props.questionAnswerStore.newQuestion;
        this.newQuestionStore = this.props.questionAnswerStore.newQuestionStore;
    }

    @autobind
    setOtherNextFormRadio(event) {
        const {category, supportLink} = event.target.dataset;
        this.newQuestionStore.setValuesForSupportForm(category, supportLink);
    }

    @autobind
    showRelatedForm() {
        this.newQuestionStore.showRelatedForm();
    }

    @autobind
    onSupportLinkClick() {
        this.newQuestionStore.trackSupportLink();
    }

    @autobind
    setNextFormRadio(event) {
        this.newQuestionStore.setNextForm(event.target.dataset.name);
    }

    @autobind
    openNextForm() {
        this.newQuestionStore.openNextForm();
    }

    get qaResponseStatus() {
        const instructorStatus = this.props.courseTakingStore.course.instructorStatus;
        if (instructorStatus && instructorStatus.status !== AVAILABILITY_OPTIONS[UNSPECIFIED]) {
            return <InstructorCourseStatus instructorStatus={instructorStatus} />;
        }
        if (
            this.props.courseTakingStore.isUserInstructor ||
            !this.props.questionAnswerStore.areNewAnswersDisabled
        ) {
            return null;
        }

        return (
            <AlertBanner
                udStyle="error"
                styleName="alert-banner"
                title={gettext(
                    'This instructor is no longer actively answering questions, but we encourage ' +
                        'you to continue to ask and answer questions from other students.',
                )}
                showCta={false}
            />
        );
    }

    get newQuestionForm() {
        const {questionAnswerStore} = this.props;

        return (
            <>
                <Button
                    udStyle="secondary"
                    styleName="back"
                    onClick={questionAnswerStore.backtoAllQuestions}
                >
                    {gettext('Back to all questions')}
                </Button>
                <AlertBanner
                    styleName="alert-banner"
                    showIcon={false}
                    title={gettext('Tips on getting your questions answered faster')}
                    body={
                        <ul>
                            <li>
                                {gettext('Search to see if your question has been asked before')}
                            </li>
                            <li>
                                {gettext(
                                    'Be detailed; provide screenshots, error messages, code, or other clues whenever possible',
                                )}
                            </li>
                            <li>{gettext('Check grammar and spelling')}</li>
                        </ul>
                    }
                    showCta={false}
                />
                {this.qaResponseStatus}
                <QuestionEditor
                    question={this.newQuestion}
                    extraTitleEditorProps={{
                        placeholder: gettext(
                            'e.g. Why do we use fit_transform() for training_set?',
                        ),
                    }}
                    extraBodyEditorProps={{
                        placeholder: gettext(
                            "e.g.  At 05:28, I didn't understand this part, here is a screenshot of what I tried...",
                        ),
                        theme: this.props.editorTheme,
                    }}
                    submitBtnLabel={gettext('Publish')}
                    onSave={this.props.onClose}
                />
            </>
        );
    }

    get newQuestionPreForm() {
        const {questionAnswerStore} = this.props;
        const sharedRadioProps = {
            name: 'preFormRadio',
            onChange: this.setNextFormRadio,
        };
        const newQuesRadioBlock = [
            {
                quesType: NEW_QUESTION,
                radioTitle: gettext('Course content'),
                radioDetails: gettext(
                    'This might include comments, questions, tips, or projects to share',
                ),
            },
            {
                quesType: SUPPORT_REQUEST,
                radioTitle: gettext('Something else'),
                radioDetails: gettext(
                    'This might include questions about certificates, audio and video troubleshooting, or download issues',
                ),
            },
        ];
        return (
            <>
                <Button
                    udStyle="secondary"
                    styleName="back"
                    onClick={questionAnswerStore.backtoAllQuestions}
                >
                    {gettext('Back to all questions')}
                </Button>
                <form>
                    <ToggleInputBlockFormGroup label={gettext('My question relates to')}>
                        {newQuesRadioBlock.map((radioBlock) => (
                            <RadioBlock
                                key={radioBlock.quesType}
                                data-name={radioBlock.quesType}
                                checked={this.newQuestionStore.nextForm === radioBlock.quesType}
                                {...sharedRadioProps}
                                details={radioBlock.radioDetails}
                            >
                                {radioBlock.radioTitle}
                            </RadioBlock>
                        ))}
                    </ToggleInputBlockFormGroup>
                    <Button
                        styleName="submit-btn"
                        onClick={this.openNextForm}
                        data-purpose="related-form-submit"
                        disabled={!this.newQuestionStore.nextForm}
                    >
                        {gettext('Continue')}
                    </Button>
                </form>
            </>
        );
    }

    get newQuestionOtherPreForm() {
        const sharedRadioProps = {
            name: 'preFormLinkRadio',
            onChange: this.setOtherNextFormRadio,
        };

        return (
            <>
                <Button udStyle="secondary" styleName="back" onClick={this.showRelatedForm}>
                    {gettext('Back')}
                </Button>
                <form>
                    <AlertBanner
                        styleName="alert-banner"
                        showIcon={false}
                        title={gettext(
                            'My question relates to something outside of course content.',
                        )}
                        showCta={false}
                    />
                    <ToggleInputBlockFormGroup label={gettext('Is it one of the following?')}>
                        <RadioBlock
                            checked={this.newQuestionStore.supportLink === CERTIFICATION}
                            data-support-link={CERTIFICATION}
                            data-category={CERTIFICATE_CATEGORY}
                            {...sharedRadioProps}
                        >
                            {gettext('Certificates and accreditation')}
                        </RadioBlock>
                        <RadioBlock
                            checked={this.newQuestionStore.supportLink === VIDEO}
                            data-support-link={VIDEO}
                            data-category={AUDIO_VIDEO_CATEGORY}
                            {...sharedRadioProps}
                        >
                            {gettext('Audio and video troubleshooting')}
                        </RadioBlock>
                        <RadioBlock
                            checked={this.newQuestionStore.supportLink === DOWNLOADING}
                            data-support-link={DOWNLOADING}
                            data-category={DOWNLOADING_RESOURCE_CATEGORY}
                            {...sharedRadioProps}
                        >
                            {gettext('Downloading resources')}
                        </RadioBlock>
                        <RadioBlock
                            checked={this.newQuestionStore.supportLink === OTHER}
                            data-support-link={OTHER}
                            data-category={OTHER_CATEGORY}
                            {...sharedRadioProps}
                        >
                            {gettext('It’s something else')}
                        </RadioBlock>
                    </ToggleInputBlockFormGroup>
                    <Button
                        styleName="submit-btn"
                        disabled={!this.newQuestionStore.supportLink}
                        componentClass="a"
                        target="_blank"
                        href={this.newQuestionStore.supportLink}
                        onClick={this.onSupportLinkClick}
                    >
                        {gettext('Continue')}
                    </Button>
                </form>
            </>
        );
    }

    render() {
        return (
            <div styleName="container">
                {this.newQuestionStore.isRelatedFormOpen
                    ? this.newQuestionStore.isSupportFormOpen
                        ? this.newQuestionOtherPreForm
                        : this.newQuestionPreForm
                    : this.newQuestionForm}
            </div>
        );
    }
}
