import CollapseIcon from '@udemy/icons/dist/collapse.ud-icon';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {BlockList, Button, IconButton} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import getConfigData from 'utils/get-config-data';

import CoursePreviewModal from '../course-preview/course-preview-modal.react-component';
import curriculumItemIcon from './curriculum-item-icon';
import styles from './section.less';

export class PracticeTestSection extends React.Component {
    static propTypes = {
        arrayIndex: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        items: PropTypes.array.isRequired,
    };

    render() {
        const {arrayIndex, title, items} = this.props;
        return (
            <Accordion.Panel
                title={<span styleName="section-title">{title}</span>}
                defaultExpanded={arrayIndex === 0}
                styleName="panel"
            >
                <BlockList iconAlignment="left" size="small">
                    {items.map((test) => {
                        const PracticeTestIcon = curriculumItemIcon(test.icon_class);
                        return (
                            <BlockList.Item key={test.id} icon={<PracticeTestIcon label={false} />}>
                                <span styleName="item-title" data-purpose="practice-test-title">
                                    {test.title}
                                </span>
                                <span styleName="hidden-on-mobile" style={{flex: 1}} />
                                <span
                                    styleName="hidden-on-mobile item-content-summary"
                                    data-purpose="practice-test-content"
                                >
                                    {test.content_summary}
                                </span>
                            </BlockList.Item>
                        );
                    })}
                </BlockList>
            </Accordion.Panel>
        );
    }
}

@observer
export class Section extends React.Component {
    static propTypes = {
        arrayIndex: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        numLectures: PropTypes.number.isRequired,
        contentLength: PropTypes.number.isRequired,
        items: PropTypes.array.isRequired,
        areAllSectionsExpanded: PropTypes.bool.isRequired,
        showSectionContentsText: PropTypes.bool,
    };

    static defaultProps = {
        showSectionContentsText: true,
    };

    constructor(props) {
        super(props);
        this.expanded = this.props.areAllSectionsExpanded || this.props.arrayIndex === 0;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.areAllSectionsExpanded !== this.props.areAllSectionsExpanded) {
            this.onToggle(this.props.areAllSectionsExpanded);
        }
    }

    @observable expanded = false;

    @autobind @action onToggle(expanded) {
        this.expanded = expanded;
    }

    constructPanelDisplay() {
        const {title, numLectures, showSectionContentsText} = this.props;
        const lectureInfo = ninterpolate(
            '%(numLectures)s lecture',
            '%(numLectures)s lectures',
            numLectures,
            {numLectures},
            true,
        );
        return (
            <>
                <span styleName="section-title">{title}</span>
                {showSectionContentsText && (
                    <span
                        className="ud-text-sm"
                        styleName="hidden-on-mobile section-content"
                        data-purpose="section-content"
                    >
                        {lectureInfo}
                        {' • '}
                        {this.getLengthDisplay()}
                    </span>
                )}
            </>
        );
    }

    renderTitle({children, className, ...props}) {
        return (
            <h3 {...props} className={classNames(className, styles['section-title-container'])}>
                {children}
            </h3>
        );
    }

    getLengthDisplay() {
        const {contentLength} = this.props;
        return <Duration numSeconds={contentLength} presentationStyle={Duration.STYLE.HUMAN} />;
    }

    render() {
        const {items, showSectionContentsText} = this.props;
        return (
            <Accordion.Panel
                renderTitle={this.renderTitle}
                title={this.constructPanelDisplay()}
                expanded={this.expanded}
                onToggle={this.onToggle}
                styleName="panel"
            >
                <BlockList iconAlignment="left" size="small">
                    {items.map((item, index) => (
                        <Lecture
                            key={index}
                            lecture={item}
                            showSectionContentsText={showSectionContentsText}
                        />
                    ))}
                </BlockList>
            </Accordion.Panel>
        );
    }
}

@observer
export class Lecture extends React.Component {
    static propTypes = {
        lecture: PropTypes.object,
        showSectionContentsText: PropTypes.bool,
    };

    static defaultProps = {
        lecture: {},
        showSectionContentsText: true,
    };

    @observable showModal = false;
    @observable showDescription = false;

    getPreviewLinkWithUpdatedSearchParams() {
        const {lecture} = this.props;
        if (!lecture.can_be_previewed || lecture.is_coding_exercise) {
            return '';
        }

        const previewLinkParts = lecture.preview_url.split('?');
        const previewLinkSearchParams = new URLSearchParams(previewLinkParts[1]);
        previewLinkSearchParams.set('source', 'course_landing_page');
        return `${previewLinkParts[0]}?${previewLinkSearchParams.toString()}`;
    }

    @autobind @action onClickPreview() {
        this.showModal = true;
    }

    @autobind @action onClose() {
        this.showModal = false;
    }

    @autobind @action toggleDescription(event) {
        this.showDescription = !this.showDescription;
        event.stopPropagation(); // Do not trigger `this.onClickPreview`.
    }

    render() {
        const udConfig = getConfigData();
        const {lecture, showSectionContentsText} = this.props;
        const LectureIcon = curriculumItemIcon(lecture.icon_class);

        let previewLink = this.getPreviewLinkWithUpdatedSearchParams();
        const blockListItemProps = {};
        let LectureTitle = 'span';
        const lectureTitleProps = {};
        const hasLectureLandingLink = !udConfig.brand.has_organization && lecture.landing_page_url;
        const ToggleDescriptionIcon = this.showDescription ? CollapseIcon : ExpandIcon;
        let coursePreviewModal = null;

        if (hasLectureLandingLink) {
            previewLink = lecture.landing_page_url;
            blockListItemProps.href = previewLink;
        } else if (previewLink) {
            Object.assign(blockListItemProps, {
                color: 'link',
                onClick: this.onClickPreview,
            });
            LectureTitle = Button;
            Object.assign(lectureTitleProps, {udStyle: 'link', typography: 'ud-text-sm'});

            const isLecturePopup = previewLink.includes(`/new-lecture/${lecture.id}/popup/`);
            coursePreviewModal = (
                <CoursePreviewModal
                    isOpen={this.showModal}
                    onClose={this.onClose}
                    url={previewLink}
                    isLecturePopup={isLecturePopup}
                />
            );
        }

        return (
            <>
                <BlockList.Item
                    icon={<LectureIcon label={false} />}
                    {...blockListItemProps}
                    styleName={previewLink ? 'previewable-item' : ''}
                >
                    <div>
                        <div styleName="row">
                            <LectureTitle {...lectureTitleProps} styleName="item-title">
                                {lecture.title}
                            </LectureTitle>
                            {lecture.description && (
                                <IconButton
                                    onClick={this.toggleDescription}
                                    round={true}
                                    size="small"
                                    styleName="hidden-on-mobile toggle-item-description-button"
                                    udStyle="ghost"
                                    aria-expanded={this.showDescription}
                                >
                                    <ToggleDescriptionIcon
                                        color="neutral"
                                        label={
                                            this.showDescription
                                                ? gettext('Hide lecture description')
                                                : gettext('Show lecture description')
                                        }
                                    />
                                </IconButton>
                            )}
                        </div>
                        {this.showDescription && (
                            <div
                                styleName="hidden-on-mobile item-description"
                                className="ud-text-sm"
                                {...safelySetInnerHTML({
                                    descriptionOfCaller: 'section:lecture-description',
                                    html: lecture.description,
                                })}
                            />
                        )}
                    </div>
                    <span styleName="hidden-on-mobile" style={{flex: 1}} />
                    {previewLink && showSectionContentsText && (
                        <span styleName="hidden-on-mobile preview-text">{gettext('Preview')}</span>
                    )}
                    <span styleName="hidden-on-mobile item-content-summary">
                        {lecture.content_summary}
                    </span>
                </BlockList.Item>
                {coursePreviewModal}
            </>
        );
    }
}
