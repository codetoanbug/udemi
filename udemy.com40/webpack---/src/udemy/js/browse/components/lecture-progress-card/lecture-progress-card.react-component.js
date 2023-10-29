import {Tracker} from '@udemy/event-tracking';
import {withI18n, omitI18nProps, LocalizedHtml} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Badge, Meter} from '@udemy/react-messaging-components';
import {ItemCard, PlayOverlay} from '@udemy/react-structure-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {ASSET_TYPE} from 'asset/constants';
import DueDate from 'browse/components/course-progress-card/due-date.react-component';
import {SaveToListButtonStore} from 'browse/components/save-to-list/save-to-list-button.mobx-store';
import {ITEM_TYPES} from 'course-taking/curriculum/constants';

import {LECTURE_IMAGE_STYLE} from './constants';
import {buildEventData, LearningProgressCardClickEvent} from './events';
import {Article, CodingExercise, Lecture, Practice, Quiz} from './lecture-item.mobx-model';
import styles from './lecture-progress-card.less';

@inject(({resourceContextMenu} = {}) => ({
    resourceContextMenu,
}))
@observer
class LectureProgressCard extends React.Component {
    static propTypes = {
        course: PropTypes.shape({
            id: PropTypes.number.isRequired,
            image_240x135: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            completion_ratio: PropTypes.number,
            remaining_time: PropTypes.number,
        }).isRequired,
        size: PropTypes.oneOf(['small', 'large']),
        className: PropTypes.string,
        resourceContextMenu: PropTypes.object,
        uiRegion: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        size: 'small',
        className: null,
        resourceContextMenu: {},
    };

    withSizeClassNames(className) {
        const {size} = this.props;
        return classNames(styles[className], {[styles[`${className}-large`]]: size === 'large'});
    }

    get curriculumItem() {
        const {course, gettext, udData} = this.props;
        const {Config} = udData;
        const lastSeenItem = toJS(course.next_to_watch_item);
        const curriculumItemData = course.next_to_watch_item;
        let curriculumItem;
        if (Object.keys(lastSeenItem).length === 0) {
            curriculumItem = {...course};
            curriculumItem.completionRatio = course.completion_ratio;
            curriculumItem.contentType = gettext('Course');
            curriculumItem.lectureImage = course.image240x135;
            curriculumItem.durationContent = (
                <Duration
                    numSeconds={course.remaining_time}
                    presentationStyle={Duration.STYLE.HUMAN_COMPACT}
                />
            );
            curriculumItem.imageStyle = LECTURE_IMAGE_STYLE.LECTURE;
        } else {
            switch (curriculumItemData._class) {
                case ITEM_TYPES.QUIZ:
                    curriculumItem = new Quiz(curriculumItemData, this.courseId, {Config});

                    if (curriculumItem.quizType === 'coding-exercise') {
                        curriculumItem = new CodingExercise(curriculumItemData, this.courseId, {
                            Config,
                        });
                    }
                    break;

                case ITEM_TYPES.PRACTICE:
                    curriculumItem = new Practice(curriculumItemData, this.courseId, {Config});
                    break;

                default:
                    curriculumItem = new Lecture(curriculumItemData, this.courseId, {Config});
                    curriculumItem = this.isVideo(curriculumItem)
                        ? new Lecture(curriculumItemData, this.courseId, {Config})
                        : new Article(curriculumItemData, this.courseId, {Config});
            }
        }
        return curriculumItem;
    }

    isVideo(curriculumItem) {
        return (
            curriculumItem.type === 'lecture' &&
            [ASSET_TYPE.VIDEO, ASSET_TYPE.VIDEO_MASHUP].includes(curriculumItem.asset.type)
        );
    }

    renderImage(curriculumItem) {
        const Icon = curriculumItem.icon;
        const shouldRenderImage = this.isVideo(curriculumItem) || !Icon;
        const image = shouldRenderImage ? (
            <>
                <Image
                    src={curriculumItem.lectureImage}
                    className={styles[curriculumItem.imageStyle]}
                    alt=""
                    width={240}
                    height={135}
                />
                <div className={styles['opacity-overlay']} />
                <PlayOverlay />
            </>
        ) : (
            <div className={styles[curriculumItem.imageStyle]}>
                <Icon color="inherit" label={false} size="xxlarge" />
            </div>
        );

        return <div className={this.withSizeClassNames('lecture-image-wrapper')}>{image}</div>;
    }

    renderProgressText(curriculumItem, size) {
        if (size === 'small') {
            return null;
        }
        const {gettext} = this.props;
        const duration =
            curriculumItem.completionRatio > 0 ? (
                <LocalizedHtml
                    html={gettext('<span class="duration">%(duration)s</span> left')}
                    interpolate={{
                        duration: curriculumItem.durationContent,
                    }}
                />
            ) : (
                curriculumItem.durationContent
            );

        return (
            <span className={styles['progress-text']} data-purpose="progress-text">
                <span className="ud-heading-xs">{curriculumItem.contentType}</span>
                {' • '}
                <span className="ud-text-xs">{duration}</span>
            </span>
        );
    }

    renderAssignmentInfo(course, size) {
        if (!course.is_assigned) {
            return null;
        }

        const {gettext} = this.props;
        return (
            <div className={styles['assignment-info']}>
                <Badge data-purpose="assignment-badge" className={styles['assignment-badge']}>
                    {gettext('Assigned')}
                </Badge>
                {course.assignment_due_date && size === 'large' && (
                    <DueDate dueDate={course.assignment_due_date} />
                )}
            </div>
        );
    }

    get contextMenu() {
        const {resourceContextMenu, course, gettext, interpolate} = this.props;
        if (!resourceContextMenu) {
            return null;
        }
        if (resourceContextMenu.getCourseProgressCardContextMenu) {
            return resourceContextMenu.getCourseProgressCardContextMenu({
                ...course,
                isPublished: true,
            });
        }

        if (resourceContextMenu.getSaveToListContextMenu) {
            return resourceContextMenu.getSaveToListContextMenu(
                new SaveToListButtonStore(course, 'jump_back_in_unit', {gettext, interpolate}),
            );
        }
    }

    trackClick = () => {
        const {course, uiRegion} = this.props;
        Tracker.publishEvent(new LearningProgressCardClickEvent(buildEventData(course, uiRegion)));
    };

    render() {
        const {gettext} = this.props;
        const propsWithoutI18nProps = omitI18nProps(this.props);
        const {
            className,
            resourceContextMenu,
            course,
            size,
            uiRegion,
            udData,
            ...anchorProps
        } = propsWithoutI18nProps;
        const curriculumItem = this.curriculumItem;
        const cardTitle = curriculumItem.objectIndex
            ? `${curriculumItem.objectIndex}. ${curriculumItem.title}`
            : `${curriculumItem.title}`;

        const card = (
            <ItemCard
                className={classNames(className, this.withSizeClassNames('lecture-progress-card'))}
            >
                {this.renderImage(curriculumItem)}
                <div className={styles['lecture-info']}>
                    <div>
                        <div
                            className={classNames('ud-heading-xs', styles['course-title'], {
                                [styles['lecture-title-with-more-button']]: !!this.contextMenu,
                            })}
                        >
                            {course.title}
                        </div>
                        <ItemCard.Title
                            className={classNames(
                                size === 'large' ? 'ud-heading-md' : 'ud-heading-sm',
                                styles['lecture-title'],
                                {
                                    [styles['lecture-title-condensed']]:
                                        size === 'small' && curriculumItem.completionRatio === 0,
                                    [styles['lecture-title-large']]: size === 'large',
                                    [styles['lecture-title-with-more-button']]: !!this.contextMenu,
                                },
                            )}
                            data-purpose="lecture-title"
                            href={curriculumItem.url}
                            onClick={this.trackClick}
                            {...anchorProps}
                        >
                            {cardTitle}
                        </ItemCard.Title>
                        {this.renderAssignmentInfo(course, size)}
                    </div>
                    <div>
                        {this.renderProgressText(curriculumItem, size)}
                        {curriculumItem.completionRatio > 0 && (
                            <Meter
                                value={curriculumItem.completionRatio}
                                min={0}
                                max={100}
                                label={gettext('%(percent)s% complete')}
                                className={styles['lecture-progress']}
                            />
                        )}
                    </div>
                </div>
            </ItemCard>
        );

        if (this.contextMenu) {
            return (
                <div style={{position: 'relative'}}>
                    {card}
                    <div className={styles['more-menu-button']}>{this.contextMenu}</div>
                </div>
            );
        }

        return card;
    }
}

export default withI18n(withUDData(LectureProgressCard));
