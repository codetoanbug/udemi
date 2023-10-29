import AccessTimeIcon from '@udemy/icons/dist/access-time.ud-icon';
import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import cardIconSvg from 'labs-landing/assets/card-icon.svg';
import {LAB_VERTICAL} from 'labs/constants';

import {
    AuthorIconAndName,
    EstimatedTime,
    ResourceTitle,
} from './preview-extra-info.react-component';

import './assessment-lab-preview.less';

const LabPreview = ({data}) => {
    const {vertical} = data;
    const LabVerticalIconComponent = LAB_VERTICAL[vertical].iconComponent;

    return (
        <>
            <AuthorIconAndName authorIcon={data.author_icon} authorName={data.author_name} />
            <div styleName="container">
                <div styleName="icon-container">
                    <Image
                        alt=""
                        src={cardIconSvg}
                        height="unset"
                        width="unset"
                        styleName="card-icon"
                    />
                </div>
                <div styleName="info-completion-time">
                    <ResourceTitle title={data.title} />
                    <div className="ud-text-sm" styleName="info-container">
                        <LabVerticalIconComponent label={false} styleName="info-icon" />
                        <span styleName="info-content">{LAB_VERTICAL[vertical].label}</span>
                        <AccessTimeIcon label={false} styleName="info-icon" />
                        <EstimatedTime
                            minEstimatedTime={data.min_estimated_time}
                            maxEstimatedTime={data.max_estimated_time}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

LabPreview.propTypes = {
    data: PropTypes.shape({
        author_icon: PropTypes.string.isRequired,
        author_name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        min_estimated_time: PropTypes.number.isRequired,
        max_estimated_time: PropTypes.number.isRequired,
        vertical: PropTypes.string.isRequired,
    }).isRequired,
};

export default LabPreview;
