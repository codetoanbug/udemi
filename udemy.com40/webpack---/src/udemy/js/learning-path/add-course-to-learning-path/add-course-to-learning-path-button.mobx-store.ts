import {AlertBannerProps, ToasterStore} from '@udemy/react-messaging-components';
import {observable, action} from 'mobx';

export class AddCourseToLearningPathButtonStore {
    constructor() {
        this.setIsLearningPathModalVisible = this.setIsLearningPathModalVisible.bind(this);
        this.onCourseAdded = this.onCourseAdded.bind(this);
    }

    @observable isLearningPathModalVisible = false;

    @action
    setIsLearningPathModalVisible(isLearningPathModalVisible: boolean) {
        this.isLearningPathModalVisible = isLearningPathModalVisible;
    }

    @action
    onCourseAdded(message: string) {
        const alertBannerProps: AlertBannerProps = {
            udStyle: 'success',
            title: message,
            body: '',
            showCta: false,
        };
        ToasterStore.addAlertBannerToast(alertBannerProps, {
            autoDismiss: true,
            autoDismissTimeout: 5000,
        });
    }
}
