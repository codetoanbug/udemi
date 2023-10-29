import PropTypes from 'prop-types';

const baseShape = {
    id: PropTypes.number,
    title: PropTypes.string,
    absolute_url: PropTypes.string,
};

export const topicShape = PropTypes.shape({
    ...baseShape,
});

const baseCategoryShape = {
    ...baseShape,
    type: PropTypes.string,
    title_cleaned: PropTypes.string,
    icon_name: PropTypes.string,
};

export const subcategoryShape = PropTypes.shape({
    ...baseCategoryShape,
});

export const categoryShape = PropTypes.shape({
    ...baseCategoryShape,
    children: PropTypes.arrayOf(subcategoryShape),
});
