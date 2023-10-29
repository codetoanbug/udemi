import {Modal} from '@udemy/react-dialog-components';
import {Accordion, Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React from 'react';

import Lab from 'labs/lab.mobx-model';

import {ContainerLog} from './container-log.react-component';
import {LogsModalStore} from './logs-modal.mobx-store';

interface LogsModalProps {
    lab: Lab;
    isShown: boolean;
    onClose: () => void;
}

@observer
export class LogsModal extends React.Component<LogsModalProps> {
    constructor(props: LogsModalProps) {
        super(props);
        this.store = new LogsModalStore(this.props.lab.id, this.props.lab.myLatestInstance.uuid);
    }

    async componentDidMount() {
        await this.store.requestLogs();
    }

    store: LogsModalStore;

    @autobind
    onClose() {
        this.store.stopPollingForLogs();
        this.props.onClose();
    }

    renderModalContents() {
        if (this.store.isLoading) {
            return <Loader block={true} size="xxlarge" label={gettext('Fetching logs')} />;
        }

        if (!this.store.isLoading && this.store.isError) {
            return gettext('An error occurred, please try again later.');
        }

        if (!this.store.isLoading && !Object.keys(this.store.logs).length) {
            return gettext('Logs are not ready yet, please try again later.');
        }

        if (Object.keys(this.store.logs).length === 1) {
            return <ContainerLog logs={Object.values(this.store.logs)[0]} />;
        }

        return (
            <Accordion size="medium" toggleBehavior="max-one">
                {Object.keys(this.store.logs).map((key) => (
                    <Accordion.Panel
                        title={interpolate(
                            gettext('Logs from %(containerName)s'),
                            {
                                containerName: key,
                            },
                            true,
                        )}
                        key={key}
                    >
                        <ContainerLog logs={this.store.logs[key]} />
                    </Accordion.Panel>
                ))}
            </Accordion>
        );
    }

    render() {
        const {isShown, lab} = this.props;

        const modalTitle = interpolate(
            gettext('%(labName)s launch logs'),
            {labName: lab.title},
            true,
        );

        return (
            <Modal
                isOpen={isShown}
                onClose={this.onClose}
                title={modalTitle}
                data-purpose="modal-lab-launch-logs"
            >
                {this.renderModalContents()}
            </Modal>
        );
    }
}
