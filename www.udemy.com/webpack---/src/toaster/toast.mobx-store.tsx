import {getUniqueId} from '@udemy/design-system-utils';
import {observable, action} from 'mobx';

/**
 * This MobX store manages the toast visibility (for the sake of animation).
 *
 * @remarks
 * The only reason it exists rather than storing this state on the component directly is so that
 * {@link ToasterStore} can access it from outside the component to trigger the exit animation.
 */
export class ToastStore {
    constructor() {
        this.id = getUniqueId('toast');
    }

    @observable isVisible = false;
    id: string;

    @action
    showToast = () => {
        this.isVisible = true;
    };

    @action
    dismissToast = () => {
        // Triggers exit animation'
        this.isVisible = false;
    };
}
