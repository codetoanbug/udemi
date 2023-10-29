export const enum Layout {
    DEFAULT = 'default',
    HEADER = 'header',
    COURSE_TAKING = 'course_taking',
}

export const enum UserType {
    INSTRUCTOR = 'Instructor',
    STUDENT = 'Student',
}

export interface AwsModalProps {
    labInstance: {
        awsAccessKeyId: string;
        awsSecretAccessKey: string;
        awsSessionToken: string;
    };
    isShown: boolean;
    onClose: () => void;
}
