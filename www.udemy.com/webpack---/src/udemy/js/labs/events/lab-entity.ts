import {LabWorkspaceEntity} from './lab-workspace-entity';

/**
 * Record representing a Lab
 * See source: https://github.com/udemy/schema-store/blob/master/fields/Lab.avdl
 */
export class LabEntity {
    /**
     * Unique id representing the lab
     */
    id: number;

    /**
     * Title of the lab
     */
    title: string;

    /**
     * The main / primary vertical of the lab
     */
    primaryVertical: string;

    /**
     * Boolean if automated lab review (ALR) is enabled for the lab
     */
    automatedReviewEnabled: boolean;

    /**
     * Array of workspace entity records. We need to support multiple workspaces for cases like hybrid labs
     * where the user may have multiple attached workspaces.
     */
    workspaces: Array<LabWorkspaceEntity>;

    constructor(
        id: number,
        title: string,
        automatedReviewEnabled: boolean,
        primaryVertical: string,
        workspaces: Array<LabWorkspaceEntity> = [],
    ) {
        this.id = id;
        this.title = title;
        this.automatedReviewEnabled = automatedReviewEnabled;
        this.primaryVertical = primaryVertical;
        this.workspaces = workspaces;
    }
}
