import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import GoogleIcon from '@udemy/icons/dist/google.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button, ButtonStyleType} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {GoogleCalendarAuthStore} from './google-calendar-auth.mobx-store';
import {GoogleCalendarButtonStore} from './google-calendar-button.mobx-store';
import './google-calendar-button.less';

interface GoogleCalendarButtonProps {
    action: string;
    googleAuthStore: GoogleCalendarAuthStore;
    udStyle: ButtonStyleType;
    typography: string;
    formStore: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
    onComplete: () => void;
}
@observer
export class GoogleCalendarButton extends Component<GoogleCalendarButtonProps> {
    static defaultProps = {
        udStyle: 'secondary',
        typography: null,
        learningToolsStore: null,
        onComplete: noop,
    };

    constructor(props: GoogleCalendarButtonProps) {
        super(props);
        this.store = new GoogleCalendarButtonStore(
            this.props.action,
            this.props.googleAuthStore,
            this.props.formStore,
            this.props.learningToolsStore,
            this.props.onComplete,
        );
        this.isUpdateButton = this.props.action === 'update';
        this.isLink = this.props.udStyle !== 'link';
    }

    store: GoogleCalendarButtonStore;
    isUpdateButton: boolean;
    isLink: boolean;

    @autobind
    @action
    onClick() {
        this.store.handleClick();
    }

    render() {
        return (
            <Button
                udStyle={this.props.udStyle}
                typography={this.props.typography}
                disabled={this.store.isAuthenticating}
                onClick={this.onClick}
            >
                <GoogleIcon label={gettext('Google')} styleName="google-icon" />

                <span styleName={this.isLink ? '' : 'google-link'}>
                    {this.store.getButtonText()}
                </span>
                {this.store.isLoading && <Loader color="inherit" size="small" />}
                {this.store.downloadSucceeded && (
                    <SuccessIcon
                        color={this.isUpdateButton ? undefined : 'positive'}
                        className="icon"
                        label={gettext('Download succeeded')}
                    />
                )}
                {this.store.downloadFailed && (
                    <ErrorIcon
                        color={this.isUpdateButton ? undefined : 'negative'}
                        className="icon"
                        label={gettext('Download failed')}
                    />
                )}
            </Button>
        );
    }
}
