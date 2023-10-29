import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {FeatureEvents} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {noop} from 'utils/noop';

import {LearningToolsStore} from '../learning-tools/learning-tools.mobx-store';
import {LearningReminderFormStore} from './learning-reminder-form.mobx-store';
import {ReminderDetails} from './reminder-details.react-component';
import {ReminderDownload} from './reminder-download.react-component';
import {ReminderName} from './reminder-name.react-component';

import './learning-reminder-form.less';

const PAGES = [ReminderName, ReminderDetails, ReminderDownload];

interface CreateReminderFormProps {
    store: LearningReminderFormStore;
    learningToolsStore: LearningToolsStore;
    onFormCompleted: () => void;
}

@observer
export class CreateReminderForm extends Component<CreateReminderFormProps> {
    static defaultProps = {
        learningToolsStore: null,
        onFormCompleted: noop,
    };

    @autobind
    onComplete() {
        this.props.store.onComplete();
        if (!this.props.store.shouldRedirect) {
            this.props.onFormCompleted();
        }
        // Trigger state change for feature discoverability
        document.dispatchEvent(new CustomEvent(FeatureEvents.DESIRED_ACTION));
    }

    render() {
        const PageComponent = PAGES[this.props.store.currentStep];
        return (
            <>
                <PageComponent
                    store={this.props.store}
                    learningToolsStore={this.props.learningToolsStore}
                />

                <div styleName="button-container">
                    {this.props.store.canGoBack() && (
                        <Button
                            udStyle="secondary"
                            data-purpose="back-button"
                            onClick={this.props.store.goBack}
                            styleName="back-button"
                        >
                            {gettext('Previous')}
                        </Button>
                    )}
                    {this.props.store.canGoForward() ? (
                        <Button
                            udStyle="primary"
                            data-purpose="next-button"
                            onClick={this.props.store.goForward}
                        >
                            {gettext('Next')}
                        </Button>
                    ) : (
                        <Button
                            udStyle="primary"
                            data-purpose="done-button"
                            onClick={this.onComplete}
                        >
                            {gettext('Done')}
                        </Button>
                    )}
                </div>
            </>
        );
    }
}
