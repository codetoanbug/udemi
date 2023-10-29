import {LabEnrollmentApiData, LabInstanceApiData} from 'labs/types';

export interface LabInProgressApiData {
    _class: 'lab';
    id: number;
    title: string;
    enrollment: LabEnrollmentApiData;
    my_latest_instance: LabInstanceApiData | null;
}

export const EMPTY_LAB_OBJECT = {id: 'labs-get-started'};
