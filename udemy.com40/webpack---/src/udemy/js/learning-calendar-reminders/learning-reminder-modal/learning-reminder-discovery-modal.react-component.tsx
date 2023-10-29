import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {GoogleCalendarAuthStore} from 'learning-calendar-reminders/calendar-button/google-calendar-auth.mobx-store';
import udLink from 'utils/ud-link';

import {CreateReminderForm} from '../learning-reminder-form/create-reminder-form.react-component';
import {LearningReminderFormStore} from '../learning-reminder-form/learning-reminder-form.mobx-store';
import {LearningReminderModalStore} from './learning-reminder-modal.mobx-store';

import './learning-reminder-modal.less';

interface LearningReminderDiscoveryModalProps {
    googleAuthStore: GoogleCalendarAuthStore;
    learningReminderModalStore?: LearningReminderModalStore;
    shouldRedirect: boolean;
}
@observer
export class LearningReminderDiscoveryModal extends Component<LearningReminderDiscoveryModalProps> {
    static defaultProps = {
        shouldRedirect: true,
    };

    constructor(props: LearningReminderDiscoveryModalProps) {
        super(props);
        this.learningReminderModalStore =
            this.props.learningReminderModalStore ?? new LearningReminderModalStore();
        this.createReminderFormStore = new LearningReminderFormStore(
            this.props.googleAuthStore,
            this.props.shouldRedirect,
            false,
            null,
        );
        this.learningReminderModalStore.openModal(); // open model on mount by default
    }

    @observable private ctaClicked = false;
    private readonly learningReminderModalStore: LearningReminderModalStore;
    private readonly createReminderFormStore: LearningReminderFormStore;
    renderLearningReminder() {
        return (
            <CreateReminderForm
                store={this.createReminderFormStore}
                onFormCompleted={this.learningReminderModalStore.closeModal}
            />
        );
    }

    @autobind
    @action
    onCTAClick() {
        this.learningReminderModalStore.trackCTAClick();
        this.ctaClicked = true;
    }

    @autobind
    @action
    onModalClose() {
        this.learningReminderModalStore.deEscalateModal();
    }

    renderGetStarted() {
        return (
            <>
                <Image
                    styleName="banner"
                    width={368}
                    height={224}
                    alt=""
                    data-purpose="banner"
                    src={udLink.toStorageStaticAsset(
                        'learning-reminder/learning-reminder-modal-banner.png',
                    )}
                    srcSet={`${udLink.toStorageStaticAsset(
                        'learning-reminder/learning-reminder-modal-banner.png',
                    )} 1x, ${udLink.toStorageStaticAsset(
                        'learning-reminder/learning-reminder-modal-banner-2x.png',
                    )} 2x`}
                />
                <h2 styleName="title" className="ud-heading-xxl" data-purpose="title">
                    {gettext('Schedule time to learn')}
                </h2>
                <p className="ud-text-md">
                    {gettext(
                        'Learning a little each day adds up. Research shows that students who make learning a habit' +
                            ' are more likely to retain information and reach their goals. Set time aside to learn and ' +
                            'get reminders using your learning event scheduler.',
                    )}
                </p>

                <FooterButtons>
                    <Button
                        data-purpose="remind-me-later-cta"
                        udStyle="ghost"
                        onClick={this.learningReminderModalStore.delayModal}
                    >
                        {gettext('Remind me later')}
                    </Button>
                    <Button data-purpose="get-started-cta" onClick={this.onCTAClick}>
                        {gettext('Get started')}
                    </Button>
                </FooterButtons>
            </>
        );
    }

    render() {
        const modalTitle = this.ctaClicked ? gettext('Create an event') : '';
        return (
            <Modal
                title={modalTitle}
                isOpen={this.learningReminderModalStore.isModalOpen}
                onClose={this.onModalClose}
            >
                {this.ctaClicked ? this.renderLearningReminder() : this.renderGetStarted()}
            </Modal>
        );
    }
}
