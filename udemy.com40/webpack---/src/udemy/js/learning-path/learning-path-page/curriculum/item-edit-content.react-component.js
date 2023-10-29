import EditIcon from '@udemy/icons/dist/edit.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathSectionItem from '../../learning-path-section-item.mobx-model';
import CoursePortionModal from './course-portion/course-portion-modal.react-component';

@observer
export default class ItemEditContent extends React.Component {
    static propTypes = {
        item: PropTypes.instanceOf(LearningPathSectionItem).isRequired,
        isMobileViewPortSize: PropTypes.bool,
    };

    static defaultProps = {
        isMobileViewPortSize: false,
    };

    @observable isEditContentModalOpen = false;

    @autobind
    @action
    openEditContentModal() {
        this.isEditContentModalOpen = true;
    }

    @autobind
    @action
    closeEditContentModal() {
        this.isEditContentModalOpen = false;
        // Make sure the modal is well out of sight before we clear the data
        setTimeout(() => {
            this.props.item.content.clearCurriculum();
        }, 1000);
    }

    @autobind
    async editContentSubmit() {
        await this.props.item.editContent();
        this.closeEditContentModal();
    }

    renderEditButton() {
        const props = {
            className: 'no-drag',
            udStyle: 'secondary',
            size: 'xsmall',
            onClick: this.openEditContentModal,
            'data-purpose': 'edit-course-content-button',
        };
        if (this.props.isMobileViewPortSize) {
            return (
                <IconButton {...props}>
                    <EditIcon label={gettext('Course content')} />
                </IconButton>
            );
        }
        return (
            <Button {...props}>
                <EditIcon label={false} />
                {gettext('Course content')}
            </Button>
        );
    }

    renderEditButtonInRemovedCourseAlert() {
        return (
            <Button
                className="no-drag"
                udStyle="ghost"
                size="xsmall"
                data-purpose="see-content-button"
                onClick={this.openEditContentModal}
            >
                {gettext('See course content')}
            </Button>
        );
    }

    render() {
        const {item} = this.props;

        return (
            <>
                {item.isRemoved
                    ? this.renderEditButtonInRemovedCourseAlert()
                    : this.renderEditButton()}
                {this.isEditContentModalOpen && (
                    <CoursePortionModal
                        show={this.isEditContentModalOpen}
                        onHide={this.closeEditContentModal}
                        portion={this.props.item.content}
                        onSubmit={this.editContentSubmit}
                        isReadOnly={item.isRemoved}
                    />
                )}
            </>
        );
    }
}
