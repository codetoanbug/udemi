import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {FormGroup, TextArea, Checkbox} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';
import {showErrorToast, showSuccessToast} from 'instructor/toasts';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {minLengthOfApplyDraftDescription} from '../constants';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './apply-draft-form.less';

@observer
export default class ApplyDraftForm extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.props.curriculumItem.resetNumAllowedAnnouncements();
    }

    componentDidMount() {
        this.props.curriculumItem.getNumAllowedAnnouncements().catch(handleUnexpectedAPIError);
    }

    get form() {
        return this.props.curriculumItem.applyDraftForm;
    }

    @autobind
    onFormControlInputChange(event) {
        this.form.setField(event.target.name, event.target.value);
    }

    @autobind
    onToggleInputChange(event) {
        this.form.setField(event.target.name, event.target.checked);
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        const sendAnnouncement = this.form.data.sendAnnouncement;
        this.props.curriculumItem
            .applyDraft()
            .then(() => {
                if (sendAnnouncement) {
                    showSuccessToast(
                        gettext(
                            'Changes published and educational announcement sent successfully.',
                        ),
                    );
                } else {
                    showSuccessToast(gettext('Changes published successfully.'));
                }
                this.form.reset();
            })
            .catch((error) => {
                if (error.isAnnouncementError) {
                    showErrorToast(
                        gettext(
                            'Changes published successfully, but there was an error sending your educational announcement.',
                        ),
                    );
                } else {
                    handleUnexpectedAPIError(error);
                }
            });
        this.props.curriculumItem.closeApplyDraftModal();
    }

    render() {
        const {curriculumItem} = this.props;
        const form = this.form;
        return (
            <form data-purpose="apply-draft-form" onSubmit={this.onSubmit}>
                <FormGroup
                    label={gettext('Description')}
                    labelProps={{className: 'ud-sr-only'}}
                    note={gettext(
                        'Note - existing students will see this message on their practice test results page',
                    )}
                >
                    <TextArea
                        data-purpose="description"
                        minLength={minLengthOfApplyDraftDescription}
                        name="description"
                        value={form.data.description}
                        onChange={this.onFormControlInputChange}
                        rows="4"
                    />
                </FormGroup>
                <div styleName="send-announcement-row">
                    <Checkbox
                        name="sendAnnouncement"
                        size="large"
                        checked={form.data.sendAnnouncement}
                        data-purpose="send-announcement"
                        disabled={
                            !curriculumItem.announcementRateLimit ||
                            curriculumItem.announcementRateLimit.numRemaining === 0
                        }
                        onChange={this.onToggleInputChange}
                    >
                        <span>
                            {gettext('Send as Educational Announcement')}
                            {curriculumItem.announcementRateLimit ? (
                                <span
                                    {...safelySetInnerHTML({
                                        descriptionOfCaller: 'apply-draft-form:count-out-of-left',
                                        html: `&nbsp;${interpolate(
                                            gettext(
                                                '<b>(%(count)s</b> out of <b>%(max_count)s</b> left this month)',
                                            ),
                                            {
                                                count:
                                                    curriculumItem.announcementRateLimit
                                                        .numRemaining,
                                                max_count:
                                                    curriculumItem.announcementRateLimit.maxAllowed,
                                            },
                                            true,
                                        )}`,
                                    })}
                                />
                            ) : null}
                        </span>
                    </Checkbox>
                    <Popover
                        placement="bottom"
                        styleName="send-announcement-popover"
                        trigger={
                            <IconButton udStyle="ghost" size="small">
                                <InfoIcon color="neutral" label={gettext('Get info')} />
                            </IconButton>
                        }
                    >
                        {gettext(
                            'Use when you want students to get notified of changes by email and in the notification bell on Udemy.',
                        )}
                    </Popover>
                </div>
                <FooterButtons>
                    <Button udStyle="ghost" onClick={curriculumItem.closeApplyDraftModal}>
                        {gettext('Cancel')}
                    </Button>
                    <Button type="submit" disabled={!form.isValid}>
                        {gettext('Publish Changes')}
                    </Button>
                </FooterButtons>
            </form>
        );
    }
}
