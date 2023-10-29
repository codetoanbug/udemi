import {useI18n} from '@udemy/i18n';
import PropTypes from 'prop-types';

import escapeHtml from 'utils/escape/escape-html';

const InstructorTitles = ({instructors}) => {
    const {gettext, interpolate, ninterpolate} = useI18n();
    if (instructors.length === 0) {
        return null;
    }

    const owner = instructors[0];
    const othersCount = instructors.length - 1;
    const title = escapeHtml(owner.title);

    if (instructors.length === 1) {
        return interpolate(gettext('By %(title)s'), {title}, true);
    }

    return ninterpolate(
        'By %(title)s and %(othersCount)s other',
        'By %(title)s and %(othersCount)s others',
        othersCount,
        {title, othersCount},
    );
};

InstructorTitles.propTypes = {
    instructors: PropTypes.array.isRequired,
};

export default InstructorTitles;
