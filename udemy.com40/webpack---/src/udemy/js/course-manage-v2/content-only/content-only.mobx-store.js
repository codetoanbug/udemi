import autobind from 'autobind-decorator';

import udApi from 'utils/ud-api';

export default class ContentOnlyStore {
    constructor(courseId, conf) {
        this.courseId = courseId;
        this.courseManageInfoSeenLabel = conf.courseManageInfoSeenLabel;
        this.content = conf.content;
    }

    wasMarkAsSeen = false;

    @autobind
    setPageAsSeen() {
        if (this.wasMarkAsSeen) {
            return Promise.resolve(false);
        }
        return udApi
            .patch(`/courses/${this.courseId}/info/${this.courseManageInfoSeenLabel}/`)
            .then(() => {
                this.wasMarkAsSeen = true;
                return true;
                // This marks a seen flag for the page. Don't bother with checking for an error.
            });
    }
}
