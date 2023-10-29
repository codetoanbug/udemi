import udApi from 'utils/ud-api';
import getLoggingHeaders from 'utils/ud-logs-internal';

const postEvents = async (data) => {
    const headers = await getLoggingHeaders();
    udApi.post('/visits/me/action-logs/', data, {headers});
};

export default {postEvents};
