import {AlertBanner} from '@udemy/react-messaging-components';
import React from 'react';

const OrganizationUserProfileEditAlert = () => {
    return (
        <AlertBanner
            showCta={false}
            title={gettext(
                'Your organization needs these details for Udemy Business. ' +
                    'Please contact your IT team or manager for help changing them.',
            )}
        />
    );
};

export default OrganizationUserProfileEditAlert;
