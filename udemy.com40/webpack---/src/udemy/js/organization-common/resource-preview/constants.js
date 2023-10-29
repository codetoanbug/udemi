import {AssessmentPreview} from './preview-components/assessment-preview.react-component';
import {AssessmentShareToSlackPreview} from './preview-components/assessment-share-to-slack-preview.react-component';
import CoursePreview from './preview-components/course-preview.react-component';
import LabPreview from './preview-components/lab-preview.react-component';
import {LabShareToSlackPreview} from './preview-components/lab-share-to-slack-preview.react-component';
import LearningPathPreview from './preview-components/learning-path-preview.react-component';

export const DEFAULT_ASSIGN_MESSAGE = {
    course: gettext('Hello,\n\nThis course will help you learn new skills.\n'),
    learning_path: gettext('Hello,\n\nThis learning path will help you learn new skills.\n'),
    lab: gettext('Hello,\n\nThis lab will help you sharpen your technical skills.\n'),
    adaptive_assessment_assessment: gettext(
        'Hello,\n\nThis assessment will help identify your skill level and guide you to content based on your performance.\n',
    ),
};

export const DEFAULT_SHARE_MESSAGE = {
    course: gettext(
        "Hello!\n\nI've found this Udemy course that I think you'll enjoy. Check it out!\n",
    ),
    learning_path: gettext(
        "Hello!\n\nI've found this Udemy learning path that I think you'll enjoy. Check it out!\n",
    ),
    lab: gettext("Hello!\n\nI've found this Udemy lab that I think you'll enjoy. Check it out!\n"),
    adaptive_assessment_assessment: gettext(
        "Hello!\n\nI've found this Udemy assessment that I think you'll enjoy. Check it out!\n",
    ),
};

export const PREVIEW_COMPONENTS = {
    course: CoursePreview,
    learning_path: LearningPathPreview,
    lab: LabPreview,
    adaptive_assessment_assessment: AssessmentPreview,
};

export const SHARE_TO_SLACK_PREVIEW_COMPONENTS = {
    course: PREVIEW_COMPONENTS.course,
    learning_path: PREVIEW_COMPONENTS.learning_path,
    lab: LabShareToSlackPreview,
    adaptive_assessment_assessment: AssessmentShareToSlackPreview,
};
