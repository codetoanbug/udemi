import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import {Image} from '@udemy/react-core-components';
import React from 'react';

import cardIconSvg from 'labs-landing/assets/card-icon.svg';
import {LAB_VERTICAL} from 'labs/constants';

import {
    AuthorIconAndName,
    EstimatedTime,
    ResourceTitle,
} from './preview-extra-info.react-component';

import './assessment-lab-preview.less';

export interface LabShareToSlackPreviewProps {
    data: {
        author_name: string;
        author_icon: string;
        title: string;
        min_estimated_time: number;
        max_estimated_time: number;
        vertical: keyof typeof LAB_VERTICAL;
    };
}

/**
 * This component is used when sharing Labs to Slack because we need to set the image at the bottom
 * instead of having it at the left side, as in the Recommend and Assign.
 */

export const LabShareToSlackPreview = ({data}: LabShareToSlackPreviewProps) => {
    const LabVerticalIconComponent = LAB_VERTICAL[data.vertical].iconComponent;

    return (
        <>
            <AuthorIconAndName authorIcon={data.author_icon} authorName={data.author_name} />
            <div styleName="container">
                <div styleName="info-completion-time share-to-slack">
                    <ResourceTitle title={data.title} />
                    <div className="ud-text-sm" styleName="info-container">
                        <LabVerticalIconComponent label={false} styleName="info-icon" />
                        <span styleName="info-content" data-purpose="lab-label">
                            {LAB_VERTICAL[data.vertical].label}
                        </span>
                        <AccessTimeIcon label={false} styleName="info-icon" />
                        <EstimatedTime
                            minEstimatedTime={data.min_estimated_time}
                            maxEstimatedTime={data.max_estimated_time}
                        />
                    </div>
                    <div styleName="icon-container share-to-slack">
                        <Image
                            alt=""
                            src={cardIconSvg}
                            height="unset"
                            width="unset"
                            styleName="card-icon"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
