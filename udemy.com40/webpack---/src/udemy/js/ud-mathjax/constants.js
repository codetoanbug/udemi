const BASE_LIBRARY_URL = '/staticx/udemy/mathjax/v3-2-0';

export const MATH_OPEN_MARK = '``[';
export const MATH_CLOSE_MARK = ']``';

export const DEFAULT_CONFIG = {
    chtml: {
        fontURL: `${BASE_LIBRARY_URL}/fonts`,
    },
    asciimath: {
        delimiters: [[MATH_OPEN_MARK, MATH_CLOSE_MARK]],
    },
    loader: {
        load: ['input/asciimath', 'output/chtml'],
        paths: {mathjax: `${BASE_LIBRARY_URL}/js`},
    },
};
