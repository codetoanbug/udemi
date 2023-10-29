import {lockPageScroll, unlockPageScroll} from '@udemy/design-system-utils';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import PauseIcon from '@udemy/icons/dist/pause.ud-icon';
import PlayArrowIcon from '@udemy/icons/dist/play-arrow.ud-icon';
import {Image} from '@udemy/react-core-components';
import {Duration, formatDuration} from '@udemy/react-date-time-components';
import {
    CourseCardSkeletonSize,
    Loader,
    CourseCardSkeletonGroup,
    TextSkeleton,
} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import InfiniteScrollContainer from 'browse/components/infinite-scroll-container/infinite-scroll-container.react-component';
import {LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES} from 'browse/components/lecture-quick-view/constants';
import {LectureQuickViewStore} from 'browse/components/lecture-quick-view/lecture-quick-view.mobx-store';
import {LectureViewCourseCard} from 'browse/components/lecture-quick-view/lecture-view-course-card.react-component';
import {Lecture, LecturesInSection} from 'browse/components/lecture-quick-view/types';

import styles from './lecture-list.less';

const THUMBNAIL_WIDTH = 104;
const THUMBNAIL_HEIGHT = 58;

export interface LectureRowSkeletonProps {
    size?: CourseCardSkeletonSize;
    style?: {width: string; maxWidth: string; minWidth: string};
    imageStyle?: {width: string; height: string};
    lineCount?: number;
    cardCountPerRow?: number;
    rowCount?: number;
    withTitle?: boolean;
}

export const LectureRowSkeleton = ({
    size = 'small',
    style = {width: '32.8rem', maxWidth: '32.8rem', minWidth: '32.8rem'},
    imageStyle = {width: '10.4rem', height: '5.8rem'},
    lineCount = 1,
    cardCountPerRow = 1,
    rowCount = 5,
    withTitle = false,
}: LectureRowSkeletonProps) => (
    <div className={styles['lecture-row-skeleton']}>
        <CourseCardSkeletonGroup
            size={size}
            style={style}
            imageStyle={imageStyle}
            lineCount={lineCount}
            cardCountPerRow={cardCountPerRow}
            rowCount={rowCount}
            withTitle={withTitle}
        />
    </div>
);

interface LectureRowProps {
    /**
     * Video lecture to play
     */
    lecture: Lecture;
    /**
     * Is this lecture the one currently being played?
     */
    isCurrentLecture?: boolean;
    /**
     * Called when the component's button is clicked to play or pause a lecture
     */
    playOrPause?(): void;
    /**
     * Store for the lecture quick view, used to get the video player's state
     */
    store: LectureQuickViewStore;
}

@observer
class InternalLectureRow extends Component<LectureRowProps & WithI18nProps> {
    constructor(props: LectureRowProps & WithI18nProps) {
        super(props);
        this.currentLectureRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        // On initial load of lecture rows, the current lecture in the lecture list will scroll into view
        if (this.currentLectureRef) {
            this.currentLectureRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    private readonly currentLectureRef: React.RefObject<HTMLDivElement>;

    totalTime = formatDuration(
        {
            numSeconds: this.props.lecture.asset.time_estimation,
            presentationStyle: Duration.STYLE.TIMESTAMP,
            precision: Duration.PRECISION.MINUTES,
        },
        {gettext: this.props.gettext, interpolate: this.props.interpolate},
    );

    render() {
        const {playOrPause, lecture, isCurrentLecture, store, gettext, ninterpolate} = this.props;
        const duration = {
            minutes: Math.floor(lecture.asset.time_estimation / 60),
            seconds: lecture.asset.time_estimation % 60,
        };
        return (
            <>
                <div id={`lectureButtonDesc${lecture.id}`} className="ud-sr-only">
                    {gettext('Load lecture into player. ')}
                    {ninterpolate(
                        'Duration: %(minutes)s minute ',
                        'Duration: %(minutes)s minutes ',
                        duration.minutes,
                        {
                            minutes: duration.minutes,
                        },
                    )}
                    {ninterpolate(
                        'and %(seconds)s second.',
                        'and %(seconds)s seconds.',
                        duration.seconds,
                        {
                            seconds: duration.seconds,
                        },
                    )}
                </div>
                <button
                    aria-describedby={`lectureButtonDesc${lecture.id}`}
                    className={classNames('ud-custom-focus-visible', styles['lecture-row'], {
                        [styles['current-lecture-row']]: isCurrentLecture,
                    })}
                    onClick={playOrPause}
                >
                    <div className={styles['lecture-thumbnail-wrapper']}>
                        <Image
                            src={lecture.thumbnail_url}
                            alt=""
                            width={THUMBNAIL_WIDTH}
                            height={THUMBNAIL_HEIGHT}
                        />
                        {isCurrentLecture && (
                            <div ref={this.currentLectureRef}>
                                {store.showPlayer && store.isVideoPlaying ? (
                                    <PauseIcon
                                        label={gettext('Pause video')}
                                        size="small"
                                        className={styles['play-button-icon']}
                                    />
                                ) : (
                                    <PlayArrowIcon
                                        label={gettext('Play video')}
                                        size="small"
                                        className={styles['play-button-icon']}
                                    />
                                )}
                            </div>
                        )}
                        <div data-purpose="duration" className={styles.duration}>
                            <span aria-hidden={true}>{this.totalTime}</span>
                        </div>
                    </div>
                    <div
                        data-purpose="lecture-title"
                        className={classNames(
                            'ud-text-sm ud-focus-visible-target',
                            styles['lecture-title'],
                        )}
                    >
                        {lecture.title}
                    </div>
                </button>
            </>
        );
    }
}

export const LectureRow = withI18n(InternalLectureRow);

interface LectureListProps {
    store: LectureQuickViewStore;
    isMdMax?: boolean;
    lockScroll?: boolean;
}

@withMatchMedia({isMdMax: 'md-max'})
@observer
export class InternalLectureList extends Component<LectureListProps & WithI18nProps> {
    static defaultProps = {
        isMdMax: undefined,
        lockScroll: false,
    };

    componentDidUpdate = (previousProps: LectureListProps) => {
        const scrollingDiv = this.scrollingContainerRef.current;

        if (this.props.lockScroll && !previousProps.lockScroll && scrollingDiv) {
            lockPageScroll(scrollingDiv);
        } else if (!this.props.lockScroll && previousProps.lockScroll && scrollingDiv) {
            unlockPageScroll(scrollingDiv);
        }
    };

    scrollingContainerRef = React.createRef<HTMLDivElement>();

    renderTitleSection = () => {
        const {store, gettext, interpolate} = this.props;
        const hasTitle = !!store.section?.title;
        const hasLecturesInSection = !!store.lecturesInSection?.results;
        const lectureIndex = store.currentLecture?.list_data?.index
            ? store.currentLecture?.list_data?.index + 1
            : 1;
        const numTotalLectures = store.lecturesInSection?.total;

        return (
            <h3 className={classNames('ud-heading-md', styles['section-title-container'])}>
                {hasTitle ? (
                    <>
                        <div className={classNames('ud-text-sm', styles['section-subtitle'])}>
                            {gettext("Playing in this course's section")}
                            {hasLecturesInSection && (
                                <>
                                    <span aria-hidden={true} className={styles['lecture-count']}>
                                        {lectureIndex}
                                        {'/'}
                                        {numTotalLectures}
                                    </span>
                                    <span className="ud-sr-only">
                                        {interpolate(
                                            gettext(
                                                'Lecture %(lectureIndex)s of %(numTotalLectures)s',
                                            ),
                                            {lectureIndex, numTotalLectures},
                                            true,
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className={styles['section-title']}>{store.section?.title}</div>
                    </>
                ) : (
                    <TextSkeleton
                        withTitle={true}
                        lineCountPerParagraph={1}
                        className={styles['section-skeleton']}
                    />
                )}
            </h3>
        );
    };

    handleLastChildEnter = async () => {
        await this.props.store.fetchLectureListDataByPageLink(
            LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES.NEXT,
        );
    };

    handleFirstChildEnter = async () => {
        await this.props.store.fetchLectureListDataByPageLink(
            LECTURE_QUICKVIEW_CONTENT_PAGE_TYPES.PREVIOUS,
        );
    };

    renderLecturesInSection = (lecturesInSection: LecturesInSection | null) => {
        const {store} = this.props;

        if (!lecturesInSection) {
            return <LectureRowSkeleton rowCount={this.props.isMdMax ? 5 : 10} />;
        }

        return (
            <>
                {lecturesInSection.links.previous && (
                    <Loader
                        className={styles['lecture-list-loader']}
                        data-purpose="previous-loader"
                    />
                )}
                <InfiniteScrollContainer
                    onLastChildEnter={this.handleLastChildEnter}
                    onFirstChildEnter={this.handleFirstChildEnter}
                >
                    {lecturesInSection.results.map((lecture: Lecture) => (
                        <LectureRow
                            lecture={lecture}
                            key={lecture.id}
                            isCurrentLecture={store.currentLecture?.id === lecture.id}
                            playOrPause={store.playOrPauseLecture(lecture)}
                            store={store}
                        />
                    ))}
                </InfiniteScrollContainer>
                {lecturesInSection.links.next && (
                    <Loader className={styles['lecture-list-loader']} data-purpose="next-loader" />
                )}
            </>
        );
    };

    render() {
        const {store} = this.props;
        const lecturesInSection =
            store.lecturesInSection?.results && store.lecturesInSection.results.length > 0
                ? store.lecturesInSection
                : null;

        return (
            <div className={styles['lecture-list-container']}>
                <div className={styles['lecture-list-header']} data-purpose="lecture-list-header">
                    {this.renderTitleSection()}
                </div>
                <div
                    ref={this.scrollingContainerRef}
                    className={styles['lecture-list']}
                    data-purpose="lecture-list"
                >
                    {this.renderLecturesInSection(lecturesInSection)}
                    {/*
                        For mobile devices, show the LectureViewCourseCard (with full course details)
                        at the bottom of the list of lectures.
                    */}
                    {store.course && (
                        <div className={styles['course-card-container']}>
                            <LectureViewCourseCard
                                course={store.course}
                                trackingContext={store.trackingContext}
                                lecture={store.currentLecture}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export const LectureList = withI18n(InternalLectureList);
