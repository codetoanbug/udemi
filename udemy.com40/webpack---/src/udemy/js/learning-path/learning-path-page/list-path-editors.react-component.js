import {Avatar} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {observer, PropTypes as MobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {USER_IMAGE_SIZE} from './constants';
import UserPermissionActions from './user-permissions-actions.react-component';

import './list-path-editors.less';

@observer
export default class ListPathEditors extends React.Component {
    static propTypes = {
        owner: PropTypes.object.isRequired,
        editors: MobxTypes.arrayOrObservableArray.isRequired,
        removePathEditor: PropTypes.func,
        makeEditorFeatured: PropTypes.func,
        isEditable: PropTypes.bool,
        isPopover: PropTypes.bool,
    };

    static defaultProps = {
        removePathEditor: undefined,
        makeEditorFeatured: undefined,
        isEditable: false,
        isPopover: false,
    };

    userPermissionDetail(editor, owner) {
        if (editor.id === owner.id) {
            return (
                <span
                    className="ud-heading-sm"
                    styleName="featured-editor-text"
                    data-purpose="user-permission"
                >
                    {gettext('Featured editor')}
                </span>
            );
        }

        return (
            <Dropdown
                placement="bottom-end"
                menuWidth="large"
                trigger={
                    <Dropdown.Button udStyle="ghost" size="medium" data-purpose="user-permission">
                        {gettext('Editor')}
                    </Dropdown.Button>
                }
            >
                <UserPermissionActions
                    editor={editor}
                    removePathEditor={this.props.removePathEditor}
                    makeEditorFeatured={this.props.makeEditorFeatured}
                />
            </Dropdown>
        );
    }

    render() {
        const {owner, editors, isEditable, isPopover} = this.props;
        return (
            <ul styleName={isPopover ? 'popover-editors' : ''} className="ud-unstyled-list">
                {editors.map((editor) => (
                    <li
                        key={editor.id}
                        styleName={isEditable || isPopover ? 'editor' : 'editor-no-bottom-border'}
                        data-purpose="path-editor"
                    >
                        <span styleName="image-and-name">
                            <Avatar
                                user={editor}
                                alt="DISPLAY_NAME"
                                srcKey="image_50x50"
                                size={USER_IMAGE_SIZE}
                                styleName="editor-image"
                            />
                            <span data-purpose="display-name">{editor.display_name}</span>
                        </span>
                        {isEditable && this.userPermissionDetail(editor, owner)}
                    </li>
                ))}
            </ul>
        );
    }
}
