import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {IcsCalendarButton} from '../calendar-button/ics-calendar-button.react-component';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {uppercaseFirstChar} from '../utils';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';
import {ReminderDetails} from './reminder-details.react-component';
import {ReminderName} from './reminder-name.react-component';
import {UpdateReminderDownload} from './update-reminder-download.react-component';

import './learning-reminder-form.less';

const PAGES = [ReminderName, ReminderDetails, UpdateReminderDownload];

interface UpdateReminderFormProps {
    store: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
}

@observer
export class UpdateReminderForm extends Component<UpdateReminderFormProps> {
    static propTypes = {
        store: PropTypes.object.isRequired,
        learningToolsStore: PropTypes.object.isRequired,
    };

    @autobind
    onClickUpdate() {
        this.props.store.setClickUpdateGoogle(true);
    }

    render() {
        const PageComponent = PAGES[this.props.store.currentStep];
        const {store} = this.props;

        const googleDownloadButton = this.props.store.clickedUpdateGoogle ? null : (
            <Button onClick={this.onClickUpdate}>{gettext('Update')}</Button>
        );

        const downloadButton =
            store.calendarType === 'google' ? (
                googleDownloadButton
            ) : (
                <IcsCalendarButton
                    calendarType={store.calendarType}
                    action={'update'}
                    formStore={store}
                    learningToolsStore={this.props.learningToolsStore}
                    udStyle="primary"
                />
            );

        const isLastPage = !store.canGoForward();

        return (
            <>
                <PageComponent store={store} learningToolsStore={this.props.learningToolsStore} />

                <div styleName="button-container">
                    {store.canGoBack() && !isLastPage && (
                        <Button
                            udStyle="secondary"
                            data-purpose="back-button"
                            onClick={store.goBack}
                            styleName="back-button"
                        >
                            {gettext('Previous')}
                        </Button>
                    )}
                    {store.canGoForward() && !isLastPage && (
                        <Button
                            udStyle="primary"
                            data-purpose="next-button"
                            onClick={store.goForward}
                        >
                            {gettext('Next')}
                        </Button>
                    )}
                    {isLastPage && (
                        <FormGroup
                            styleName="button-group-container"
                            label={
                                store.calendarType === 'google'
                                    ? gettext('Update your event')
                                    : gettext('Update and download your event')
                            }
                            labelProps={{className: 'ud-sr-only'}}
                            validationState={store.downloadValidationState}
                            note={store.calendarType === 'google' ? null : store.downloadErrorNote}
                        >
                            <Button
                                udStyle="secondary"
                                data-purpose="back-button"
                                onClick={store.goBack}
                                styleName="back-button"
                            >
                                {gettext('Previous')}
                            </Button>
                            {downloadButton}
                        </FormGroup>
                    )}
                </div>
                {isLastPage && store.calendarType !== 'google' && (
                    <div className="ud-text-xs" styleName="update-hint">
                        {store.calendarType &&
                            interpolate(
                                gettext(
                                    '%(calendarType)s will download an ics file. Open the file to update the event in your calendar.',
                                ),
                                {
                                    calendarType: uppercaseFirstChar(store.calendarType),
                                },
                                true,
                            )}
                    </div>
                )}
            </>
        );
    }
}
