import {Image} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import PropTypes from 'prop-types';
import React from 'react';

import {CARD_IMAGE_SIZE} from 'learning-path/list-page/constants';

import {AuthorIconAndName, ResourceTitle} from './preview-extra-info.react-component';

import './learning-path-preview.less';

const LearningPathPreview = ({data}) => {
    return (
        <>
            <>
                <AuthorIconAndName authorIcon={data.author_icon} authorName={data.author_name} />
                <span styleName="attachment__description_item">{gettext('Learning path')}</span>
                <span styleName="attachment__description_item" data-purpose="duration">
                    {' '}
                    <Duration numSeconds={data.duration * 60} />
                </span>
                <span styleName="attachment__description_item" data-purpose="enrollments">
                    {ninterpolate('%s enrollment', '%s enrollments', data.enrollments)}
                </span>
            </>
            <ResourceTitle title={data.title} />

            <div styleName="attachment__text" data-purpose="lp-text">
                {data.text}
            </div>
            <div styleName="attachment__org_container" data-purpose="org-and-editor">
                {!!data.favicon_url && (
                    <Image
                        src={data.favicon_url}
                        alt={gettext('Organization logo')}
                        width={CARD_IMAGE_SIZE}
                        height={CARD_IMAGE_SIZE}
                        styleName="attachment__favicon"
                    />
                )}
                <span styleName="attachment__editor_name">{data.editor_label}</span>
            </div>
        </>
    );
};

LearningPathPreview.propTypes = {
    data: PropTypes.shape({
        author_icon: PropTypes.string.isRequired,
        author_name: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        enrollments: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        editor_label: PropTypes.string.isRequired,
    }).isRequired,
};

export default LearningPathPreview;
