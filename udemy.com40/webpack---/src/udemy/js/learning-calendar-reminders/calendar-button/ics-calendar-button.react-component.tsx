import AppleIcon from '@udemy/icons/dist/apple.ud-icon';
import DownloadFileIcon from '@udemy/icons/dist/download-file.ud-icon';
import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import OutlookIcon from '@udemy/icons/dist/outlook.ud-icon';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button, ButtonHtmlProps} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './ics-calendar-button.less';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {IcsCalendarButtonStore} from './ics-calendar-button.mobx-store';

interface IcsCalendarButtonProps extends ButtonHtmlProps {
    action: string;
    formStore: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
    onComplete: () => void;
    calendarType: string | null;
}
@observer
export class IcsCalendarButton extends Component<IcsCalendarButtonProps> {
    static defaultProps = {
        udStyle: 'secondary',
        typography: null,
        learningToolsStore: null,
        onComplete: noop,
        calendarType: null,
    };

    constructor(props: IcsCalendarButtonProps) {
        super(props);
        this.calendarType = this.props.calendarType ?? this.props.formStore.calendarType;
        this.store = new IcsCalendarButtonStore(
            this.props.action,
            this.props.formStore,
            this.props.learningToolsStore,
            this.props.onComplete,
            this.calendarType,
        );
    }

    private readonly calendarType: string | null;
    store: IcsCalendarButtonStore;

    @autobind
    @action
    onClick() {
        this.store.handleCalendarEvents();
    }

    @autobind
    getIcon() {
        if (this.props.action !== 'create') {
            return null;
        }

        switch (this.calendarType) {
            case 'apple':
                return <AppleIcon label={gettext('Apple')} styleName="apple-icon" />;
            case 'outlook':
                return <OutlookIcon label={gettext('Outlook')} />;
        }
        return null;
    }

    render() {
        return (
            <Button
                udStyle={this.props.udStyle}
                typography={this.props.typography}
                onClick={this.onClick}
            >
                {this.getIcon()}
                {this.store.getButtonText()}
                {this.store.calendarType === 'other' && (
                    <DownloadFileIcon label={gettext('Download file')} />
                )}
                {this.store.isLoading && <Loader color="inherit" size="small" />}
                {this.store.downloadSucceeded && (
                    <SuccessIcon
                        color="positive"
                        className="icon"
                        label={gettext('Download succeeded')}
                    />
                )}
                {this.store.downloadFailed && (
                    <ErrorIcon
                        color="negative"
                        className="icon"
                        label={gettext('Download failed')}
                    />
                )}
            </Button>
        );
    }
}
