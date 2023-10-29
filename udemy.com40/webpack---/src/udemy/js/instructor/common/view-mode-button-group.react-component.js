import {getUniqueId} from '@udemy/design-system-utils';
import {IconButton} from '@udemy/react-core-components';
import {Tooltip} from '@udemy/react-popup-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './view-mode-button-group.less';

class ViewModeTooltipTrigger extends Component {
    static propTypes = {
        icon: PropTypes.node.isRequired,
    };

    onClickInput(event) {
        // Popper opens on focus, and toggles on click. When ArrowUp/ArrowDown keys are used
        // on radio inputs, both onFocus and onClick are triggered. Hence, Popper immediately closes
        // after it opens. To avoid this, we prevent onClick from propagating up to Popper.
        event.stopPropagation();
    }

    render() {
        const {icon, ...props} = this.props;
        return (
            <IconButton
                styleName="btn"
                udStyle={props.checked ? 'primary' : 'secondary'}
                componentClass="label"
                htmlFor={props.id}
                overlaychildren={
                    <>
                        <input
                            {...props}
                            type="radio"
                            className="ud-sr-only"
                            onClick={this.onClickInput}
                        />
                        <span styleName="focus-outline" />
                    </>
                }
            >
                {icon}
            </IconButton>
        );
    }
}

class ViewModeButton extends Component {
    static propTypes = {
        tooltipText: PropTypes.string.isRequired,
    };

    id = getUniqueId('view-mode-button');

    render() {
        const {tooltipText, ...props} = this.props;
        return (
            <Tooltip
                placement="bottom"
                trigger={<ViewModeTooltipTrigger {...props} id={this.id} />}
            >
                {tooltipText}
            </Tooltip>
        );
    }
}

export default function ViewModeButtonGroup({children, label, ...htmlProps}) {
    return (
        <fieldset {...htmlProps} className={htmlProps.className}>
            <legend className="ud-sr-only">{label}</legend>
            <div styleName="btns">{children}</div>
        </fieldset>
    );
}

ViewModeButtonGroup.propTypes = {
    label: PropTypes.node.isRequired,
};

ViewModeButtonGroup.Button = ViewModeButton;
