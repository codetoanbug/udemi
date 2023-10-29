import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './animated-save-button.less';

const BUTTON_STATES = {
    IDLE: 'IDLE', // Normal button text
    SAVING: 'SAVING', // Loading spinner as text
    SAVED: 'SAVED', // Check icon as text
};

export const SAVED_ICON_DELAY = 2000;

@observer
export default class AnimatedSaveButton extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        isSaving: PropTypes.bool.isRequired,
        hasError: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.isSaving && this.props.isSaving) {
            this.updateButton(BUTTON_STATES.SAVING);
        } else if (prevProps.isSaving && !this.props.isSaving && !this.props.hasError) {
            this.updateButton(BUTTON_STATES.SAVED);
            setTimeout(() => this.updateButton(BUTTON_STATES.IDLE), SAVED_ICON_DELAY);
        } else if (prevProps.isSaving && !this.props.isSaving && !!this.props.hasError) {
            this.updateButton(BUTTON_STATES.IDLE);
        }
    }

    @observable buttonState = BUTTON_STATES.IDLE;

    @action
    updateButton(newState) {
        this.buttonState = newState;
    }

    @autobind
    handleClick() {
        // We don't disable the button for style purpose but give it a loading spinner as content instead
        // however, we don't want to make any new save calls if the user clicks the (loading) save button
        if (!this.props.isSaving) {
            this.props.onClick();
        }
    }

    render() {
        const {children, onClick, isSaving, hasError, disabled, ...buttonProps} = this.props;
        let icon;
        if (this.buttonState === BUTTON_STATES.SAVING) {
            icon = <Loader color="inherit" />;
        } else if (this.buttonState === BUTTON_STATES.SAVED) {
            icon = <SuccessIcon label={gettext('Saved')} color="inherit" />;
        }
        return (
            <Button
                styleName="save-button"
                onClick={this.handleClick}
                data-purpose="editor-save"
                disabled={disabled && this.buttonState !== BUTTON_STATES.SAVED}
                {...buttonProps}
            >
                {icon && <span styleName="overlay">{icon}</span>}
                {children}
            </Button>
        );
    }
}
