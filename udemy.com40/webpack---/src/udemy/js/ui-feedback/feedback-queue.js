import {action, observable} from 'mobx';

// You probably want to use toasterStore directly.
//
// This is a singleton queue that feeds into toasterStore.
// It is for feedback that gets triggered by code in the entry point, e.g. handleImportError.
// We don't want to import toasterStore in the entry point for two reasons:
// 1. We want to keep the entry point as small as possible,
//    so that udAppLoader runs as soon as possible.
// 2. By importing toasterStore, we also import the icons used by AlertBanner.
//    Our GenerateSVGSpritemapPlugin doesn't know how to extract icons from the entry point.
class FeedbackQueue {
    @observable.shallow feedbacks = [];

    @action
    pushFeedback(alertBannerProps, toastOptions) {
        // Has the same signature as toasterStore.addAlertBannerToast.
        this.feedbacks.push({alertBannerProps, toastOptions});
    }
}

const feedbackQueue = new FeedbackQueue();

export default feedbackQueue;
