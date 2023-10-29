// eslint-disable-next-line import/prefer-default-export
export const ENROLL_COURSE_WITH_SUBSCRIPTION_QUERY = `
    mutation EnrollCourseWithSubscription($courseId: ID!) {
        enrollCourseWithSubscription(courseId: $courseId)
    }
`;
