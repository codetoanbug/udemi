import {Tracker} from '@udemy/event-tracking';
import AddCircleSolidIcon from '@udemy/icons/dist/add-circle-solid.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Loader, ShowMore} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getConfigData from 'utils/get-config-data';

import {GoogleCalendarAuthStore} from '../calendar-button/google-calendar-auth.mobx-store';
import LearningReminderActionEvent from '../events';
import {LearningReminderFormModal} from '../learning-reminder-modal/learning-reminder-form-modal.react-component';
import {LearningReminderModalStore} from '../learning-reminder-modal/learning-reminder-modal.mobx-store';
import {LearningReminder} from './learning-reminder.react-component';
import {LearningToolsStore} from './learning-tools.mobx-store';
import {MobileAppSMSDownload} from './mobile-app-sms-download.react-component';

import './learning-tools.less';

const udConfig = getConfigData();

interface LearningToolsProps {
    googleAuthStore: GoogleCalendarAuthStore;
    shouldRedirect: boolean;
}

@observer
export class LearningTools extends Component<LearningToolsProps> {
    static propTypes = {
        googleAuthStore: PropTypes.object.isRequired,
        shouldRedirect: PropTypes.bool,
    };

    static defaultProps = {
        shouldRedirect: true,
    };

    constructor(props: LearningToolsProps) {
        super(props);
        this.store = new LearningToolsStore();
        this.learningReminderModalStore = new LearningReminderModalStore();
    }

    componentDidMount() {
        if (!getConfigData().brand.organization && !this.props.googleAuthStore.tokenClient)
            this.props.googleAuthStore.loadGoogleAuth();
        this.store.loadLearningCalendarReminders();
    }

    store: LearningToolsStore;
    private readonly learningReminderModalStore: LearningReminderModalStore;

    @autobind
    renderReminderModal() {
        Tracker.publishEvent(
            new LearningReminderActionEvent({
                reminderId: null,
                action: 'start',
                frequency: 'once',
                duration: 0,
                until: null,
                title: gettext('Time to learn!'),
                linkedObjectType: null,
                linkedObjectId: null,
                calendarType: 'other',
            }),
        );
        this.learningReminderModalStore.trackCTAClick();
        this.learningReminderModalStore.openModal();
    }

    render() {
        const scheduledReminders = (
            <>
                {this.store.scheduledReminders?.map((reminder) => {
                    return (
                        <div styleName="reminder-container scheduled" key={reminder.id}>
                            <LearningReminder
                                learningReminder={reminder}
                                learningToolsStore={this.store}
                                googleAuthStore={this.props.googleAuthStore}
                            />
                        </div>
                    );
                })}
            </>
        );
        const deletedReminders = (
            <>
                {this.store.deletedReminders?.map((reminder) => {
                    return (
                        <div styleName="reminder-container deleted" key={reminder.id}>
                            <LearningReminder
                                learningReminder={reminder}
                                learningToolsStore={this.store}
                                googleAuthStore={this.props.googleAuthStore}
                            />
                        </div>
                    );
                })}
            </>
        );
        const hidePushNotificationUnit =
            udConfig.brand.has_organization && udConfig.brand.is_mobile_app_enabled;

        return (
            <div styleName="learning-tools-container">
                <h2 className="ud-heading-xl">{gettext('Learning reminders')}</h2>
                <h3 className="ud-heading-lg">{gettext('Calendar events')}</h3>
                <p>
                    {gettext(
                        'Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.',
                    )}
                </p>
                <div className="ud-text-xs" styleName="subtext">
                    {gettext('Requires Google Calendar, Apple Calendar, or Outlook')}
                </div>
                <Button
                    onClick={this.renderReminderModal}
                    data-purpose="create-reminder-button"
                    udStyle="brand"
                    styleName="create-button"
                >
                    {gettext('Schedule learning time')}
                    <AddCircleSolidIcon label={false} />
                </Button>
                {this.store.scheduledReminders ? (
                    scheduledReminders
                ) : (
                    <Loader block={true} styleName="loader" />
                )}
                <ShowMore
                    collapsedHeight={0}
                    moreButtonLabel={gettext('Show deleted')}
                    lessButtonLabel={gettext('Hide deleted')}
                    styleName="show-more"
                >
                    {deletedReminders}
                </ShowMore>
                <LearningReminderFormModal
                    learningReminderModalStore={this.learningReminderModalStore}
                    googleAuthStore={this.props.googleAuthStore}
                    shouldRedirect={false}
                    learningToolsStore={this.store}
                />
                {!hidePushNotificationUnit && (
                    <div data-purpose="mobile-app-download">
                        <MobileAppSMSDownload />
                    </div>
                )}
            </div>
        );
    }
}
