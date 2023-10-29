import {FormGroup} from '@udemy/react-form-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import './learning-reminder-form.less';

import {GoogleCalendarButton} from '../calendar-button/google-calendar-button.react-component';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';
import {ReminderInfo} from './reminder-info.react-component';

interface UpdateReminderDownloadProps {
    store: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
}

@observer
export class UpdateReminderDownload extends Component<UpdateReminderDownloadProps> {
    render() {
        const {store} = this.props;

        return (
            <>
                <div className="ud-text-sm" styleName="progress-text">
                    {gettext('Step 3 of 3')}
                </div>
                {store.clickedUpdateGoogle ? (
                    <FormGroup
                        label={
                            store.calendarType === 'google'
                                ? gettext('To update your event, sign in with Google')
                                : null
                        }
                        validationState={store.downloadValidationState}
                        note={store.calendarType === 'google' ? store.downloadErrorNote : null}
                    >
                        <GoogleCalendarButton
                            action={'update'}
                            googleAuthStore={store.googleAuthStore}
                            formStore={store}
                            learningToolsStore={this.props.learningToolsStore}
                        />
                    </FormGroup>
                ) : (
                    <ReminderInfo store={store} />
                )}
            </>
        );
    }
}
