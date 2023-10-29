import {observer} from 'mobx-react';
import React from 'react';

import {
    CompactCourseProgressCard,
    CompactCourseProgressCardProps,
    CourseProgressCardsSkeleton,
} from '@udemy/browse-course';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {
    CompactProgramProgressCard,
    CompactProgramProgressCardProps,
    UDEMY_PRO_PLACEHOLDER_URL,
} from '@udemy/subscription-browse';
import {useSiteStats} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useMyLearningStore} from '../../hooks/use-my-learning-store';
import styles from '../panel-menu.module.less';
import {COURSE_COUNT_WITH_SUBSCRIPTION, MY_LEARNING_CTA} from './constants';

type Course = CompactCourseProgressCardProps['course'];
type Program = CompactProgramProgressCardProps['program'];

interface Content {
    programSection?: React.ReactNode;
    courseSection: React.ReactNode;
}

export const MyLearningItems = observer(() => {
    const headerStore = useHeaderStore();
    const myLearningStore = useMyLearningStore();
    const {gettext, interpolate} = useI18n();
    const siteStats = useSiteStats();

    function renderSkeleton() {
        return (
            <div className={styles.panel} data-testid="my-learning-skeleton">
                <CourseProgressCardsSkeleton size="compact" cardCountPerRow={1} rowCount={2} />
            </div>
        );
    }

    function renderZeroItems({text, cta}: {text: string; cta: {url: string; text: string}}) {
        return (
            <div className={styles.panel}>
                <div className={`ud-heading-lg ${styles['gap-bottom']}`}>{text}</div>
                <Button
                    componentClass="a"
                    href={cta.url}
                    udStyle="secondary"
                    className={styles.cta}
                >
                    {cta.text}
                </Button>
            </div>
        );
    }

    function renderHeading({text, link}: {text: string; link: {url: string; text: string}}) {
        return (
            <div className={styles['section-heading']}>
                <div className={`ud-heading-lg ${styles['section-heading-title']}`}>{text}</div>
                <a className={`ud-heading-sm ${styles['section-heading-link']}`} href={link.url}>
                    {link.text}
                </a>
            </div>
        );
    }

    function renderProgram(program: Program) {
        const props: CompactProgramProgressCardProps = {
            key: program.id,
            program: program,
            className: styles.item,
        };
        return <CompactProgramProgressCard {...props} />;
    }

    function renderCourse(course: Course) {
        return (
            <CompactCourseProgressCard key={course.id} course={course} className={styles.item} />
        );
    }

    function getContentWithSubscription(courses: Course[], programs: Program[]): Content {
        const {user} = headerStore.userSpecificContext;

        const subscriptionCTA = {
            url: UDEMY_PRO_PLACEHOLDER_URL,
            text: gettext('View all IT Certification Programs'),
        };

        const programSection = (
            <>
                {(programs.length > 0 || courses.length > 0) &&
                    renderHeading({
                        text: gettext('Programs'),
                        // TODO: check if /home/my-courses/programs/ is valid for Udemy Pro
                        link: {text: gettext('My programs'), url: headerStore.urls.MY_PROGRAMS},
                    })}
                {programs.length === 0 &&
                    renderZeroItems({
                        text: gettext('You’re not enrolled in any programs yet.'),
                        cta: subscriptionCTA,
                    })}
                {programs.length > 0 && programs.map(renderProgram)}
                {programs.length > 0 && (
                    <a
                        href={subscriptionCTA.url}
                        className={`ud-heading-sm ${styles.cta} ${styles.item}`}
                        style={{display: 'block', textAlign: 'center'}}
                    >
                        {subscriptionCTA.text}
                    </a>
                )}
            </>
        );

        const courseSection = courses.length > 0 && (
            <>
                {renderHeading({
                    text: gettext('Courses'),
                    link: user.consumer_subscription_active
                        ? {text: gettext('My learning'), url: headerStore.urls.PREMIUM_COURSES}
                        : {text: gettext('My courses'), url: headerStore.urls.MY_COURSES},
                })}
                {courses.slice(0, COURSE_COUNT_WITH_SUBSCRIPTION).map(renderCourse)}
            </>
        );

        return {programSection, courseSection};
    }

    function getContentWithoutSubscription(courses: Course[]): Content {
        let courseSection;
        const {user} = headerStore.userSpecificContext;
        if (courses.length === 0) {
            courseSection = renderZeroItems({
                text: user.consumer_subscription_active
                    ? gettext('Start learning today.')
                    : interpolate(
                          gettext('Start learning from over %(count)s courses today.'),
                          {count: siteStats.getNumericSiteStat('num_courses')},
                          true,
                      ),
                cta: {url: headerStore.urls.BROWSE, text: gettext('Browse now')},
            });
        } else {
            courseSection = (
                <>
                    {user.consumer_subscription_active &&
                        renderHeading({
                            text: gettext('Courses'),
                            link: {
                                text: gettext('My learning'),
                                url: headerStore.urls.PREMIUM_COURSES,
                            },
                        })}
                    {courses.map(renderCourse)}
                </>
            );
        }
        return {courseSection};
    }

    const {user} = headerStore.userSpecificContext;
    const {isLoading, courses, programs} = myLearningStore;
    if (isLoading) {
        return renderSkeleton();
    }
    const content = user.sms_subscriptions_active
        ? getContentWithSubscription(courses, programs)
        : getContentWithoutSubscription(courses);

    return (
        <>
            {content?.programSection}
            {content.courseSection}
            {(courses.length > 0 || programs.length > 0) && (
                <div className={styles.item}>
                    <Button
                        componentClass="a"
                        href={
                            user.consumer_subscription_active
                                ? headerStore.urls.PREMIUM_COURSES
                                : headerStore.urls.MY_LEARNING
                        }
                        udStyle="primary"
                        className={styles.cta}
                    >
                        {MY_LEARNING_CTA(gettext).TEXT}
                    </Button>
                </div>
            )}
        </>
    );
});
