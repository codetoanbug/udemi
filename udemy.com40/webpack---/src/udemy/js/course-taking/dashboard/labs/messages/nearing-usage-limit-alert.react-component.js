import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LABS_SUPPORT_ARTICLES} from 'labs/constants';
import SystemMessage from 'utils/ud-system-message';

import LabsStore from '../labs.mobx-store';

import './messages.less';

@observer
export default class NearingUsageLimitAlert extends React.Component {
    static propTypes = {
        labsStore: PropTypes.instanceOf(LabsStore).isRequired,
    };

    @autobind
    onLabsAlmostOutOfResourcesNotificationDismiss() {
        SystemMessage.seen(SystemMessage.ids.hasSeenLabsAlmostOutOfResourcesNotification).then(
            action((response) => {
                if (response && response.status === 201) {
                    this.props.labsStore.setHasSeenLabsAlmostOutOfResourcesNotification(true);
                }
            }),
        );
    }

    render() {
        return (
            <AlertBanner
                styleName="labs-alert"
                data-purpose="labs-almost-out-of-resources-notification"
                udStyle="warning"
                title={gettext('AWS workspace is close to usage limit')}
                body={gettext('Optimize usage or you could lose access to it.')}
                ctaText={gettext('Learn More')}
                actionButtonProps={{
                    componentClass: 'a',
                    href: LABS_SUPPORT_ARTICLES.AWS,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                }}
                onDismiss={this.onLabsAlmostOutOfResourcesNotificationDismiss}
            />
        );
    }
}
