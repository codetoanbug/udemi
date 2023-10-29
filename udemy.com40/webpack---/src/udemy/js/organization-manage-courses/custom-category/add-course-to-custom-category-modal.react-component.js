import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Checkbox} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {noop} from '@udemy/shared-utils';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {RETIREMENT_ALERT_MODAL_TYPES} from 'organization-common/course-retirement/constants';
import CourseRetirementModalAlert from 'organization-common/course-retirement/course-retirement-modal-alert.react-component';
import CheckboxGroup from 'organization-common/resource-context-menu/menu-items/checkbox-group.react-component';

import AddCourseToCustomCategoryStore from './add-course-to-custom-categories.mobx-store';
import styles from './add-course-to-custom-category-modal.less';

@observer
class InternalAddCourseToCustomCategoryModal extends React.Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        organizationId: PropTypes.number.isRequired,
        /**
         * An array of "course custom category" ids. If you don't provide any courseCustomCategories
         * and preLoadCourseCustomCategories is true, the the modal will fetch them for you.
         */
        courseCustomCategories: PropTypes.array,
        /** The callback which is going get called if adding the course to custom categories
            was successful. */
        onCourseAdded: PropTypes.func,
        /**
         * This property indicates the whether we should fetch the course custom categories
         * when the modal mounted or not (default is true). If you set the value to
         * false then you need to provide the course categories via `courseCustomCategories`
         * property. Basically is some pages we already have `courseCustomCategories` available
         * so we don't want to refetch them again. For example on course dashboard we're going
         * to eventually get the course custom categories ( because we fetch the course data
         * in two stages). So the "courseCustomCategories" would be empty at first. We don't
         * want to fetch the same data again so we have to set this flag to true.
         */
        preLoadCourseCustomCategories: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        courseCustomCategories: [],
        onCourseAdded: noop,
        preLoadCourseCustomCategories: true,
    };

    constructor(props) {
        super(props);
        this.addCourseToCustomCategoryStore = new AddCourseToCustomCategoryStore(
            props.organizationId,
            props.courseId,
            props.courseCustomCategories,
        );
    }

    renderBody() {
        const {gettext} = this.props;
        if (this.addCourseToCustomCategoryStore.isLoading) {
            return <MainContentLoader size="xlarge" />;
        }

        return (
            <CheckboxGroup
                label={gettext('Which categories would you like this course to be added to?')}
            >
                {this.addCourseToCustomCategoryStore.categories.map((item) => (
                    <Checkbox
                        data-purpose={`item-checkbox-${item.id}`}
                        defaultChecked={item.isSelected || false}
                        key={item.id}
                        name={item.id}
                        onChange={this.addCourseToCustomCategoryStore.toggleCategory}
                    >
                        {item.title}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        );
    }

    fetchCategoryData = () => {
        if (this.props.preLoadCourseCustomCategories) {
            return this.addCourseToCustomCategoryStore.fetchCategoryData();
        }
        return this.addCourseToCustomCategoryStore.fetchCustomCategories();
    };

    addCourse = async (e) => {
        e.preventDefault();
        const successMessage = await this.addCourseToCustomCategoryStore.addCourse();
        if (successMessage) {
            this.exitHandler();
            this.props.onCourseAdded(successMessage);
        }
    };

    renderErrorMessage = () => {
        if (!this.addCourseToCustomCategoryStore.errorMessage) {
            return null;
        }

        return (
            <div className={styles.error}>
                <AlertBanner
                    udStyle="error"
                    title={this.addCourseToCustomCategoryStore.errorMessage}
                />
            </div>
        );
    };

    exitHandler = () => {
        this.addCourseToCustomCategoryStore.resetModal();
        this.props.onClose();
    };

    render() {
        const {courseId, isOpen, gettext} = this.props;
        const submitTitle = gettext('Save');

        return (
            <Modal
                isOpen={isOpen}
                onClose={this.exitHandler}
                onOpen={this.fetchCategoryData}
                title={gettext('Edit custom categories')}
            >
                <form onSubmit={this.addCourse}>
                    <CourseRetirementModalAlert
                        courseId={courseId}
                        modalType={RETIREMENT_ALERT_MODAL_TYPES.ADD_TO_CUSTOM_CATEGORY}
                        isSubmitting={this.addCourseToCustomCategoryStore.isSubmitting}
                    />
                    {this.renderErrorMessage()}
                    {this.renderBody()}
                    <FooterButtons>
                        <Button udStyle="ghost" onClick={this.exitHandler}>
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            data-purpose="add_to_category"
                            type="submit"
                            disabled={this.addCourseToCustomCategoryStore.isSubmitting}
                        >
                            {this.addCourseToCustomCategoryStore.isSubmitting
                                ? `${submitTitle}...`
                                : submitTitle}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}
const AddCourseToCustomCategoryModal = withI18n(InternalAddCourseToCustomCategoryModal);

export default AddCourseToCustomCategoryModal;
