import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import AssignmentIcon from '@udemy/icons/dist/assignment-outline.ud-icon';
import AudioIcon from '@udemy/icons/dist/audio.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import QuizIcon from '@udemy/icons/dist/lightbulb-off.ud-icon';
import PresentationIcon from '@udemy/icons/dist/presentation.ud-icon';
import PracticeTestIcon from '@udemy/icons/dist/quiz.ud-icon';
import VideoMashupIcon from '@udemy/icons/dist/video-mashup.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';

const DEFAULT_ICON_CLASS = 'udi udi-file';
const ICON_MAPPING = {
    'udi udi-file': ArticleIcon,
    'udi udi-article': ArticleIcon,
    'udi udi-audio': AudioIcon,
    'udi udi-presentation': PresentationIcon,
    'udi udi-video': VideoIcon,
    'udi udi-video-mashup': VideoMashupIcon,
    'udi udi-coding-exercise': CodeIcon,
    'udi udi-practice-test': PracticeTestIcon,
    'udi udi-quiz': QuizIcon,
    'udi udi-assignment': AssignmentIcon,
};

export default function curriculumItemIcon(iconClass) {
    return ICON_MAPPING[iconClass] || ICON_MAPPING[DEFAULT_ICON_CLASS];
}
