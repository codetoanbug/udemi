import {Dropdown} from '@udemy/react-menu-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class DescriptionDropdown extends Component {
    static propTypes = {
        description: PropTypes.string.isRequired,
        labels: PropTypes.object.isRequired,
        value: PropTypes.string.isRequired,
        setValue: PropTypes.func.isRequired,
    };

    render() {
        const {description, labels, value, setValue, ...props} = this.props;
        return (
            <Dropdown
                placement="bottom-start"
                menuWidth="large"
                trigger={
                    <Dropdown.Button
                        className="ud-link-neutral"
                        size="medium"
                        typography="ud-text-sm"
                        udStyle="ghost"
                    >
                        <span>{`${description}:`}</span>
                        <span className="ud-text-bold">{labels[value]}</span>
                    </Dropdown.Button>
                }
                {...props}
            >
                <Dropdown.Menu>
                    {Object.keys(labels).map((key) => (
                        <Dropdown.MenuItem key={key} onClick={() => setValue(key)}>
                            {labels[key]}
                        </Dropdown.MenuItem>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
