import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {ERROR_ACTIONS} from './constants';

@inject('store')
@observer
export default class ErrorModal extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const {error, errorModalContent} = this.props.store;
        const {title, text, actions} = errorModalContent;
        return (
            <Modal
                isOpen={!!error}
                onClose={this.props.store.clearError}
                requireExplicitAction={true}
                title={title}
            >
                <div
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'error-modal:error-text',
                        html: text,
                    })}
                />
                <FooterButtons>
                    {actions.map((action, i) => {
                        const buttonProps = {
                            key: action,
                            udStyle: 'primary',
                            onClick: this.props.store.forceExitEditor,
                            children: gettext('Exit Editor'),
                        };
                        if (actions.length > 1 && i < actions.length - 1) {
                            buttonProps.udStyle = 'ghost';
                        }
                        if (action === ERROR_ACTIONS.DISCARD) {
                            buttonProps.onClick = this.props.store.clearError;
                            buttonProps.children = gettext('Return to Editor');
                        } else if (action === ERROR_ACTIONS.EXIT_WITHOUT_SAVING) {
                            buttonProps.children = gettext('Exit Without Saving');
                        }
                        return <Button {...buttonProps} />;
                    })}
                </FooterButtons>
            </Modal>
        );
    }
}
