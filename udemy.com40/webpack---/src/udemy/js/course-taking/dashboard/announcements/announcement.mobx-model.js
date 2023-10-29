import Instructor from '../../instructor.mobx-model';

export default class Announcement {
    constructor(apiData) {
        this.id = apiData.id;
        this.title = apiData.announcement_group.title;
        this.content = apiData.announcement_group.content;
        this.instructor = new Instructor(apiData.announcement_group.user);
        this.created = apiData.announcement_group.created;
        this.commentThread = apiData.comment_thread;
    }
}
