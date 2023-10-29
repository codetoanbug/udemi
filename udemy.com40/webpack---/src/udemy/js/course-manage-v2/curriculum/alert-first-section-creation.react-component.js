import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    store: PropTypes.object.isRequired,
};

const AlertFirstSectionCreation = ({store, ...props}) => {
    if (!store.showAlertFirstSectionCreation) {
        return null;
    }

    return (
        <AlertBanner
            {...props}
            showCta={false}
            title={gettext('Your first lecture is outside of a section.')}
            body={
                <LocalizedHtml
                    html={gettext(
                        '<button class="createSection">Create a section</button> to hold this lecture.',
                    )}
                    interpolate={{
                        createSection: (
                            <Button
                                className="ud-link-underline"
                                udStyle="link"
                                typography="ud-text-bold"
                                onClick={store.createFirstSection}
                            />
                        ),
                    }}
                />
            }
        />
    );
};

AlertFirstSectionCreation.propTypes = propTypes;

export default inject('store')(observer(AlertFirstSectionCreation));
