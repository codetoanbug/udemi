import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Checkbox} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import DeleteStore from './delete.mobx-store';

@inject('resourceContext', 'actionCallbacks')
@observer
export default class DeleteModal extends React.Component {
    static propTypes = {
        deleteStore: PropTypes.instanceOf(DeleteStore).isRequired,
        resourceContext: PropTypes.string.isRequired,
        actionCallbacks: PropTypes.shape({
            onDeleteSuccess: PropTypes.func,
            onDeleteError: PropTypes.func,
        }),
    };

    static defaultProps = {
        actionCallbacks: {},
    };

    @autobind
    async deleteLearningPath() {
        try {
            await this.props.deleteStore.learningPath.deletePath();
            this.props.actionCallbacks.onDeleteSuccess();
        } catch (e) {
            this.props.actionCallbacks.onDeleteError();
        }
    }

    render() {
        const {
            isDeleteModalVisible,
            toggleDeleteModal,
            isConfirmBoxChecked,
            handleConfirmBoxClick,
            learningPath,
        } = this.props.deleteStore;

        return (
            <Modal
                isOpen={isDeleteModalVisible}
                onClose={toggleDeleteModal}
                title={gettext('Delete path')}
            >
                <AlertBanner
                    udStyle="warning"
                    showCta={false}
                    title={interpolate(
                        gettext("You are about to delete '%(pathTitle)s'"),
                        {pathTitle: learningPath.pathTitle},
                        true,
                    )}
                />
                <Checkbox checked={isConfirmBoxChecked} onChange={handleConfirmBoxClick}>
                    <span>
                        {gettext(
                            'I understand that this path will be permanently deleted and I will not be able to access it in the future',
                        )}
                    </span>
                </Checkbox>

                <FooterButtons>
                    <Button udStyle="ghost" onClick={toggleDeleteModal}>
                        {gettext('Cancel')}
                    </Button>
                    <Button disabled={!isConfirmBoxChecked} onClick={this.deleteLearningPath}>
                        {gettext('Delete')}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
