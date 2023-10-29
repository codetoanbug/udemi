import {Dropdown} from '@udemy/react-menu-components';
import {pxToRem} from '@udemy/styles';
import React from 'react';

import Lab from 'labs/lab.mobx-model';

import './labs-dropdown.less';

interface LabsDropdownProps {
    labs: Lab[];
    title: string;
    onLabSelect: (labId?: number) => void;
    disabled: boolean;
}

export const LabsDropdown = ({labs, title, onLabSelect, disabled}: LabsDropdownProps) => {
    return (
        <div styleName="dropdown">
            <Dropdown
                placement="bottom-start"
                menuWidth="auto"
                menuMaxHeight={`${pxToRem(500)}rem`}
                styleName="dropdown"
                trigger={
                    <Dropdown.Button
                        className="ud-link-neutral"
                        styleName="dropdown-button"
                        size="medium"
                        udStyle="ghost"
                        disabled={disabled}
                        typography="ud-heading-xl"
                    >
                        <span styleName="dropdown-title">{title}</span>
                    </Dropdown.Button>
                }
            >
                <div styleName="dropdown-menu">
                    <Dropdown.Menu key="all-labs-section">
                        <Dropdown.MenuItem key="all-labs" onClick={() => onLabSelect(undefined)}>
                            {gettext('All labs')}
                        </Dropdown.MenuItem>
                        {labs.map((lab: Lab) => (
                            <Dropdown.MenuItem key={lab.id} onClick={() => onLabSelect(lab.id)}>
                                {lab.title}
                            </Dropdown.MenuItem>
                        ))}
                    </Dropdown.Menu>
                </div>
            </Dropdown>
        </div>
    );
};
