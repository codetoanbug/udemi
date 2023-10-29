import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {SaveToListButtonStore} from './save-to-list-button.mobx-store';
import styles from './save-to-list-modal.less';
import {SaveToListSelectionForm} from './save-to-list-selection-form.react-component';

interface SaveToListModalProps {
    saveToListButtonStore: SaveToListButtonStore;
}

@observer
export class InternalSaveToListModal extends Component<SaveToListModalProps & WithI18nProps> {
    exitHandler = () => {
        this.props.saveToListButtonStore.hideModal();
    };

    renderBody = () => {
        if (this.props.saveToListButtonStore.isFetchingData) {
            return <Loader size="large" block={true} />;
        }
        return (
            <FormGroup udStyle="fieldset" label="">
                <SaveToListSelectionForm store={this.props.saveToListButtonStore} />
            </FormGroup>
        );
    };

    render() {
        const {gettext} = this.props;
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

export const SaveToListModal = withI18n(InternalSaveToListModal);
