import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './list-path-editors.less';

@observer
export default class UserPermissionActions extends React.Component {
    static propTypes = {
        editor: PropTypes.object.isRequired,
        removePathEditor: PropTypes.func.isRequired,
        makeEditorFeatured: PropTypes.func.isRequired,
    };

    @autobind
    handleRemoveEditorClick() {
        return this.props.removePathEditor(this.props.editor);
    }

    @autobind
    handleMakeFeaturedEditorClick() {
        return this.props.makeEditorFeatured(this.props.editor);
    }

    render() {
        return (
            <>
                <Dropdown.Menu>
                    <Dropdown.MenuItem onClick={this.handleMakeFeaturedEditorClick}>
                        <div className="ud-heading-sm" data-purpose="title">
                            {gettext('Featured editor')}
                        </div>
                        <span className="ud-text-xs" styleName="info-text">
                            {gettext(
                                'The featured editor will be the first displayed in the path.',
                            )}
                        </span>
                    </Dropdown.MenuItem>
                    <Dropdown.MenuItem disabled={true}>
                        <div className="ud-heading-sm" data-purpose="title">
                            {gettext('Editor')}
                        </div>
                        <span className="ud-text-xs" styleName="info-text">
                            {gettext('Can edit the path and add/remove other editors.')}
                        </span>
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
                <Dropdown.Menu styleName="remove-menu">
                    <Dropdown.MenuItem
                        onClick={this.handleRemoveEditorClick}
                        data-purpose="remove-menu-item"
                    >
                        <span className="ud-heading-sm">{gettext('Remove')}</span>
                    </Dropdown.MenuItem>
                </Dropdown.Menu>
            </>
        );
    }
}
