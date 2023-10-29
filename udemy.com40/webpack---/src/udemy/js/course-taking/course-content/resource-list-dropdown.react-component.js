import FolderOpenIcon from '@udemy/icons/dist/folder-open.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AssetModel from 'asset/asset.mobx-model';

import Resource from './resource.react-component';

const stopPropagation = (event) => event.stopPropagation();

@observer
export default class ResourceListDropdown extends Component {
    static propTypes = {
        resources: PropTypes.arrayOf(PropTypes.instanceOf(AssetModel)),
    };

    static defaultProps = {
        resources: [],
    };

    render() {
        const {resources, ...props} = this.props;
        if (!resources.length) {
            return null;
        }

        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div onClick={stopPropagation}>
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <Dropdown
                    menuWidth="large"
                    placement="bottom-end"
                    trigger={
                        <Dropdown.Button
                            aria-label={gettext('Resource list')}
                            size="xsmall"
                            typography="ud-text-sm"
                        >
                            <FolderOpenIcon label={false} />
                            {gettext('Resources')}
                        </Dropdown.Button>
                    }
                >
                    <Dropdown.Menu>
                        {resources.map((resource) => (
                            <Resource
                                key={resource.id}
                                displayMode={Resource.DISPLAY.DROPDOWN}
                                resource={resource}
                                {...props}
                            />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}
