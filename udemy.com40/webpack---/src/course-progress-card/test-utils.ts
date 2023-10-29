import {CompactCourseProgressCardProps} from './compact-course-progress-card.react-component';

export function generateProgressCourse(
    overrides: Partial<CompactCourseProgressCardProps['course']> = {},
) {
    return {
        id: 950390,
        image_240x135: '/course/240x135/950390_270f_3.jpg',
        title: 'Machine Learning',
        remaining_time: 600,
        completion_ratio: 0,
        url: '/course/machinelearning/',
        ...overrides,
    };
}
