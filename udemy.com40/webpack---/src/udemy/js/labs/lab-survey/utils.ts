import {labReportIssueUrl} from 'labs/apis';
import getConfigData from 'utils/get-config-data';
import udApi from 'utils/ud-api';
import udLink from 'utils/ud-link';

export const createLabSupportTicket = async (
    labId: number,
    subject: string,
    body: string,
    file: File | null,
    taskNumber?: number,
    currentMode?: string,
) => {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body);
    file && formData.append('file', file);
    taskNumber && formData.append('task_number', taskNumber.toString());
    currentMode && formData.append('current_mode', currentMode);
    const response = await udApi.post(labReportIssueUrl(labId), formData, {
        headers: {
            'content-type': 'multipart/form-data',
        },
    });
    return response.data;
};

export function getSupportLink() {
    const udConfig = getConfigData();
    return udLink.toSupportLink('default', udConfig.brand.has_organization);
}
