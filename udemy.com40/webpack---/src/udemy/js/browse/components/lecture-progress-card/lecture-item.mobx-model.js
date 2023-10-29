import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import AssignmentIcon from '@udemy/icons/dist/assignment.ud-icon';
import CodeIcon from '@udemy/icons/dist/code.ud-icon';
import PlayIcon from '@udemy/icons/dist/play.ud-icon';
import QuizIcon from '@udemy/icons/dist/quiz.ud-icon';
import {Duration} from '@udemy/react-date-time-components';
import {udLink} from '@udemy/ud-data';
import React from 'react';

import CurriculumLecture from 'course-taking/curriculum/lecture.mobx-model';
import CurriculumPractice from 'course-taking/curriculum/practice.mobx-model';
import CurriculumQuiz from 'course-taking/curriculum/quiz.mobx-model';

import {LECTURE_BUTTON_STYLE, LECTURE_IMAGE_STYLE} from './constants';

export class Lecture extends CurriculumLecture {
    lectureImage = this.thumbnailUrl;
    iconButtonStyle = LECTURE_BUTTON_STYLE.LECTURE;
    imageStyle = LECTURE_IMAGE_STYLE.LECTURE;
    contentType = gettext('Lecture');

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            thumbnailUrl: 'thumbnail_url',
            contentDetails: 'content_details',
            objectIndex: 'object_index',
        };
    }

    get durationContent() {
        let secondsRemaining = this.contentDetails.length;
        if (this.completionRatio > 0) {
            secondsRemaining -= Math.round(
                this.contentDetails.length * (this.completionRatio / 100),
            );
            secondsRemaining = secondsRemaining < 60 ? 60 : secondsRemaining;
        }

        return (
            <Duration
                numSeconds={secondsRemaining}
                presentationStyle={Duration.STYLE.HUMAN_COMPACT}
            />
        );
    }

    set durationContent(value) {
        // Duration content is calculated from the content details
    }

    get completionRatio() {
        const lastWatchedSecond = this.lastWatchedSecond || 0;
        return Math.round((lastWatchedSecond / this.contentDetails.length) * 100);
    }

    set completionRatio(value) {
        // Completion ratio is calculated from the API response
    }

    get icon() {
        return PlayIcon;
    }

    set icon(icon) {
        // icon is hardcoded
    }
}

export class Article extends Lecture {
    lectureImage = udLink.toStorageStaticAsset(
        'browse_components/video-card-unit/Intersect-teal.svg',
        {Config: this.Config},
    );

    iconButtonStyle = LECTURE_BUTTON_STYLE.ARTICLE;
    imageStyle = LECTURE_IMAGE_STYLE.ARTICLE;
    contentType = gettext('Article');

    get durationContent() {
        return (
            <Duration
                numSeconds={this.contentDetails.length > 60 ? this.contentDetails.length : 60}
                presentationStyle={Duration.STYLE.HUMAN_COMPACT}
            />
        );
    }

    set durationContent(value) {
        // Duration content is calculated from the content details
    }

    get completionRatio() {
        return 0;
    }

    set completionRatio(value) {
        // Completion ratio is hardcoded
    }

    get icon() {
        return ArticleIcon;
    }

    set icon(icon) {
        // icon is hardcoded
    }
}

export class Practice extends CurriculumPractice {
    lectureImage = udLink.toStorageStaticAsset(
        'browse_components/video-card-unit/Intersect-purple.svg',
        {Config: this.Config},
    );

    iconButtonStyle = 'pencil';
    imageStyle = LECTURE_IMAGE_STYLE.PRACTICE;
    contentType = gettext('Assignment');
    completionRatio = 0;
    icon = AssignmentIcon;

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            url: 'learn_url',
            objectIndex: 'object_index',
        };
    }

    get durationContent() {
        return (
            <Duration
                numSeconds={this.estimatedDuration * 60}
                presentationStyle={Duration.STYLE.HUMAN_COMPACT}
            />
        );
    }

    set durationContent(value) {
        // Duration content is calculated from the estimated duration
    }
}

export class Quiz extends CurriculumQuiz {
    lectureImage = udLink.toStorageStaticAsset(
        'browse_components/video-card-unit/Intersect-coral.svg',
        {Config: this.Config},
    );

    iconButtonStyle = LECTURE_BUTTON_STYLE.QUIZ;
    imageStyle = LECTURE_IMAGE_STYLE.QUIZ;
    contentType = gettext('Quiz');
    completionRatio = 0;
    icon = QuizIcon;

    get apiDataMap() {
        return {
            ...super.apiDataMap,
            url: 'url',
            objectIndex: 'object_index',
            contentDetails: 'content_details',
        };
    }

    get durationContent() {
        return (
            <>
                {ninterpolate(
                    '%(count)s question',
                    '%(count)s questions',
                    this.contentDetails.length,
                    {
                        count: this.contentDetails.length,
                    },
                )}
            </>
        );
    }

    set durationContent(value) {
        // Duration content is calculated from the content details
    }
}

export class CodingExercise extends Quiz {
    lectureImage = udLink.toStorageStaticAsset(
        'browse_components/video-card-unit/Intersect-orange.svg',
        {Config: this.Config},
    );

    iconButtonStyle = LECTURE_BUTTON_STYLE.CODING_EXERCISE;
    imageStyle = LECTURE_IMAGE_STYLE.CODING_EXERCISE;
    contentType = gettext('Exercise');
    completionRatio = 0;
    icon = CodeIcon;
}
