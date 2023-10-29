import autobind from 'autobind-decorator';
import JSZip from 'jszip';
import {action, computed, observable} from 'mobx';

import {LAB_VERTICAL, MAKEFILE_NAME, SERVICE_ALIASES} from 'labs/constants';
import Lab from 'labs/lab.mobx-model';

import {
    INITIAL_DS_MAKEFILE_DENY_LIST,
    INITIAL_MAKEFILE_DENY_LIST,
    INITIAL_SOURCE_CODE_DEPENDENCY_LIST_NAMES,
    INITIAL_SOURCE_CODE_DS_REQUIRED_FILES,
    SOURCE_CODE_MAX_FILE_SIZE_IN_MB,
    SOURCE_CODE_NOT_VALID_ENTRIES,
    SOURCE_CODE_VALIDATION_MESSAGES,
} from './constants';

export class LabSourceCodeValidationStore {
    @observable validationErrors: string[] = [];
    jsZip = JSZip;
    lab: Lab;

    constructor(lab: Lab) {
        this.lab = lab;
    }

    setLab(lab: Lab) {
        this.lab = lab;
    }

    @computed
    get hasValidationErrors() {
        return !!this.validationErrors.length;
    }

    @autobind
    async validateInitialSourceCode(file: File) {
        const errors: string[] = [];
        const fileSizeError = this.validateFileSize(file);
        if (fileSizeError) {
            errors.push(fileSizeError);
        } else {
            const files = await this.unpackSourceCode(file);
            if (this.lab.vertical == LAB_VERTICAL.web.key) {
                const depListError = this.validateDependencyListNames(files);
                depListError && errors.push(depListError);
            } else if (this.lab.vertical == LAB_VERTICAL.devops.key) {
                const depListError = this.validateMakeFile(files);
                depListError && errors.push(depListError);
            } else if (this.lab.vertical == LAB_VERTICAL.security.key) {
                const depListError = this.validateMakeFile(files);
                depListError && errors.push(depListError);
            } else if (this.lab.vertical == LAB_VERTICAL.data_science.key) {
                const depListError = this.validateDataScienceFiles(files);
                depListError && errors.push(depListError);
            }
            const folderNameError = this.validateNotValidEntries(files);
            folderNameError && errors.push(folderNameError);
        }
        this.setValidationErrors(errors);
        return !errors.length;
    }

    private validateFileSize(file: File) {
        if (file.size > SOURCE_CODE_MAX_FILE_SIZE_IN_MB * 1024 * 1024) {
            return SOURCE_CODE_VALIDATION_MESSAGES.fileSizeExceeded;
        }
        return false;
    }

    @autobind
    async validateSolutionSourceCode(file: File) {
        const errors: string[] = [];
        const fileSizeError = this.validateFileSize(file);
        if (fileSizeError) {
            errors.push(fileSizeError);
        } else {
            const files = await this.unpackSourceCode(file);
            const folderNameError = this.validateNotValidEntries(files);
            const rootCodeError = this.validateFilesInRootFolder(files);
            folderNameError && errors.push(folderNameError);
            rootCodeError && errors.push(rootCodeError);
        }
        this.setValidationErrors(errors);
        return !errors.length;
    }

    async unpackSourceCode(archive: File) {
        const zip = await this.jsZip.loadAsync(archive);
        return zip.files;
    }

    @action
    setValidationErrors(errors: string[]) {
        this.validationErrors = errors;
    }

    private validateDataScienceFiles(files: {[key: string]: JSZip.JSZipObject}) {
        if (this.lab.specName === null) {
            return false;
        }

        if (
            !INITIAL_DS_MAKEFILE_DENY_LIST.some((substr) => this.lab.specName?.startsWith(substr))
        ) {
            const makeFileNotExistErrorMessage = this.validateMakeFile(files);
            if (makeFileNotExistErrorMessage) {
                return makeFileNotExistErrorMessage;
            }
        }
        for (const requiredFile of Object.values(INITIAL_SOURCE_CODE_DS_REQUIRED_FILES)) {
            if (this.lab.specName?.startsWith(requiredFile.specPrefix)) {
                const requiredFileTypeErrorMessage = this.validateFileType(
                    files,
                    requiredFile.fileType,
                );
                if (requiredFileTypeErrorMessage) {
                    return requiredFileTypeErrorMessage;
                }
            }
        }
        return false;
    }

    private validateFileType(files: {[key: string]: JSZip.JSZipObject}, fileType: string) {
        const requiredFileExist = Object.entries(files)
            .filter((file) => !file[1].dir)
            .some((file) => this.getNameFromPath(file[1].name).endsWith(fileType));
        if (!requiredFileExist) {
            return interpolate(
                SOURCE_CODE_VALIDATION_MESSAGES.requiredFileMissing,
                {fileType},
                true,
            );
        }
        return false;
    }

    private validateMakeFile(files: {[key: string]: JSZip.JSZipObject}) {
        // Makefile validation should check if the zipfile contains a Makefile at the
        // root folder of the zipfile, which is required for almost* all labs to work.

        // Exceptions to this are the labs in the list below
        if (INITIAL_MAKEFILE_DENY_LIST.includes(this.lab.verticalLabel)) {
            return;
        }

        // First lets try and find within the zipfile all files with a basename `MAKEFILE_NAME`
        const makefiles = Object.entries(files).filter(
            (file) => !file[1].dir && this.getNameFromPath(file[1].name) == MAKEFILE_NAME,
        );

        // helper method
        const hasRootMakefile = (makefiles: [string, JSZip.JSZipObject][]) => {
            return makefiles.some((makefile) => makefile[1].name === MAKEFILE_NAME);
        };

        // How many Makefiles do we have? We should always have at least one
        if (makefiles.length === 0) {
            return SOURCE_CODE_VALIDATION_MESSAGES.noMakefileExist;
        } else if (makefiles.length === 1) {
            //
            // Usually, zip files are extracted for a single container env inside the
            // labsuser ~/code directory.
            //
            // initial-code.zip
            // ├── Makefile
            // ├── README.md
            // ├── ...
            //
            // The container will then use that Makefile to start the process for the lab.
            // This is by far the most common case, as we don't have many labs that mix
            // multiple services(also known as evaluators). A zipfile as follows, then, will *NOT* work:
            //
            // initial-code.zip
            //  ├── my-lab
            //          ├── Makefile
            //          ├── README.md
            //
            if (!hasRootMakefile(makefiles)) {
                return SOURCE_CODE_VALIDATION_MESSAGES.noMakefileExist;
            }
        } else {
            // We got more than one...
            //
            // Although less common, we also allow the zipfile to contain a initial code
            // for multiple containers, ie:
            // ie: Jenkins / Spring ->
            //
            // initial-code.zip
            //  ├── jenkins
            //          ├── Makefile
            //          ├── README.md
            //  ├── spring
            //          ├── Makefile
            //
            // Which causes the jenkins subfolder to be used only in the jenkins workspace,
            // and the same for the spring folder. It's a workaround for having only one
            // initial code bundle per lab. This workaround makes it hard for us to properly
            // validate a zipfile.
            //
            // To make things worse, it would also work if the zipfile contained a single folder
            // named after the service for the workspace
            // initial-code.zip
            //  ├── jenkins
            //          ├── Makefile
            //          ├── README.md
            //
            // Although the above is supported (our container loading code would have no trouble loading
            // the environment with that initial zip), to make things simpler we will consider this invalid.
            // we need to check the sub-folders, then. If any of them have a service name
            // we have to consider it as the special case.
            //
            // First we look into the lab spec to figure out the services this lab uses

            const serviceNames: string[] = this.lab.spec.services.map(
                (s: {name: string; kind: string}) =>
                    SERVICE_ALIASES[s.name as keyof typeof SERVICE_ALIASES] || s.name,
            );

            // Do we have folders named after services?
            const serviceNamesWithFoldersExist = serviceNames.some((sn) =>
                Object.entries(files).some((f) => f[1].dir && f[1].name == `${sn}/`),
            );

            if (serviceNamesWithFoldersExist) {
                // If so, then they must contain a Makefile
                const allServicesHaveAMakefile = serviceNames.every((sn) =>
                    makefiles.find((makefile) => makefile[1].name.startsWith(`${sn}/`)),
                );
                if (!allServicesHaveAMakefile) {
                    return SOURCE_CODE_VALIDATION_MESSAGES.noMakefileExist;
                }
            } else if (!hasRootMakefile(makefiles)) {
                // Fallback to the initial case: do we have a Makefile in the root folder?
                // The other Makefiles we found must be an example for the Lab
                return SOURCE_CODE_VALIDATION_MESSAGES.noMakefileExist;
            }
        }
    }

    private validateDependencyListNames(files: {[key: string]: JSZip.JSZipObject}) {
        if (INITIAL_MAKEFILE_DENY_LIST.includes(this.lab.verticalLabel)) {
            return false;
        }

        const makeFileNotExistErrorMessage = this.validateMakeFile(files);
        if (makeFileNotExistErrorMessage) {
            return makeFileNotExistErrorMessage;
        }

        const anyDependencyFileExist = Object.entries(files)
            .filter((file) => !file[1].dir)
            .some((file) =>
                INITIAL_SOURCE_CODE_DEPENDENCY_LIST_NAMES.includes(
                    this.getNameFromPath(file[1].name),
                ),
            );

        if (anyDependencyFileExist) {
            return false;
        }
        return SOURCE_CODE_VALIDATION_MESSAGES.dependencyListMissing;
    }

    private validateNotValidEntries(files: {[key: string]: JSZip.JSZipObject}) {
        for (const path in files) {
            const folder = files[path];
            const name = this.getNameFromPath(folder.name);
            if (SOURCE_CODE_NOT_VALID_ENTRIES.includes(name)) {
                return SOURCE_CODE_VALIDATION_MESSAGES.notValidFolderExists;
            }
        }
        return false;
    }

    private validateFilesInRootFolder(files: {[key: string]: JSZip.JSZipObject}) {
        for (const path in files) {
            const file = files[path];
            if (!file.dir && !file.name.includes('/')) {
                return false;
            }
        }
        return SOURCE_CODE_VALIDATION_MESSAGES.noRootFolderCodeExists;
    }

    private getNameFromPath(name: string) {
        if (name.endsWith('/')) {
            name = name.slice(0, -1);
        }
        const segments = name.split('/');
        const fileName = segments.pop();
        if (!fileName) {
            return '';
        }
        return fileName;
    }
}
