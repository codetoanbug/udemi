/**
 * Record representing a workspace
 * A workspace may be either a lab workspace or an in-course workspace
 * See source: https://github.com/udemy/schema-store/blob/master/fields/Workspace.avdl
 */
export class LabWorkspaceEntity {
    /**
     * Unique id representing the workspace
     */
    id: number;

    /**
     * Name of the lab vertical.
     * Can be
     * - web = any web dev lab (react, html, spring, etc)
     * - aws = AWS cloud lab lab
     * - data_science = data science lab (jupyter, mysql, etc)
     * - azure - Azure cloud lab
     * - devops = devops lab (kubernetes, jenkins, etc)
     * - gcp = GCP cloud lab
     * - security = security lab
     */
    vertical: 'web' | 'aws' | 'data_science' | 'azure' | 'devops' | 'gcp' | 'security';

    /**
     * The uuid of the corresponding instance, if one has been launched for the user.
     */
    instanceUuid: string;

    constructor(
        id: number,
        vertical: 'web' | 'aws' | 'data_science' | 'azure' | 'devops' | 'gcp' | 'security',
        instanceUuid: string,
    ) {
        this.id = id;
        this.vertical = vertical;
        this.instanceUuid = instanceUuid;
    }
}
