import {LocalizedHtml} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import udLink from 'utils/ud-link';

import LearningPathStore from '../../learning-path.mobx-store';
import AddContentButton from '../add-content/add-content-button.react-component';

import './empty-state.less';

@inject('learningPathStore')
@observer
export default class EmptyState extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
    };

    get recommendedCoursesLink() {
        return (
            <Button
                className="ud-link-underline"
                udStyle="link"
                typography="ud-text-md"
                data-purpose="recommended-courses-link"
                onClick={this.handleRecommendationLinkClick}
            />
        );
    }

    @autobind
    handleRecommendationLinkClick(e) {
        e.preventDefault();
        this.props.learningPathStore.showCourseRecommendations(null);
    }

    get emptyStateMessage() {
        if (this.props.learningPathStore.learningPath.canUserEdit) {
            return (
                <span data-purpose="empty-state-message-editor">
                    {gettext(
                        'Paths can include courses and links to anything on the web. Edit path to add content.',
                    )}
                </span>
            );
        }
        return (
            <span data-purpose="empty-state-message-viewer">
                {gettext('Return to this path when the editor has added content')}
            </span>
        );
    }

    renderViewMode() {
        return (
            <>
                <h3 className="ud-heading-lg">{gettext('No content has been added yet')}</h3>
                {this.emptyStateMessage}
            </>
        );
    }

    renderEditMode() {
        const {learningPath} = this.props.learningPathStore;
        return (
            <>
                <div styleName="add-content-container">
                    <h3 className="ud-heading-lg">
                        {gettext('Add content to your learning path')}
                    </h3>
                    <LocalizedHtml
                        html={gettext(
                            'Paths can include courses and links to anything on the web.' +
                                ' Need help choosing courses for your path?' +
                                ' Explore our <a class="link">recommended courses</a>.',
                        )}
                        interpolate={{link: this.recommendedCoursesLink}}
                    />
                </div>
                <div styleName="form-container">
                    <AddContentButton
                        section={learningPath.invisibleSection}
                        sectionIndex={null}
                        size="small"
                        context="empty-state"
                    />
                </div>
            </>
        );
    }

    render() {
        const {isEditModeEnabled} = this.props.learningPathStore;

        return (
            <div styleName="container">
                <div styleName="column">
                    {isEditModeEnabled ? this.renderEditMode() : this.renderViewMode()}
                </div>
                <div styleName="column">
                    <Image
                        src={udLink.toStorageStaticAsset('learning-path/add-to-path.jpg')}
                        srcSet={`${udLink.toStorageStaticAsset(
                            'learning-path/add-to-path.jpg',
                        )} 1x, ${udLink.toStorageStaticAsset(
                            'learning-path/add-to-path-2x.jpg',
                        )} 2x`}
                        alt=""
                        width={240}
                        height={240}
                    />
                </div>
            </div>
        );
    }
}
