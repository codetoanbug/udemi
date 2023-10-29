import {Button} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import LearningPathStore from '../learning-path.mobx-store';
import {CREATE_PATH_BUTTON, CREATE_LEARNING_PATH} from './constants';
import {LearningPathDetailsModal} from './learning-path-details-modal.react-component';
import LearningPathSearch from './learning-path-search.react-component';
import LearningPathSorting from './learning-path-sorting.react-component';

import './list-page.less';

@inject('learningPathStore')
export default class ListPageFilterBar extends Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        handleCreateCallback: PropTypes.func.isRequired,
    };

    @autobind
    handleSuccess(title, description) {
        this.props.learningPathStore.learningPath.setTitle(title);
        this.props.learningPathStore.learningPath.setDescription(description);
        this.props.handleCreateCallback();
    }

    @autobind
    handleCancel() {
        this.props.learningPathStore.learningPath.setTitle('');
        this.props.learningPathStore.learningPath.setDescription('');
    }

    render() {
        return (
            <div styleName="mt-sm filter-bar">
                <LearningPathSearch />
                <LearningPathSorting />
                <ModalTrigger
                    trigger={
                        <Button data-purpose="create-learning-path">
                            {CREATE_PATH_BUTTON.TEXT}
                        </Button>
                    }
                    renderModal={({isOpen, onClose}) => (
                        <LearningPathDetailsModal
                            isOpen={isOpen}
                            onClose={onClose}
                            onSuccess={this.handleSuccess}
                            onCancel={this.handleCancel}
                            modalTitle={CREATE_LEARNING_PATH.TEXT}
                            modalConfirmText={CREATE_PATH_BUTTON.TEXT}
                        />
                    )}
                />
            </div>
        );
    }
}
