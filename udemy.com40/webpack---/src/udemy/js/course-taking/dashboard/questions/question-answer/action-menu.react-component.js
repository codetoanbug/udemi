import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import PropTypes from 'prop-types';
import React from 'react';

export default class ActionMenu extends React.Component {
    static propTypes = {
        ariaLabel: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Dropdown
                placement="bottom-end"
                trigger={
                    <IconButton className="ud-link-neutral" size="xsmall" udStyle="ghost">
                        <MoreIcon label={this.props.ariaLabel} />
                    </IconButton>
                }
            >
                <Dropdown.Menu>{this.props.children}</Dropdown.Menu>
            </Dropdown>
        );
    }
}
