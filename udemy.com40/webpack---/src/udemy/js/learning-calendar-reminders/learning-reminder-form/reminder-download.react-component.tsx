import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';
import udLink from 'utils/ud-link';
import './learning-reminder-form.less';

import {GoogleCalendarButton} from '../calendar-button/google-calendar-button.react-component';
import {IcsCalendarButton} from '../calendar-button/ics-calendar-button.react-component';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';
import {ReminderInfo} from './reminder-info.react-component';

interface ReminderDownloadProps {
    store: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
}

@observer
export class ReminderDownload extends Component<ReminderDownloadProps> {
    static defaultProps = {
        learningToolsStore: null,
    };

    render() {
        const {store} = this.props;

        return (
            <>
                <div className="ud-text-sm" styleName="progress-text">
                    {gettext('Step 3 of 3')}
                </div>
                <ReminderInfo store={store} />
                {!getConfigData().brand.organization ? (
                    <>
                        <FormGroup
                            styleName="download-button-group-container"
                            label={gettext('Save your event')}
                            validationState={store.downloadValidationState}
                            note={store.downloadErrorNote}
                        >
                            <GoogleCalendarButton
                                action={'create'}
                                googleAuthStore={store.googleAuthStore}
                                formStore={store}
                                learningToolsStore={this.props.learningToolsStore}
                            />
                            <IcsCalendarButton
                                calendarType={'apple'}
                                action={'create'}
                                formStore={store}
                                learningToolsStore={this.props.learningToolsStore}
                            />
                            <IcsCalendarButton
                                calendarType={'outlook'}
                                action={'create'}
                                formStore={store}
                                learningToolsStore={this.props.learningToolsStore}
                            />
                        </FormGroup>
                        <div className="ud-text-xs" styleName="hint">
                            {gettext(
                                'Apple and Outlook will download an ics file. Open this file to add it to your calendar.',
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <FormGroup
                            styleName="download-button-group-container"
                            label={gettext('Save your event')}
                            validationState={store.downloadValidationState}
                            note={store.downloadErrorNote}
                        >
                            <IcsCalendarButton
                                calendarType={'other'}
                                action={'create'}
                                formStore={store}
                                learningToolsStore={this.props.learningToolsStore}
                            />
                        </FormGroup>
                        <div className="ud-text-xs" styleName="hint">
                            {gettext('Open the downloaded .ics file to add it to your calendar.')}
                            <Popover
                                placement="bottom"
                                trigger={
                                    <InfoOutlineIcon
                                        label={false}
                                        size="small"
                                        styleName="tooltip-icon"
                                    />
                                }
                            >
                                <div styleName="reminder-info-popover-content">
                                    <div data-purpose="title" className="ud-heading-sm">
                                        {gettext('Having trouble?')}
                                    </div>
                                    <div data-purpose="text" className="ud-text-sm">
                                        {gettext(
                                            'Get help adding events to your calendar in our step-by-step support article.',
                                        )}
                                    </div>
                                    <Button
                                        componentClass="a"
                                        data-purpose="help-button"
                                        udStyle="secondary"
                                        size="small"
                                        href={udLink.toSupportLink(
                                            'scheduler_learning_event',
                                            true,
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {gettext('Get help')}
                                    </Button>
                                </div>
                            </Popover>
                        </div>
                    </>
                )}
            </>
        );
    }
}
