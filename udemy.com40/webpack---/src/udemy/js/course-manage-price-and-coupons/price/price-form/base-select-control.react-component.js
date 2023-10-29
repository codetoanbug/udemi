import {Dropdown} from '@udemy/react-menu-components';
import {pxToRem} from '@udemy/styles';
import PropTypes from 'prop-types';
import React from 'react';

import './price-select.less';

const BaseSelectControl = ({children, disabled, onChange, renderTitle, value}) => {
    children = React.Children.toArray(children);
    let selectedOption = children.find((option) => option.props.value === value);
    if (!selectedOption) {
        selectedOption = {props: {children: []}};
    }
    return (
        <Dropdown
            placement="bottom-start"
            menuWidth="fullWidth"
            menuMaxHeight={`${pxToRem(194)}rem`}
            trigger={
                <Dropdown.Button disabled={disabled} styleName="btn">
                    {renderTitle(selectedOption.props.children)}
                </Dropdown.Button>
            }
        >
            <Dropdown.Menu>
                {children.map((option) => (
                    <Dropdown.MenuItem key={option.key} onClick={() => onChange(option)}>
                        {option.props.children}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

BaseSelectControl.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    renderTitle: PropTypes.func,
    value: PropTypes.any.isRequired,
};

BaseSelectControl.defaultProps = {
    children: null,
    disabled: false,
    renderTitle: (selectedOptionText) => selectedOptionText,
};

export default BaseSelectControl;
