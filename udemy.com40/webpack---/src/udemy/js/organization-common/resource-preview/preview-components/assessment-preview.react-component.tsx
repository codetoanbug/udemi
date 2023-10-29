import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import AssignmentIcon from '@udemy/icons/dist/assignment.ud-icon';
import ListAltIcon from '@udemy/icons/dist/list-alt.ud-icon';
import React from 'react';

import {
    AuthorIconAndName,
    EstimatedTime,
    NumberOfQuestions,
    ResourceTitle,
} from './preview-extra-info.react-component';

import './assessment-lab-preview.less';

export interface AssessmentPreviewProps {
    data: {
        author_name: string;
        author_icon: string;
        title: string;
        min_estimated_time: number;
        max_estimated_time: number;
        number_of_questions: number;
    };
}

export const AssessmentPreview = ({data}: AssessmentPreviewProps) => {
    return (
        <>
            <AuthorIconAndName authorIcon={data.author_icon} authorName={data.author_name} />
            <div styleName="container">
                <div styleName="icon-container">
                    <AssignmentIcon label={false} size="xlarge" styleName="card-icon assessment" />
                </div>
                <div styleName="info-completion-time">
                    <ResourceTitle title={data.title} />
                    <div className="ud-text-sm" styleName="info-container">
                        <div styleName="info-content-icon">
                            <AccessTimeIcon label={false} styleName="info-icon" />
                            <EstimatedTime
                                minEstimatedTime={data.min_estimated_time}
                                maxEstimatedTime={data.max_estimated_time}
                            />
                        </div>
                        <div styleName="info-content-icon">
                            <ListAltIcon label={false} styleName="info-icon" />
                            <NumberOfQuestions numberOfQuestions={data.number_of_questions} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
