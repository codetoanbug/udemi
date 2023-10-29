import {Tracker} from '@udemy/event-tracking';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';

import {FeatureEvents} from 'browse/components/feature-discovery/feature-discoverability.mobx-store';
import {FeatureDiscoverabilityEventName} from 'browse/components/feature-discovery/feature-discoverability.react-component';

import LearningReminderActionEvent from '../events';

export class LearningReminderModalStore {
    @observable isModalOpen = false;

    @autobind
    @action
    trackCTAClick() {
        // Trigger get started event for feature discoverability
        document.dispatchEvent(new CustomEvent(FeatureDiscoverabilityEventName.CTA_CLICKED));
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
    }

    @autobind
    @action
    openModal() {
        this.isModalOpen = true;
    }

    @autobind
    @action
    closeModal() {
        this.isModalOpen = false;
    }

    @autobind
    @action
    deEscalateModal() {
        // Close modal and trigger de-escalate event for feature discoverability
        document.dispatchEvent(new CustomEvent(FeatureEvents.DE_ESCALATE));
        this.closeModal();
    }

    @autobind
    @action
    delayModal() {
        // Close modal and trigger de-escalate event for feature discoverability
        document.dispatchEvent(new CustomEvent(FeatureEvents.DELAY_TO_PAUSED));
        this.closeModal();
    }
}
