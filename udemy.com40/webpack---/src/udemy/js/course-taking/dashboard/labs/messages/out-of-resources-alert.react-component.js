import {AlertBanner} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {AWS_SIGNUP_URL} from '../constants';
import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class OutOfResourcesAlert extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
    };

    render() {
        return (
            <AlertBanner
                styleName="labs-alert"
                data-purpose="labs-out-of-resources-notification"
                udStyle="warning"
                title={gettext('AWS sandbox is no longer available. Set up your own AWS account.')}
                body={gettext(
                    "This sandbox has run out of resources and can't be used anymore. Learn how to set up your own AWS account in the setup section of the course.",
                )}
                ctaText={gettext('Signup')}
                actionButtonProps={{
                    componentClass: 'a',
                    href: AWS_SIGNUP_URL,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                }}
                dismissButtonProps={false}
            />
        );
    }
}
