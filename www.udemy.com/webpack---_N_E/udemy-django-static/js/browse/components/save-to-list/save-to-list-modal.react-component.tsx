
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {Modal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';

import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import {SaveToListSelectionForm} from './save-to-list-selection-form.react-component';
import styles from './save-to-list-modal.module.less';

interface SaveToListModalProps {
    saveToListButtonStore: SaveToListButtonStore;
}

@observer
export class SaveToListModal extends Component<SaveToListModalProps> {
    exitHandler = () => {
        this.props.saveToListButtonStore.hideModal();
    }

    renderBody() {
        if (this.props.saveToListButtonStore.isFetchingData) {
            return <Loader size="large" block={true} />;
        }
        return (
            <FormGroup udStyle="fieldset" label="">
                <SaveToListSelectionForm store={this.props.saveToListButtonStore} />
            </FormGroup>
        );
    }

    render() {
        return (
            <Modal
                title={gettext('Save to list')}
                isOpen={this.props.saveToListButtonStore.isModalOpen}
                onOpen={this.props.saveToListButtonStore.fetchListData}
                onClose={this.exitHandler}
                className={styles['save-to-list-modal']}
            >
                {this.renderBody()}
            </Modal>
        );
    }
}
