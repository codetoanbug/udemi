import {ClientSideRender} from '@udemy/design-system-utils';
import {Tracker, ClickEvent, TrackImpression} from '@udemy/event-tracking';
import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import {Accordion, TextSkeleton} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {LearningProductType} from 'browse/events';
import {UI_REGION} from 'browse/ui-regions';
import {isomorphic} from 'utils/isomorphic-rendering';

import {CurriculumImpressionEvent} from '../../events';
import {Section, PracticeTestSection} from './section.react-component';

import './curriculum.less';

const DISPLAYED_SECTIONS_COUNT = 10;

@isomorphic
@observer
export default class Curriculum extends React.Component {
    static propTypes = {
        curriculum: PropTypes.object,
        titleTypography: PropTypes.oneOf(['ud-heading-lg', 'ud-heading-xl']),
        enableExpandAllControl: PropTypes.bool,
        courseId: PropTypes.number,
        courseTrackingId: PropTypes.string,
        practiceIncentiveCardsComponent: PropTypes.object,
    };

    static defaultProps = {
        curriculum: undefined,
        courseId: undefined,
        courseTrackingId: undefined,
        enableExpandAllControl: true,
        titleTypography: 'ud-heading-xl',
        practiceIncentiveCardsComponent: null,
    };

    @observable areAllSectionsExpanded = false;
    @observable displayedSectionsCount = DISPLAYED_SECTIONS_COUNT;

    @autobind @action onToggleAllSections() {
        this.onShowAllSections();
        this.areAllSectionsExpanded = !this.areAllSectionsExpanded;
    }

    @autobind @action onShowAllSections() {
        this.displayedSectionsCount = this.props.curriculum.sections.length;
        Tracker.publishEvent(
            new ClickEvent({
                componentName: 'curriculumRead',
                trackingId: this.props.curriculum.tracking_id,
                relatedObjectType: ClickEvent.relatedObjectTypes.course,
                relatedObjectId: this.props.courseId,
            }),
        );
    }

    @autobind trackImpression() {
        const {courseId, courseTrackingId} = this.props;
        if (courseTrackingId && courseId !== undefined) {
            const learningProduct = {
                id: courseId,
                trackingId: courseTrackingId,
                type: LearningProductType.COURSE,
            };
            Tracker.publishEvent(new CurriculumImpressionEvent(learningProduct));
        }
    }

    get placeholder() {
        return (
            <TextSkeleton
                styleName="curriculum-loader"
                withTitle={true}
                lineCountPerParagraph={3}
                paragraphCount={16}
            />
        );
    }

    get curriculumContentInfo() {
        return this.props.curriculum.is_for_practice_test_course ? (
            <span styleName="content-length">
                {this.props.curriculum.sections[0].content_length_text}
            </span>
        ) : (
            <span styleName="content-length">
                {ninterpolate(
                    '%(sectionCount)s section',
                    '%(sectionCount)s sections',
                    this.props.curriculum.sections.length,
                    {sectionCount: this.props.curriculum.sections.length},
                )}
                {' • '}
                {ninterpolate(
                    '%(lectureCount)s lecture',
                    '%(lectureCount)s lectures',
                    this.props.curriculum.num_of_published_lectures,
                    {lectureCount: this.props.curriculum.num_of_published_lectures},
                )}
                {' • '}
                <LocalizedHtml
                    html={gettext(
                        '<span class="contentLength">%(contentLength)s</span> total length',
                    )}
                    interpolate={{
                        contentLength: (
                            <Duration
                                numSeconds={
                                    this.props.curriculum.estimated_content_length_in_seconds
                                }
                                precision={Duration.PRECISION.MINUTES}
                                presentationStyle={Duration.STYLE.HUMAN_COMPACT}
                            />
                        ),
                    }}
                />
            </span>
        );
    }

    get curriculumSections() {
        if (!this.props.curriculum) {
            return this.placeholder;
        }
        if (!this.props.curriculum.sections?.length) {
            return null;
        }
        const hiddenSectionsCount =
            this.props.curriculum.sections.length - this.displayedSectionsCount;
        const sectionComponents = this.props.curriculum.sections
            .slice(0, this.displayedSectionsCount)
            .map((section, index) =>
                this.props.curriculum.is_for_practice_test_course ? (
                    <PracticeTestSection
                        key={index}
                        arrayIndex={index}
                        title={section.title}
                        items={section.items.slice()}
                    />
                ) : (
                    <Section
                        key={index}
                        arrayIndex={index}
                        title={section.title}
                        items={section.items.slice()}
                        numLectures={section.lecture_count}
                        contentLength={section.content_length}
                        areAllSectionsExpanded={this.areAllSectionsExpanded}
                    />
                ),
            );
        return (
            /**
             * We're overriding the visibilityThreshold since this component live between above the fold and below
             * the fold. We're displaying 10 sections + 1 header. So seeing 1/4 should be enough to send an impression
             * event since users will see header + at least 1 section.
             */
            <TrackImpression trackFunc={this.trackImpression} visibilityThreshold={0.25}>
                <div data-purpose="course-curriculum">
                    <h2
                        styleName="curriculum-header"
                        className={this.props.titleTypography}
                        data-purpose="curriculum-header"
                    >
                        {this.props.curriculum.is_for_practice_test_course
                            ? gettext('Included in This Course')
                            : gettext('Course content')}
                    </h2>
                    <>{this.props.practiceIncentiveCardsComponent}</>
                    <div styleName="curriculum-sub-header">
                        <div className="ud-text-sm" data-purpose="curriculum-stats">
                            {this.curriculumContentInfo}
                        </div>
                        {this.props.enableExpandAllControl &&
                        !this.props.curriculum.is_for_practice_test_course &&
                        sectionComponents.length > 1 ? (
                            <Button
                                data-purpose="expand-toggle"
                                size="medium"
                                udStyle="ghost"
                                aria-expanded={this.areAllSectionsExpanded}
                                onClick={this.onToggleAllSections}
                            >
                                {this.areAllSectionsExpanded
                                    ? gettext('Collapse all sections')
                                    : gettext('Expand all sections')}
                            </Button>
                        ) : null}
                    </div>
                    <Accordion size="medium">{sectionComponents}</Accordion>
                    {hiddenSectionsCount > 0 && (
                        <Button
                            size="medium"
                            udStyle="secondary"
                            styleName="curriculum-show-more"
                            onClick={this.onShowAllSections}
                            data-purpose="show-more"
                        >
                            {ninterpolate(
                                '%s more section',
                                '%s more sections',
                                hiddenSectionsCount,
                            )}
                        </Button>
                    )}
                </div>
            </TrackImpression>
        );
    }

    render() {
        return (
            <div className="component-margin">
                <span id="objective" className="in-page-offset-anchor"></span>
                <ClientSideRender placeholder={this.placeholder} uiRegion={UI_REGION.CURRICULUM}>
                    {this.curriculumSections}
                </ClientSideRender>
            </div>
        );
    }
}
