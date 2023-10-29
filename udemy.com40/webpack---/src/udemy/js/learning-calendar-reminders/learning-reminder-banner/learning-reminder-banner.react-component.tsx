import AlarmIcon from '@udemy/icons/dist/alarm.ud-icon';
import {Badge, AlertBannerContent} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {FeatureEvents} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import {LearningReminderFormModal} from 'learning-calendar-reminders/learning-reminder-modal/learning-reminder-form-modal.react-component';
import {LearningReminderModalStore} from 'learning-calendar-reminders/learning-reminder-modal/learning-reminder-modal.mobx-store';
import getConfigData from 'utils/get-config-data';
import './learning-reminder-banner.less';

interface AlertBannerProps {
    className: string;
}

interface LearningReminderBannerProps {
    googleAuthStore: GoogleCalendarAuthStore;
    shouldRedirect: boolean;
    showIcon: boolean;
    showDismiss?: boolean;
    alertBannerProps?: AlertBannerProps;
    customTitle?: React.ReactElement;
    showBadge?: boolean;
    contentType?: string;
    objectId?: number;
    objectTitle?: string;
    objectUrl?: string;
    learningReminderTitle?: string;
}

@observer
export class LearningReminderBanner extends Component<LearningReminderBannerProps> {
    static propTypes = {
        googleAuthStore: PropTypes.object.isRequired,
        shouldRedirect: PropTypes.bool,
        showIcon: PropTypes.bool,
        showDismiss: PropTypes.bool,
        alertBannerProps: PropTypes.object,
        customTitle: PropTypes.node,
        showBadge: PropTypes.bool,
        contentType: PropTypes.string,
        objectId: PropTypes.number,
        objectTitle: PropTypes.string,
        objectUrl: PropTypes.string,
        learningReminderTitle: PropTypes.string,
    };

    static defaultProps = {
        shouldRedirect: true,
        showIcon: true,
        showDismiss: true,
        alertBannerProps: {},
        customTitle: undefined,
        showBadge: false,
        contentType: null,
        objectId: null,
        objectTitle: null,
        objectUrl: null,
        learningReminderTitle: null,
    };

    constructor(props: LearningReminderBannerProps) {
        super(props);
        this.learningReminderModalStore = new LearningReminderModalStore();
    }

    componentDidMount() {
        if (!getConfigData().brand.organization && !this.props.googleAuthStore.tokenClient)
            this.props.googleAuthStore.loadGoogleAuth();
    }

    private readonly learningReminderModalStore: LearningReminderModalStore;

    @autobind
    onDismissClick() {
        // trigger delay event for feature discoverability to put feature in paused state
        document.dispatchEvent(new CustomEvent(FeatureEvents.DELAY_TO_DORMANT));
    }

    get submitText() {
        return gettext('Get started');
    }

    get dismissText() {
        return gettext('Dismiss');
    }

    get title() {
        return this.props.customTitle ?? gettext('Schedule learning time');
    }

    get subtitle() {
        return gettext(
            'Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.',
        );
    }

    @autobind
    @action
    onCTAClick() {
        this.learningReminderModalStore.trackCTAClick();
        this.learningReminderModalStore.openModal();
    }

    render() {
        const dismissButtonProps = this.props.showDismiss ? {} : false;

        return (
            <div data-purpose="learning-reminder-banner">
                {this.props.showBadge && (
                    <Badge styleName="new-badge-green">{gettext('New')}</Badge>
                )}
                <AlertBannerContent
                    ctaText={this.submitText}
                    title={this.title}
                    body={this.subtitle}
                    icon={this.props.showIcon ? <AlarmIcon label={false} size="large" /> : null}
                    onAction={this.onCTAClick}
                    dismissButtonText={this.dismissText}
                    onDismiss={this.onDismissClick}
                    showIcon={this.props.showIcon}
                    dismissButtonProps={dismissButtonProps}
                    {...this.props.alertBannerProps}
                />
                <LearningReminderFormModal
                    googleAuthStore={this.props.googleAuthStore}
                    learningReminderModalStore={this.learningReminderModalStore}
                    shouldRedirect={this.props.shouldRedirect}
                    contentType={this.props.contentType}
                    objectId={this.props.objectId}
                    objectTitle={this.props.objectTitle}
                    objectUrl={this.props.objectUrl}
                    title={this.props.learningReminderTitle}
                />
            </div>
        );
    }
}
