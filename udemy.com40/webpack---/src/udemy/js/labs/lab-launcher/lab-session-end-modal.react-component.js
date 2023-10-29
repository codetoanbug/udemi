import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LabLauncherStore from './lab-launcher.mobx-store';
import './lab-launcher.less';

@inject('labLauncherStore')
@observer
export default class LabSessionEndModal extends React.Component {
    static propTypes = {
        labLauncherStore: PropTypes.instanceOf(LabLauncherStore).isRequired,
    };

    @autobind
    onCancelSessionExtend() {
        this.props.labLauncherStore.setShowSessionEndPrompt(false);
        this.props.labLauncherStore.stopLab();
    }

    @autobind
    async onConfirmSessionExtend() {
        await this.props.labLauncherStore.setLabSessionStartTime();
        this.props.labLauncherStore.setShowSessionEndPrompt(false);
    }

    render() {
        return (
            <Modal
                isOpen={this.props.labLauncherStore.showSessionEndPrompt}
                requireExplicitAction={true}
                title={gettext("Looks like you're still working")}
                data-purpose="session-end-prompt"
            >
                <div>
                    <p>
                        {gettext(
                            "Do you need more time? If so, you can extend your session. When you're done, please pause your lab instance.",
                        )}
                    </p>
                    <p>
                        <span>{gettext('Time remaining until session ends: ')}</span>
                        <Duration
                            numSeconds={this.props.labLauncherStore.timeRemainingSeconds || 60}
                            data-purpose="lab-session-end-timer"
                            presentationStyle={Duration.STYLE.TIMESTAMP}
                        />
                    </p>
                </div>
                <FooterButtons>
                    <Button
                        udStyle="ghost"
                        onClick={this.onCancelSessionExtend}
                        data-purpose="end-session-button"
                    >
                        {gettext('End session')}
                    </Button>
                    <Button
                        onClick={this.onConfirmSessionExtend}
                        data-purpose="extend-session-button"
                    >
                        {gettext('Extend session')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
