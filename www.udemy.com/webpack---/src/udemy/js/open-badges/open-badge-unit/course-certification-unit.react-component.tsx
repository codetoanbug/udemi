import {Tracker, TrackImpression} from '@udemy/event-tracking';
import {useI18n} from '@udemy/i18n';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';

import {LearningProductType} from 'gql-codegen/api-platform-graphql';
import {BadgePresented} from 'personalize/events';

import {CertificationModel} from '../certification.mobx-model';
import {CertificationUnitCard} from './certification-unit-card.react-component';
import {CertificationUnitStore} from './certification-unit.mobx-store';
import styles from './course-unit.less';

interface CourseCertificationUnitProps {
    courseId: number;
    courseTopicId?: number;
    showUpdatedCertificationUnit?: boolean;
}

export const CourseCertificationUnit = observer(
    ({courseId, courseTopicId, showUpdatedCertificationUnit}: CourseCertificationUnitProps) => {
        const {gettext, ngettext} = useI18n();
        const certificationUnitStore = new CertificationUnitStore();
        const [certifications, setCertifications] = useState<CertificationModel[]>([]);
        const isMounted = useRef(true);

        const trackBadgePresented = () => {
            // A few courses have multiple certifications associated/displayed
            certifications.forEach((cert) => {
                Tracker.publishEvent(
                    new BadgePresented({
                        badgeId: Number(cert.id),
                        badgeClass: {name: cert.name},
                        sourcePageId: courseId,
                    }),
                );
            });
        };

        useEffect(() => {
            isMounted.current = true;

            const fetchCertificationData = async () => {
                await certificationUnitStore.getLearningProductCertifications(
                    courseId,
                    LearningProductType.Course,
                );

                if (isMounted.current) {
                    setCertifications(certificationUnitStore.learningProductCertifications ?? []);
                }
            };

            fetchCertificationData();

            return () => {
                isMounted.current = false; // Set to false when the component unmounts
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        if (!certifications || certifications.length == 0) {
            return null;
        }

        return (
            <TrackImpression trackFunc={trackBadgePresented}>
                <div
                    data-purpose="course-certification-unit"
                    className={
                        showUpdatedCertificationUnit
                            ? styles['updated-course-certification-unit']
                            : styles['course-certification-unit']
                    }
                >
                    {showUpdatedCertificationUnit ? (
                        <h2
                            data-purpose="certification-unit-info"
                            className={styles['certification-unit-info']}
                        >
                            <InfoIcon label={false} size="medium" />
                            <strong>
                                {ngettext(
                                    'This course is designed to help you prepare for the following certification:',
                                    'This course is designed to help you prepare for the following certifications:',
                                    certifications.length,
                                )}
                            </strong>
                        </h2>
                    ) : (
                        <h2 data-purpose="certification-unit-title" className="ud-heading-xl">
                            {gettext('Certification preparation')}
                        </h2>
                    )}
                    {!showUpdatedCertificationUnit && (
                        <span
                            data-purpose="certification-unit-helper-text"
                            className={classNames('ud-text-sm')}
                        >
                            {ngettext(
                                'This course is specifically designed to help you prepare for the following certification:',
                                'This course is specifically designed to help you prepare for the following certifications:',
                                certifications.length,
                            )}
                        </span>
                    )}
                    <ShowMore collapsedHeight={140}>
                        <div className={styles['certifications-list-container']}>
                            {certifications?.map((cert) => {
                                return (
                                    <CertificationUnitCard
                                        data-purpose="certification-unit-card"
                                        key={cert.id}
                                        certification={cert}
                                        showUpdatedCertificationCard={showUpdatedCertificationUnit}
                                        courseTopicId={courseTopicId}
                                    />
                                );
                            })}
                        </div>
                    </ShowMore>
                </div>
            </TrackImpression>
        );
    },
);
