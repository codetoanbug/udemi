import {Image, Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import udLink from 'utils/ud-link';

import {BASE_PATH} from '../../constants';
import LearningPathStore from '../../learning-path.mobx-store';
import {CREATE_PATH_BUTTON, EMPTY_STATE_IMAGE_SIZE} from '../constants';
import ListPageStore from '../list-page.mobx-store';
import NoSearchResults from '../no-search-results.react-component';
import {FOLDER_EMPTY_STATE_DESCRIPTION_ITEMS} from './constants';

import './folder-empty-state.less';

@inject('learningPathStore')
@inject('listPageStore')
export default class FolderEmptyState extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        listPageStore: PropTypes.instanceOf(ListPageStore).isRequired,
        handleCreateCallback: PropTypes.func.isRequired,
    };

    renderCreateButton() {
        return (
            <Button data-purpose="create-learning-path" onClick={this.props.handleCreateCallback}>
                {CREATE_PATH_BUTTON.TEXT}
            </Button>
        );
    }

    get defaultContentMessage() {
        const {isTabletViewportSize} = this.props.learningPathStore;

        return (
            <>
                <div styleName="checkboxes">
                    {FOLDER_EMPTY_STATE_DESCRIPTION_ITEMS.map((item, index) => {
                        return (
                            <div styleName="checkbox-description" key={`description-item-${index}`}>
                                <Image
                                    width={20}
                                    height={20}
                                    alt={gettext('Checked box')}
                                    src={udLink.toStorageStaticAsset('learning-path/checked.svg')}
                                />
                                {item}
                            </div>
                        );
                    })}
                </div>
                {!isTabletViewportSize && (
                    <>
                        <div styleName="mt-md">{gettext('Or')}</div>
                        <div styleName="mt-md">{this.renderCreateButton()}</div>
                    </>
                )}
            </>
        );
    }

    get studentContentMessage() {
        const {isTabletViewportSize} = this.props.learningPathStore;

        return (
            <div data-purpose="learner-empty-folder-message">
                <div>{gettext('To manage folders, you must be an admin.')}</div>
                <div
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'folder-empty-state:all-paths-link',
                        html: interpolate(
                            gettext(
                                'Check out <a href="%(allPathsLink)s">All paths</a> to see current paths or inspire learning by creating a path',
                            ),
                            {allPathsLink: `${BASE_PATH}`},
                            true,
                        ),
                    })}
                />
                {!isTabletViewportSize && <div styleName="mt-sm">{this.renderCreateButton()}</div>}
            </div>
        );
    }

    get emptyFolderMessage() {
        const {isStudent} = this.props.learningPathStore.learningPath;

        return (
            <div styleName="container">
                <div styleName={classNames('content', {'content-vcenter': isStudent})}>
                    <Image
                        width={EMPTY_STATE_IMAGE_SIZE}
                        height={EMPTY_STATE_IMAGE_SIZE}
                        alt={gettext('Empty folder')}
                        src={udLink.toStorageStaticAsset('learning-path/folder-empty-state-v2.svg')}
                    />
                    <div styleName="text-wrapper">
                        {isStudent ? this.studentContentMessage : this.defaultContentMessage}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {isNoSearchResultMode} = this.props.listPageStore;

        return isNoSearchResultMode ? <NoSearchResults /> : this.emptyFolderMessage;
    }
}
