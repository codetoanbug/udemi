import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import LearningPathFolder from 'learning-path/list-page/folders/learning-path-folder.mobx-model';

import './add-to-folders-modal.less';

@observer
export default class FolderCheckbox extends Component {
    static propTypes = {
        folder: PropTypes.instanceOf(LearningPathFolder).isRequired,
        isPathInFolder: PropTypes.bool.isRequired,
    };

    @autobind
    handleChange(e) {
        this.props.folder.setIsSelected(e.target.checked);
    }

    render() {
        const {folder} = this.props;

        return (
            <Checkbox
                styleName="folder-selection-checkbox"
                data-purpose={`folder-checkbox-${folder.id}`}
                onChange={this.handleChange}
                defaultChecked={this.props.isPathInFolder || folder.isSelected}
            >
                {folder.title}
            </Checkbox>
        );
    }
}
