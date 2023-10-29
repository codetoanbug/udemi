import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

const CODING_LABS_ENDPOINT = '/labs/';
export const API_LAB_FIELDS = [
    'id',
    'title',
    'vertical',
    'enrollment',
    'my_latest_instance',
    'assignment',
    'title_autoslug',
    'min_estimated_time',
    'max_estimated_time',
    'spec_name',
    'owner',
    'what_you_will_do',
    'lab_type',
].join(',');

export default async function loadInProgressLabsUnit() {
    // TODO add more fields when CTA implemented
    const params = {
        'fields[lab]': API_LAB_FIELDS,
        in_progress: 1,
    };
    try {
        const response = await udApi.get(CODING_LABS_ENDPOINT, {params});
        const results = response?.data?.results || [];
        return results;
    } catch (e) {
        Raven.captureException(e);
        return [];
    }
}
