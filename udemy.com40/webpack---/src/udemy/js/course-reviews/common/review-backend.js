import udApi from 'utils/ud-api';

export default function reviewBackend() {
    const urlParams = {
        'fields[course_review]': '@min,location,response',
    };
    const _getEndpointUrl = (courseId, reviewId) => {
        return reviewId
            ? `courses/${courseId}/reviews/${reviewId}/`
            : `courses/${courseId}/reviews/`;
    };

    return {
        forCourse: (courseId) => {
            return {
                create: (data) => {
                    return udApi.post(_getEndpointUrl(courseId), data, {params: urlParams});
                },
                update: (reviewId, data) => {
                    return udApi.patch(_getEndpointUrl(courseId, reviewId), data, {
                        params: urlParams,
                    });
                },
                get: (params) => {
                    return udApi
                        .get(_getEndpointUrl(courseId), {params: {...params, ...urlParams}})
                        .then((response) => {
                            if (response.data.results.length > 0) {
                                return response.data.results[0];
                            }
                            return null;
                        });
                },
                delete: (reviewId) => {
                    return udApi.delete(_getEndpointUrl(courseId, reviewId));
                },
            };
        },
    };
}
