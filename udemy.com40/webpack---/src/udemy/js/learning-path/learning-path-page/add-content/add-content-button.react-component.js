import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import getConfigData from 'utils/get-config-data';

import LearningPathSection from '../../learning-path-section.mobx-model';
import LearningPathStore from '../../learning-path.mobx-store';
import {
    ADD_CONTENT_LABEL,
    ALLOWED_ITEM_TYPES,
    ASSESSMENT_CONTENT_TYPE,
    CONTENT_TYPE_CONFIG,
    LAB_CONTENT_TYPE,
    LEARNING_PRO_PATH_ORGANIZATION_ID,
    RECOMMENDED_CONTENT_TYPE,
    RESOURCE_CONTENT_TYPE,
    SECTION_CONTENT_TYPE,
} from '../constants';
import pageEventTracker from '../page-event-tracker';
import AddContentStore from './add-content.mobx-store';
import AddLinkForm from './add-link-form.react-component';

import './add-content-button.less';

const udConfig = getConfigData();

@inject('learningPathStore')
@observer
export default class AddContentButton extends React.Component {
    static propTypes = {
        learningPathStore: PropTypes.instanceOf(LearningPathStore).isRequired,
        section: PropTypes.instanceOf(LearningPathSection).isRequired,
        sectionIndex: PropTypes.number,
        size: PropTypes.oneOf(['medium', 'small', 'xsmall']),
        udStyle: PropTypes.oneOf(['primary', 'ghost']),
        className: PropTypes.string,
        isIconVisible: PropTypes.bool,
        isInCourseRemovalAlert: PropTypes.bool,
        itemIndex: PropTypes.number,
        context: PropTypes.string,
    };

    static defaultProps = {
        size: 'small',
        udStyle: 'primary',
        sectionIndex: null,
        itemIndex: null,
        className: '',
        isIconVisible: true,
        isInCourseRemovalAlert: false,
        context: '',
    };

    constructor(props) {
        super(props);
        this.addContentStore = new AddContentStore();
    }

    @autobind
    onAddContentButtonClick() {
        pageEventTracker.clickedAddContent(this.props.context);
    }

    @autobind
    async createItem(url, extraParameters = {}) {
        if (this.addContentStore.isSaving) {
            return;
        }
        try {
            this.addContentStore.setIsSaving(true);
            await this.props.section.createItem(
                url,
                this.addContentStore.contentTypeToAdd,
                this.props.itemIndex,
                extraParameters,
            );
            this.addContentStore.hideAddItemForm();
        } catch (error) {
            this.addContentStore.handleError(error);
        } finally {
            this.addContentStore.setIsSaving(false);
        }
    }

    @autobind
    onItemTypeClick(contentTypeKey) {
        const {sectionIndex, learningPathStore} = this.props;

        pageEventTracker.clickedContentItem(
            contentTypeKey,
            CONTENT_TYPE_CONFIG[contentTypeKey].title,
            this.props.context,
        );

        if (contentTypeKey === RECOMMENDED_CONTENT_TYPE) {
            learningPathStore.showCourseRecommendations(this.props.sectionIndex);
        }
        if (contentTypeKey === SECTION_CONTENT_TYPE) {
            // Add new section after current one
            // section is added to root because there's no nested sections at the moment
            // Insert after current section or on top if there are no visible sections
            const startPosition = sectionIndex === null ? 0 : sectionIndex + 1;
            learningPathStore.addContentToRoot(startPosition, contentTypeKey);
        } else {
            this.addContentStore.showAddItemForm(contentTypeKey);
        }
    }

    renderAddItemForm() {
        const {contentTypeToAdd, errorMessage, hideAddItemForm, isSaving} = this.addContentStore;
        if (ALLOWED_ITEM_TYPES.includes(contentTypeToAdd)) {
            return (
                <AddLinkForm
                    description={CONTENT_TYPE_CONFIG[contentTypeToAdd].description}
                    placeholder={CONTENT_TYPE_CONFIG[contentTypeToAdd].placeholder}
                    contentType={contentTypeToAdd}
                    onSubmit={this.createItem}
                    onDismiss={hideAddItemForm}
                    isSaving={isSaving}
                    errorMessage={errorMessage}
                    isInCourseRemovalAlert={this.props.isInCourseRemovalAlert}
                />
            );
        }
    }

    renderItems() {
        const {learningPathStore} = this.props;
        return Object.keys(CONTENT_TYPE_CONFIG).map((key) => {
            // Just organizations with pro path enabled can create assessments and labs
            if (
                [ASSESSMENT_CONTENT_TYPE, LAB_CONTENT_TYPE].includes(key) &&
                !learningPathStore.userHasUBProAccess
            ) {
                return null;
            }

            // upropath organization cannot include link resources because
            // that organization is used to create the pro paths
            if (
                RESOURCE_CONTENT_TYPE === key &&
                udConfig.brand.has_organization &&
                LEARNING_PRO_PATH_ORGANIZATION_ID === udConfig.brand.organization.id
            ) {
                return null;
            }

            const content = CONTENT_TYPE_CONFIG[key];
            return (
                <Dropdown.MenuItem
                    key={key}
                    data-purpose={`add-${key}`}
                    icon={<ExpandPlusIcon label={false} />}
                    onClick={() => this.onItemTypeClick(key)}
                >
                    {content.title}
                    {content.isPro && (
                        <>
                            {' '}
                            <ProBadge styleName="pro-badge" />
                        </>
                    )}
                </Dropdown.MenuItem>
            );
        });
    }

    render() {
        if (this.addContentStore.isAddItemFormShown) {
            return this.renderAddItemForm();
        }

        return (
            <div className={this.props.className}>
                <Dropdown
                    menuWidth="large"
                    placement="bottom-start"
                    styleName="dropdown"
                    trigger={
                        <Dropdown.Button
                            size={this.props.size}
                            udStyle={this.props.udStyle}
                            data-purpose="add-content-button"
                            withIcon={!this.props.isIconVisible}
                            onClick={this.onAddContentButtonClick}
                        >
                            {this.props.isIconVisible && <ExpandPlusIcon label={false} />}
                            {ADD_CONTENT_LABEL.TEXT}
                        </Dropdown.Button>
                    }
                >
                    <Dropdown.Menu>{this.renderItems()}</Dropdown.Menu>
                </Dropdown>
                {this.props.children}
            </div>
        );
    }
}
