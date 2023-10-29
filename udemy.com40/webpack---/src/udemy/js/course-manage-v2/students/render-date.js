import {fromLocalDateStamp} from 'course-manage-v2/availability/availability.mobx-store';
import getRequestData from 'utils/get-request-data';

export default function renderDate(dateString) {
    const locale = getRequestData().locale.replace('_', '-') || 'en-US';
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return fromLocalDateStamp(dateString).toLocaleDateString(locale, options);
}
