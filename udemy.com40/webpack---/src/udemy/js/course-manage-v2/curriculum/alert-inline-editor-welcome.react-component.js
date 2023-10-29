import {AlertBanner} from '@udemy/react-messaging-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SystemMessage from 'utils/ud-system-message';

@inject('store')
@observer
export default class AlertInlineEditorWelcome extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    componentDidMount() {
        if (this.props.store.inlineInsertEnabled) {
            SystemMessage.hasSeen(SystemMessage.ids.modalInlineFirstTime).then(
                action((response) => {
                    this.isShown = !response.data;
                }),
            );
        }
    }

    @observable isShown = false;

    @autobind
    @action
    handleAlertDismiss() {
        SystemMessage.seen(SystemMessage.ids.modalInlineFirstTime);
        this.isShown = false;
    }

    render() {
        if (!this.isShown) {
            return null;
        }

        const {store, ...props} = this.props;
        return (
            <AlertBanner
                {...props}
                ctaText={gettext('Dismiss')}
                onAction={this.handleAlertDismiss}
                dismissButtonProps={false}
                title={gettext(
                    'Here’s where you add course content—like lectures, course sections, assignments, and more. ' +
                        'Click a + icon on the left to get started.',
                )}
            />
        );
    }
}
