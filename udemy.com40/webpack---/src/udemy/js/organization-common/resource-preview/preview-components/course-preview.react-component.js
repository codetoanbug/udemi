import {Image} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React from 'react';

import {AuthorIconAndName, ResourceTitle} from './preview-extra-info.react-component';

import './course-preview.less';

const CoursePreview = ({data}) => {
    return (
        <>
            {data.author_icon && (
                <AuthorIconAndName authorIcon={data.author_icon} authorName={data.author_name} />
            )}
            {data.title && <ResourceTitle title={data.title} />}
            {data.text && (
                <p className="ud-text-sm" data-purpose="course-text">
                    {data.text}
                </p>
            )}
            {data.attachment_image && (
                <Image
                    styleName="attachment__image"
                    src={data.attachment_image.src}
                    alt={gettext('Attachment course image')}
                    width={data.attachment_image.width}
                    height={data.attachment_image.height}
                    data-purpose="course-image"
                />
            )}
        </>
    );
};

CoursePreview.propTypes = {
    data: PropTypes.object.isRequired,
};

export default CoursePreview;
