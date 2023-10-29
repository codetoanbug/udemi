import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import {BASE_PATH} from '../../constants';
import EditableText from '../../editable-text.react-component.js';
import {FOLDER_LIST_TYPE} from '../constants';
import ListPageStore from '../list-page.mobx-store';
import {
    FOLDER_TITLE_PLACEHOLDER,
    FOLDER_TITLE_MAX_LENGTH,
    FOLDER_DESCRIPTION_PLACEHOLDER,
} from './constants';
import styles from './editable-folder.less';

@inject('listPageStore')
@withRouter
@observer
export default class EditableFolder extends React.Component {
    static propTypes = {
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        activeFolder: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.titleInputRef && this.titleInputRef.focus();
    }

    @autobind
    setTitleInputRef(ref) {
        this.titleInputRef = ref;
    }

    @autobind
    handleDoneClick() {
        this.props.history.push({
            pathname: `${BASE_PATH}${FOLDER_LIST_TYPE}/${this.props.activeFolder.id}`,
            search: this.props.listPageStore.urlSearchString,
        });
    }

    render() {
        const {activeFolder} = this.props;
        const {title, description, id, setTitle, setDescription, isSaving} = activeFolder;

        return (
            <div styleName="wrapper">
                <EditableText
                    inputRef={this.setTitleInputRef}
                    value={title}
                    placeholder={FOLDER_TITLE_PLACEHOLDER}
                    onChange={setTitle}
                    id={`folder-title-${id}`}
                    shouldSavePlaceholderAsValue={true}
                    maxLength={FOLDER_TITLE_MAX_LENGTH}
                    className={classNames(styles.title, 'ud-heading-xl')}
                />
                <EditableText
                    value={description}
                    elementType="p"
                    placeholder={FOLDER_DESCRIPTION_PLACEHOLDER}
                    onChange={setDescription}
                    id={`folder-description-${id}`}
                    className={classNames(styles.description, 'ud-text-md')}
                />
                <Button
                    data-purpose="done-editing-folder"
                    disabled={isSaving}
                    onClick={this.handleDoneClick}
                >
                    {isSaving ? gettext('Saving ...') : gettext('Done')}
                </Button>
            </div>
        );
    }
}
