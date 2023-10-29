import {LocalizedHtml} from '@udemy/i18n';
import {TextInputWithCounter, FormGroup, Select} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ImageUploadPreviewWithCrop from 'base-components/ungraduated/form/image-upload-preview-with-crop/image-upload-preview-with-crop.react-component';
import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import Loader from 'course-manage-v2/loader.react-component';
import Prompt from 'course-manage-v2/prompt.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {
    allowedImageExtensionsList,
    allowedVideoExtensionsList,
} from 'utils/s3-upload-configuration';
import udLink from 'utils/ud-link';

import CourseBasicsStore from './course-basics.mobx-store';
import InstructorsList from './instructors-list.react-component';
import LabelManager from './label-manager.react-component';
import VideoUploadWithPreview from './video-upload-with-preview.react-component';

import './course-basics-form.less';

@inject('store')
@observer
export default class CourseBasicsForm extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    getValidationProps(errorList) {
        if (errorList && errorList.length) {
            const note = (
                <div
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'course-basics-form:error',
                        domPurifyConfig: {ADD_ATTR: ['target']},
                        html: errorList.join('<br />'),
                    })}
                />
            );
            return {validationState: 'error', note};
        }
        return {};
    }

    @autobind
    onTitleChange(event) {
        this.props.store.setTitle(event.target.value);
    }

    @autobind
    onHeadlineChange(event) {
        this.props.store.setHeadline(event.target.value);
    }

    @autobind
    onDescriptionChange(description) {
        this.props.store.setDescription(description);
    }

    @autobind
    onLocaleChange(event) {
        const {store} = this.props;
        const value = event.target.value;
        this.setValueFromKey(store.setLocale, store.localeList, 'locale', value);
    }

    @autobind
    onInstructionalLevelChange(event) {
        const {store} = this.props;
        const value = event.target.value && parseInt(event.target.value, 10);
        this.setValueFromKey(
            store.setInstructionalLevel,
            CourseBasicsStore.instructionalLevelList,
            'id',
            value,
        );
    }

    @autobind
    onCategoryChange(event) {
        const {store} = this.props;
        const value = event.target.value && parseInt(event.target.value, 10);
        this.setValueFromKey(store.setCategory, store.categoryList, 'id', value);
    }

    @autobind
    onSubcategoryChange(event) {
        const {store} = this.props;
        const value = event.target.value && parseInt(event.target.value, 10);
        this.setValueFromKey(store.setSubcategory, store.subcategoryList, 'id', value);
    }

    setValueFromKey(fn, options, key, value) {
        if (value === null) {
            return;
        }
        const item = options.find((item) => {
            return item[key] === value;
        });
        if (item) {
            fn(item[key]);
        }
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.store.saveForm();
    }

    render() {
        const {store} = this.props;
        if (!store.courseLoaded) {
            return <Loader />;
        }
        const isDirty = store.dirty;
        const errorStatus = store.errors || {};
        const courseImageTip = (
            <p className="ud-text-with-links" styleName="tip">
                <LocalizedHtml
                    html={gettext(
                        'Upload your course image here. It must meet our ' +
                            '<a class="courseImageLink">course image quality standards</a> ' +
                            'to be accepted. Important guidelines: 750x422 pixels; ' +
                            '.jpg, .jpeg,. gif, or .png. no text on the image.',
                    )}
                    interpolate={{
                        courseImageLink: (
                            <a
                                href={udLink.toSupportLink('course_image_quality')}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            </p>
        );

        const promoAssetTip = (
            <p
                className="ud-text-with-links"
                styleName="tip"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'course-basics-form:promo-video-content-link',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                    html: interpolate(
                        gettext(
                            'Your promo video is a quick and compelling way for students ' +
                                'to preview what they’ll learn in your course.' +
                                ' Students considering your course are more likely to enroll if your promo video is well-made. ' +
                                '<a class="ext" target="_blank" rel="noopener noreferrer" href="%(url)s">' +
                                'Learn how to make your promo video awesome!</a>',
                        ),
                        {url: udLink.toHardLink('promo_video_content')},
                        true,
                    ),
                })}
            />
        );
        return (
            <form className="full-width-lines" styleName="form" onSubmit={this.onSubmit}>
                <p className="ud-text-with-links" styleName="header-tip">
                    <LocalizedHtml
                        html={gettext(
                            'Your course landing page is crucial to your success on Udemy. ' +
                                'If it’s done right, it can also help you gain visibility in search engines like Google. ' +
                                'As you complete this section, think about creating a compelling Course Landing Page ' +
                                'that demonstrates why someone would want to enroll in your course. ' +
                                'Learn more about <a class="creating">creating your course landing page</a> and ' +
                                '<a class="title">course title standards.</a>',
                        )}
                        interpolate={{
                            creating: (
                                <a
                                    href="/udemy-teach-hub/create_your_course_landing_page/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                            title: (
                                <a
                                    href={udLink.toSupportLink('course_title_quality_standards')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    />
                </p>{' '}
                <FormGroup
                    label={gettext('Course title')}
                    labelProps={{typography: 'ud-heading-md'}}
                    note={gettext(
                        'Your title should be a mix of attention-grabbing, informative, and optimized for search',
                    )}
                    {...this.getValidationProps(errorStatus.title)}
                >
                    <TextInputWithCounter
                        placeholder={gettext('Insert your course title.')}
                        name="title"
                        value={store.title}
                        onChange={this.onTitleChange}
                        data-purpose="edit-course-title"
                        maxLength={60}
                        perfMetricName="CourseManage.basics-title-input-rendered"
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Course subtitle')}
                    labelProps={{typography: 'ud-heading-md'}}
                    note={gettext(
                        "Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course.",
                    )}
                    {...this.getValidationProps(errorStatus.headline)}
                >
                    <TextInputWithCounter
                        placeholder={gettext('Insert your course subtitle.')}
                        name="headline"
                        value={store.headline}
                        onChange={this.onHeadlineChange}
                        data-purpose="course-headline"
                        maxLength={120}
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Course description')}
                    labelProps={{typography: 'ud-heading-md'}}
                    note={gettext('Description should have minimum 200 words.')}
                    {...this.getValidationProps(errorStatus.description)}
                >
                    <RichTextEditor
                        placeholder={gettext('Insert your course description.')}
                        name="description"
                        value={store.description}
                        onValueChange={this.onDescriptionChange}
                        data-purpose="course-description"
                        theme={RichTextEditor.THEMES.COURSE_DESCRIPTION}
                    />
                </FormGroup>
                <FormGroup
                    udStyle="fieldset"
                    label={gettext('Basic info')}
                    labelProps={{typography: 'ud-heading-md'}}
                >
                    <div styleName="inline-fields">
                        <FormGroup
                            label={gettext('Course locale')}
                            labelProps={{className: 'ud-sr-only'}}
                            {...this.getValidationProps(errorStatus.locale)}
                        >
                            <Select
                                title={gettext('Locale')}
                                name="locale"
                                value={store.locale}
                                onChange={this.onLocaleChange}
                            >
                                {store.localeList.map((item) => (
                                    <option key={item.locale} value={item.locale}>
                                        {item.title}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>
                        <FormGroup
                            label={gettext('Course instructional level')}
                            labelProps={{className: 'ud-sr-only'}}
                            {...this.getValidationProps(errorStatus.instructional_level_id)}
                        >
                            <Select
                                title={gettext('Instructional level')}
                                name="instructional_level"
                                value={store.instructionalLevel}
                                onChange={this.onInstructionalLevelChange}
                            >
                                {CourseBasicsStore.instructionalLevelList.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>
                        {store.categoryApplicable && (
                            <div styleName="category-fields">
                                <FormGroup
                                    label={gettext('Course category')}
                                    labelProps={{className: 'ud-sr-only'}}
                                    {...this.getValidationProps(errorStatus.category_id)}
                                >
                                    <Select
                                        title={gettext('Category')}
                                        name="category"
                                        value={store.category}
                                        onChange={this.onCategoryChange}
                                        disabled={!!store.categoryLocked}
                                    >
                                        {store.categoryList.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <FormGroup
                                    label={gettext('Course subcategory')}
                                    labelProps={{className: 'ud-sr-only'}}
                                    styleName={store.anySubcategoryAvailable ? '' : 'hidden'}
                                    {...this.getValidationProps(errorStatus.subcategory_id)}
                                >
                                    <Select
                                        title={gettext('Subcategory')}
                                        name="subcategory"
                                        value={store.subcategory}
                                        onChange={this.onSubcategoryChange}
                                        disabled={!!store.categoryLocked}
                                    >
                                        {store.subcategoryList.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </Select>
                                </FormGroup>
                            </div>
                        )}
                    </div>
                </FormGroup>
                {store.labelApplicable && store.labelManagerStore && (
                    <LabelManager
                        store={store.labelManagerStore}
                        validationProps={this.getValidationProps(errorStatus.labels)}
                    />
                )}
                <FormGroup
                    label={gettext('Course image')}
                    labelProps={{typography: 'ud-heading-md'}}
                    {...this.getValidationProps(errorStatus.image_file)}
                >
                    <ImageUploadPreviewWithCrop
                        imageUrl={store.courseImage}
                        adjacentTips={courseImageTip}
                        minHeight={422}
                        minWidth={750}
                        aspect={16 / 9}
                        allowedExtensions={allowedImageExtensionsList}
                        onUploadCompleted={store.setUploadedImageKey}
                        onCrop={store.setCourseImage}
                        styleName="image-upload"
                    />
                </FormGroup>
                <FormGroup
                    label={gettext('Promotional video')}
                    labelProps={{typography: 'ud-heading-md'}}
                    {...this.getValidationProps(errorStatus.promoAsset)}
                >
                    <VideoUploadWithPreview
                        allowedVideoExtensions={allowedVideoExtensionsList}
                        store={store}
                        tips={promoAssetTip}
                    />
                </FormGroup>
                {store.instructorBios.length > 0 && !store.organizationId && (
                    <FormGroup
                        label={gettext('Instructor profile(s)')}
                        labelProps={{typography: 'ud-heading-md'}}
                    >
                        <InstructorsList
                            instructorBios={store.instructorBios}
                            minSummaryWords={store.minSummaryWords}
                        />
                    </FormGroup>
                )}
                <Prompt when={isDirty} />
            </form>
        );
    }
}
