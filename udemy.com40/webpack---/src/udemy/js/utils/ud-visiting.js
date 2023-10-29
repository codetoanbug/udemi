import createUDProxy from 'utils/create-ud-proxy';

const udVisiting = createUDProxy('visiting', 'visitingProperties');

transformUDVisiting();

export default udVisiting;

export function transformUDVisiting() {
    if (UD.visiting && !UD.visiting.isLoading && UD.visiting.first_visit_time) {
        UD.visiting.first_visit_time = new Date(UD.visiting.first_visit_time);
    }
}
