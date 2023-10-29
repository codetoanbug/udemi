import {LocalizedHtml} from '@udemy/i18n';
import ClipboardTickIcon from '@udemy/icons/dist/clipboard-tick.ud-icon';
import FormatListBulletIcon from '@udemy/icons/dist/format-list-bullet.ud-icon';
import LabsIcon from '@udemy/icons/dist/labs.ud-icon';
import PeopleIcon from '@udemy/icons/dist/people.ud-icon';
import PersonIcon from '@udemy/icons/dist/person.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Meter} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {Panel} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import udIntercom from 'utils/ud-intercom';
import udMe from 'utils/ud-me';

import EditableText from '../editable-text.react-component';
import {LearningPathStoreProps} from '../types';
import {
    LEARNING_PATH_DESCRIPTION_PLACEHOLDER,
    LEARNING_PATH_TITLE_MAXLENGH,
    LEARNING_PATH_TITLE_PLACEHOLDER,
    TIPS_INTERCOM_TOUR_ID,
} from './constants';
import Actions from './info-panel/actions.react-component';
import DiscoverabilityToggle from './info-panel/discoverability-toggle.react-component';
import styles from './learning-path-header-v2.less';
import pageEventTracker from './page-event-tracker';

export interface LearningPathHeaderV2Props {
    learningPathStore: LearningPathStoreProps;
    isCreatingPath: boolean;
    isSmMax: boolean | null;
}
@withMatchMedia({isSmMax: 'sm-max'})
@inject('learningPathStore', 'resourceContextMenu')
@observer
export class LearningPathHeaderV2 extends Component<LearningPathHeaderV2Props> {
    static defaultProps = {
        isCreatingPath: false,
        isSmMax: null,
    };

    componentDidMount() {
        const {learningPathStore, isCreatingPath} = this.props;

        if (isCreatingPath && learningPathStore.isEditModeEnabled) {
            // focus on title after creation
            this._autoFocusInput(this.titleInputRef);
        }
    }

    private titleInputRef = React.createRef<HTMLDivElement>();

    @autobind
    handleTipsIconClick() {
        pageEventTracker.tipsIconClicked();

        // Tour is created on the Intercom platform here https://app.intercom.io/a/apps/sehj53dd/tours/881984
        return udIntercom.get({root: window}).then((intercom) => {
            intercom('startTour', TIPS_INTERCOM_TOUR_ID);
        });
    }

    _autoFocusInput(inputRef: React.RefObject<HTMLDivElement>) {
        inputRef?.current?.focus();
    }

    @autobind
    setTitleInputRef(ref: React.RefObject<HTMLDivElement>) {
        this.titleInputRef = ref;
    }

    pathPreEnrollmentDetails() {
        const {
            totalDuration,
            itemsCount,
            isCurriculumLoading,
            labsCount,
            assessmentsCount,
            addEnrollmentToPath,
        } = this.props.learningPathStore.learningPath;

        return (
            <div className={styles['pre-enrollment']} data-purpose="pre-enrollment">
                <Panel className={styles['path-details-panel']} padding="medium">
                    <>
                        <div>
                            <h2 className="ud-heading-md">{gettext('This Udemy path includes')}</h2>
                        </div>
                        {isCurriculumLoading ? (
                            <MainContentLoader size="medium" />
                        ) : (
                            <div className={styles['path-item-details']}>
                                <div className={styles['item-counts-detail']}>
                                    <p>
                                        <FormatListBulletIcon
                                            label="path items count"
                                            size="xsmall"
                                        />
                                        {ninterpolate('%s Item', '%s Items', itemsCount)}
                                    </p>
                                    <p>
                                        <VideoIcon label="video time" size="xsmall" />
                                        <LocalizedHtml
                                            html={interpolate(
                                                gettext(
                                                    '<span class="duration">%{duration}s</span> of on-demand video',
                                                ),
                                                true,
                                            )}
                                            interpolate={{
                                                duration: (
                                                    <Duration
                                                        presentationStyle={
                                                            Duration.STYLE.HUMAN_COMPACT
                                                        }
                                                        numSeconds={totalDuration * 60}
                                                    />
                                                ),
                                            }}
                                        />
                                    </p>
                                    {labsCount ? (
                                        <p>
                                            <LabsIcon label="path lab count" size="xsmall" />
                                            <>{ninterpolate('%s Lab', '%s Labs', labsCount)}</>
                                        </p>
                                    ) : null}
                                    {assessmentsCount ? (
                                        <p>
                                            <ClipboardTickIcon
                                                label="path assessment count"
                                                size="xsmall"
                                            />
                                            {ninterpolate(
                                                '%s Assessment',
                                                '%s Assessments',
                                                assessmentsCount,
                                            )}
                                        </p>
                                    ) : null}
                                </div>
                                <Button
                                    componentClass="a"
                                    data-purpose="view-course"
                                    onClick={() =>
                                        addEnrollmentToPath({uiRegion: 'path_enroll_button'})
                                    }
                                    udStyle="brand"
                                >
                                    {gettext('Enroll now')}
                                </Button>
                            </div>
                        )}
                    </>
                </Panel>
            </div>
        );
    }

    renderStatusIcon() {
        const {isPublic} = this.props.learningPathStore.learningPath;

        return (
            <div className={styles['people-icon']}>
                {isPublic ? (
                    <>
                        <span>
                            <PeopleIcon label="people icon" />
                        </span>
                        {gettext('Public')}
                    </>
                ) : (
                    <>
                        <span>
                            <PersonIcon label="person icon" />
                        </span>
                        {gettext('Private')}
                    </>
                )}
            </div>
        );
    }

    renderCreatorSection() {
        const {isProPath, owner} = this.props.learningPathStore.learningPath;
        return (
            <span data-purpose="creator-section">
                {isProPath ? (
                    <div className={styles['curated-by']}>
                        <LocalizedHtml
                            html={gettext(
                                'Curated by <span class="bold">Udemy Business Pro</span> <span class="proBadge" /> ',
                            )}
                            interpolate={{
                                bold: <span className="ud-text-bold ud-link-underline" />,
                                proBadge: <ProBadge className={styles['pro-badge']} />,
                            }}
                        />
                        {this.renderStatusIcon()}
                    </div>
                ) : (
                    <div className={styles['curated-by']}>
                        {interpolate(
                            gettext('Curated by %(owner)s'),
                            {owner: owner.display_name},
                            true,
                        )}
                        {this.renderStatusIcon()}
                    </div>
                )}
            </span>
        );
    }

    renderCreatorEditSection() {
        const displayName = udMe.display_name;
        return (
            <div className={styles['editor-section']} data-purpose="creator-editor-section">
                <LocalizedHtml
                    html={interpolate(
                        gettext('Editor:&nbsp;<span class="editor">%(displayName)s</span> '),
                        {displayName},
                        true,
                    )}
                    interpolate={{
                        editor: (
                            <span className={classNames(styles['editor-name'], 'ud-text-bold')} />
                        ),
                    }}
                />
                <span className={styles['privacy-dropdown']}>
                    <DiscoverabilityToggle learningPathStore={this.props.learningPathStore} />
                </span>
            </div>
        );
    }

    renderEnrollButton() {
        const {addEnrollmentToPath} = this.props.learningPathStore.learningPath;
        return (
            <div className={styles['enrollment-button-container']}>
                <Button
                    componentClass="a"
                    data-purpose="medium-view-course"
                    onClick={() => addEnrollmentToPath({uiRegion: 'path_enroll_button'})}
                    udStyle="brand"
                    className={styles['enrollment-button']}
                >
                    {gettext('Enroll now')}
                </Button>
            </div>
        );
    }

    renderStickySection() {
        if (!this.props.isSmMax) {
            return null;
        }

        return (
            <div className={styles['sticky-section-container']} data-purpose="sticky-section">
                <Actions learningPathStore={this.props.learningPathStore} />
            </div>
        );
    }

    renderProgress() {
        const {totalSteps, completedSteps} = this.props.learningPathStore.learningPath;
        const learningProgress = parseFloat(
            ((completedSteps / (totalSteps || 1)) * 100).toFixed(2),
        );
        const learningProgressText = interpolate(
            gettext('%(learningProgress)s% complete'),
            {
                learningProgress,
            },
            true,
        );
        const itemsCompletedText = interpolate(
            gettext('%(completedSteps)s/%(totalSteps)s'),
            {
                completedSteps,
                totalSteps,
            },
            true,
        );

        return (
            <div className={styles['progress-actions-container']} data-purpose="progress-container">
                {!this.props.isSmMax && (
                    <div className={styles['actions-container']}>
                        <Actions learningPathStore={this.props.learningPathStore} />
                    </div>
                )}
                <div className={styles['progress-container']}>
                    <p className={classNames(styles['progress-text'], 'ud-heading-md')}>
                        {gettext('Progress')}
                    </p>
                    <Meter
                        value={learningProgress}
                        min={0}
                        max={100}
                        label={'%(percent)s% complete'}
                        className={styles['path-progress-meter']}
                    />
                    <div className={classNames(styles['progress-details'], 'ud-text-xs')}>
                        <p>{learningProgressText}</p>
                        <p>{itemsCompletedText}</p>
                    </div>
                </div>
            </div>
        );
    }

    renderEditorPanel() {
        return (
            <div className={styles['editor-panel-container']} data-purpose="editor-panel">
                <Actions learningPathStore={this.props.learningPathStore} />
            </div>
        );
    }

    renderStudentPanel() {
        const {isUserEnrolled} = this.props.learningPathStore.learningPath;
        return (
            <span className={styles['student-panel']} data-purpose="student-panel">
                {isUserEnrolled ? (
                    this.renderProgress()
                ) : (
                    <>
                        {this.pathPreEnrollmentDetails()}
                        {this.renderEnrollButton()}
                    </>
                )}
            </span>
        );
    }

    renderViewMode() {
        const {title, description, isUserEditor} = this.props.learningPathStore.learningPath;

        return (
            <>
                <div className={styles['path-header']} data-purpose="header-view-mode">
                    <h1 className={classNames(styles.title, 'ud-heading-serif-xxl')}>{title}</h1>
                    {description && (
                        <p className={classNames('ud-text-md', styles.description)}>
                            {description}
                        </p>
                    )}
                    {isUserEditor ? this.renderCreatorEditSection() : this.renderCreatorSection()}
                </div>
                {isUserEditor ? this.renderEditorPanel() : this.renderStudentPanel()}
            </>
        );
    }

    renderEditMode() {
        const {learningPath} = this.props.learningPathStore;

        return (
            <div className={styles['header-edit-view']} data-purpose="header-edit-mode">
                <div className={styles['header-edit-fields']}>
                    <EditableText
                        id={`learning-path-title-${learningPath.id}`}
                        inputRef={this.setTitleInputRef}
                        value={learningPath.title}
                        elementType="h1"
                        placeholder={LEARNING_PATH_TITLE_PLACEHOLDER.TEXT}
                        onChange={learningPath.setTitle}
                        className={classNames(styles.title, 'ud-heading-serif-xxl')}
                        shouldSavePlaceholderAsValue={true}
                        maxLength={LEARNING_PATH_TITLE_MAXLENGH}
                        htmlAttributes={{'aria-label': LEARNING_PATH_TITLE_PLACEHOLDER.ARIA_LABEL}}
                    />
                    <EditableText
                        id={`learning-path-description-${learningPath.id}`}
                        value={learningPath.description}
                        elementType="p"
                        placeholder={LEARNING_PATH_DESCRIPTION_PLACEHOLDER.TEXT}
                        onChange={learningPath.setDescription}
                        className={classNames(styles.description, 'ud-text-md')}
                        htmlAttributes={{
                            'aria-label': LEARNING_PATH_DESCRIPTION_PLACEHOLDER.ARIA_LABEL,
                        }}
                    />
                    {this.renderCreatorEditSection()}
                </div>
                <div className={styles['header-edit-actions']}>{this.renderEditorPanel()}</div>
            </div>
        );
    }

    render() {
        const {isUserEnrolled, isUserEditor} = this.props.learningPathStore.learningPath;
        const {isEditModeEnabled} = this.props.learningPathStore;
        return (
            <div
                className={classNames(styles['heading-container'], {
                    [styles['heading-container-edit']]: isEditModeEnabled,
                })}
            >
                <div className={styles.banner}>
                    {this.props.learningPathStore.isEditModeEnabled
                        ? this.renderEditMode()
                        : this.renderViewMode()}
                    {(isUserEnrolled || isUserEditor) && this.renderStickySection()}
                </div>
            </div>
        );
    }
}
