import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {
    PRIVATE_VISIBILITY_OPTION,
    PUBLIC_VISIBILITY_OPTION,
    VISIBILITY_OPTIONS_MODAL_CONTENT,
} from '../constants';

import './info-panel.less';

@observer
export default class DiscoverabilityModal extends React.Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        selectedMode: PropTypes.string.isRequired,
        onConfirmPublishMode: PropTypes.func.isRequired,
        numberOfEnrollments: PropTypes.number.isRequired,
        folderTitles: PropTypes.array.isRequired,
    };

    publicPathMessage() {
        return (
            <>
                <p styleName="modal-content-title">
                    {VISIBILITY_OPTIONS_MODAL_CONTENT[PUBLIC_VISIBILITY_OPTION].content_title}
                </p>
                <ul>
                    {VISIBILITY_OPTIONS_MODAL_CONTENT[PUBLIC_VISIBILITY_OPTION].content.map(
                        (message, index) => (
                            <li key={index}>{message}</li>
                        ),
                    )}
                </ul>
            </>
        );
    }

    renderVisibleContentToUsersText() {
        const {numberOfEnrollments} = this.props;

        if (numberOfEnrollments === 0) {
            return <li>{gettext('It will be visible only to you and other editors.')}</li>;
        }
        return (
            <li>
                {ninterpolate(
                    'It will be visible only to you, other editors and %(numberOfEnrollments)s person who is already enrolled in this path.',
                    'It will be visible only to you, other editors and %(numberOfEnrollments)s people who are already enrolled in this path.',
                    numberOfEnrollments,
                    {numberOfEnrollments},
                )}
            </li>
        );
    }

    renderFolderInfoText() {
        const {folderTitles} = this.props;

        if (folderTitles.length) {
            return (
                <li>
                    {ngettext(
                        "It will no longer be listed under 'All paths' or the following folder:",
                        "It will no longer be listed under 'All paths' or the following folders:",
                        folderTitles.length,
                    )}
                    <ul styleName="folder-title-list">
                        {this.props.folderTitles.map((folderTitle, index) => (
                            <li key={index}>{folderTitle}</li>
                        ))}
                    </ul>
                </li>
            );
        }
        return <li>{gettext("It will no longer be listed under 'All paths'.")}</li>;
    }

    privatePathMessage() {
        return (
            <>
                <p styleName="modal-content-title">
                    {VISIBILITY_OPTIONS_MODAL_CONTENT[PRIVATE_VISIBILITY_OPTION].content_title}
                </p>
                <ul>
                    {this.renderVisibleContentToUsersText()}
                    {this.renderFolderInfoText()}
                </ul>
            </>
        );
    }

    render() {
        const {isVisible, onHide, onConfirmPublishMode, selectedMode} = this.props;
        return (
            <Modal
                title={VISIBILITY_OPTIONS_MODAL_CONTENT[selectedMode].title}
                isOpen={isVisible}
                onClose={onHide}
            >
                {selectedMode === PUBLIC_VISIBILITY_OPTION
                    ? this.publicPathMessage()
                    : this.privatePathMessage()}
                <FooterButtons>
                    <Button udStyle="ghost" onClick={onHide}>
                        {gettext('Cancel')}
                    </Button>
                    <Button onClick={onConfirmPublishMode} data-purpose="confirm-visibility">
                        {VISIBILITY_OPTIONS_MODAL_CONTENT[selectedMode].button_label}
                    </Button>
                </FooterButtons>
            </Modal>
        );
    }
}
