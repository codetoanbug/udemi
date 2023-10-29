import {LocalizedHtml} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumEditorStore from './curriculum-editor.mobx-store';

const propTypes = {
    store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
};

const AlertPreviewLength = ({store, ...props}) => {
    if (store.course.hasSufficientPreviewLength) {
        return null;
    }

    return (
        <AlertBanner
            {...props}
            udStyle="error"
            showCta={false}
            title={gettext(
                'You no longer have 10 minutes of video content available for free preview which ' +
                    'may impact enrollment rate for your course.',
            )}
            body={
                <LocalizedHtml
                    className="ud-text-with-links"
                    html={gettext(
                        'Please enable free preview for another video lecture so that you meet this minimum requirement ' +
                            'or we will enable one for you automatically. <a class="freePreviewInfo">Learn More</a>.',
                    )}
                    interpolate={{
                        freePreviewInfo: (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={store.freePreviewInfo}
                            />
                        ),
                    }}
                />
            }
        />
    );
};

AlertPreviewLength.propTypes = propTypes;

export default inject('store')(observer(AlertPreviewLength));
