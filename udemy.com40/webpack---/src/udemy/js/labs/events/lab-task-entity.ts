/**
 * Record representing a Lab
 * See source: https://github.com/udemy/schema-store/blob/master/fields/LabTask.avdl
 */
export class LabTaskEntity {
    /**
     * Unique id representing the lab task
     */
    id: number;

    /**
     * Lab task number (order number in the tasks list)
     * This field helps the data team put together metrics on how far students got in a lab
     */
    number: number;

    /**
     * Title of the lab task
     */
    title: string;

    /**
     * Boolean if automated lab review (ALR) is enabled for the lab task
     */
    automatedReviewEnabled: boolean;

    constructor(id: number, number: number, title: string, automatedReviewEnabled: boolean) {
        this.id = id;
        this.number = number;
        this.title = title;
        this.automatedReviewEnabled = automatedReviewEnabled;
    }
}
