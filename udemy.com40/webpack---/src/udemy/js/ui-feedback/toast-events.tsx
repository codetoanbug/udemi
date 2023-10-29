import {Tracker, ClientEvent} from '@udemy/event-tracking';

/** This event is fired when a Toast is shown to a user within the Monolith. */
export class ToastImpressionEvent extends ClientEvent {
    constructor({useCase}: {useCase: string}) {
        super('ToastImpressionEvent');
        this.useCase = useCase;
    }

    useCase: string;
}

/**
 * `Tracker` is not available outside the monolith, thus we need to set the impression event outside
 * of Toast, so this component can be reused elsewhere.
 */
export const onToastImpressionEvent = (useCase: string) => {
    Tracker.publishEvent(
        new ToastImpressionEvent({
            useCase,
        }),
    );
};
