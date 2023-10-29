import {useI18n} from '@udemy/i18n';
import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import {Image} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {useEffect, useRef} from 'react';

import {DueDateBanner} from './certification-detail-page/due-date-banner.react-component';
import {ExternalLinkBanner} from './certification-detail-page/external-link-banner.react-component';
import {UploadBadgeBanner} from './certification-detail-page/upload-banner.react-component';
import {BadgeUploadedBanner} from './certification-detail-page/uploaded-banner.react-component';
import {CertificationModel} from './certification.mobx-model';
import styles from './certifications-page.less';
import {sendCertificateDetailLinkClickEvent} from './common/utils/event-helpers';
import {isBadgingAssertionsEnabled} from './common/utils/utils';
import detailStyles from './detail-page.less';
import {ImportBadgeModal} from './upload-badge/import-badge-modal.react-component';
import {UploadBadgeStore} from './upload-badge/upload-badge.mobx-store';

interface CertificationsDetailBannerProps {
    certification: CertificationModel;
    onUpdate?: () => void;
}

const BannerStore = observable({
    isLargeBannerVisible: true,
});

export const CertificationsDetailBanner: React.FC<CertificationsDetailBannerProps> = observer(
    (props) => {
        const {gettext} = useI18n();
        const {
            id,
            name,
            description,
            image,
            tags,
            issuer,
            criteria,
            assertions,
            isBadgeUploadedByUser,
        } = props.certification;
        const badgeUploadStore = new UploadBadgeStore(id);

        const handleIntersection: IntersectionObserverCallback = (
            entries: IntersectionObserverEntry[],
        ) => {
            const entry = entries[0];
            // Wrap the state modification in an action
            action(() => {
                BannerStore.isLargeBannerVisible = entry.isIntersecting;
            })();
        };

        const IntersectionObserverComponent: React.FC = ({children}) => {
            const targetRef = useRef<HTMLDivElement | null>(null);

            useEffect(() => {
                const options = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0,
                };

                const observer = new IntersectionObserver(handleIntersection, options);

                if (targetRef.current) {
                    observer.observe(targetRef.current);
                }

                // Clean up the observer when the component unmounts
                return () => observer.disconnect();
            }, []);

            return <div ref={targetRef}>{children}</div>;
        };

        function generateTags() {
            return (
                <>
                    {tags.map((tag) => {
                        return (
                            <Badge
                                className={classNames(detailStyles['certification-type-badge'])}
                                key={`index+${tag}`}
                                data-purpose="certification-tag"
                            >
                                {tag}
                            </Badge>
                        );
                    })}
                </>
            );
        }

        function getExternalLinkIcon() {
            return (
                <>
                    <LinkIcon
                        size="small"
                        label={false}
                        className={classNames(detailStyles['badge-link-icon'])}
                    />
                    <div className={classNames('ud-heading-md', detailStyles['badge-link-icon'])}>
                        {gettext('View badge details')}
                    </div>
                </>
            );
        }

        const badgeStickyBanner = (
            <div
                className={styles['banner-container-sticky']}
                style={{display: BannerStore.isLargeBannerVisible ? 'none' : 'block'}}
            >
                <div className={classNames('ud-container', styles['banner-sticky'])}>
                    <div className={styles['certification-image-sticky']}>
                        <Image
                            data-purpose="certification-image-sticky"
                            alt={name}
                            src={image.id}
                        />
                    </div>

                    <div className={classNames(styles['certifications-text'])}>
                        <h1
                            className={classNames(
                                'ud-heading-serif-xl',
                                detailStyles['certification-name-header'],
                            )}
                            data-purpose="certification-header-sticky"
                        >
                            {name}
                        </h1>
                        <div
                            className={classNames('ud-text-md', detailStyles['secondary-header'])}
                            data-purpose="certification-issuer-sticky"
                        >
                            {interpolate(
                                gettext('Issued by %(issuerName)s'),
                                {
                                    issuerName: issuer.name,
                                },
                                true,
                            )}
                        </div>
                    </div>

                    <a
                        href={criteria.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classNames(styles['badge-detail-link-container-sticky'])}
                        onClick={() => sendCertificateDetailLinkClickEvent(name)}
                        data-purpose="certification-detail-link-sticky"
                    >
                        {getExternalLinkIcon()}
                    </a>
                </div>
            </div>
        );

        const badgeMetadata = (
            <div className={classNames('ud-container', styles.banner)}>
                <div className={styles['certification-image']}>
                    <Image data-purpose="certification-image" alt={name} src={image.id} />
                </div>

                <div className={classNames(styles['certifications-text'])}>
                    <h1
                        className={classNames(
                            'ud-heading-serif-xxl',
                            detailStyles['certification-name-header'],
                        )}
                        data-purpose="certification-header"
                    >
                        {name}
                    </h1>
                    <div
                        className={classNames('ud-text-md', detailStyles['secondary-header'])}
                        data-purpose="certification-issuer"
                    >
                        {interpolate(
                            gettext('Issued by %(issuerName)s'),
                            {
                                issuerName: issuer.name,
                            },
                            true,
                        )}
                    </div>
                    <div className="ud-text-md" data-purpose="certification-description-text">
                        {description}
                    </div>
                    <div className={classNames(detailStyles['certification-type-div'])}>
                        {generateTags()}
                    </div>
                </div>
            </div>
        );

        function getUploadBadgeContent() {
            if (!isBadgingAssertionsEnabled()) {
                return null;
            }
            if (isBadgeUploadedByUser) {
                return <BadgeUploadedBanner assertionId={assertions[0].id} />;
            }
            return <UploadBadgeBanner store={badgeUploadStore} />;
        }

        return (
            <>
                <IntersectionObserverComponent>
                    <div>
                        <div className={styles['banner-container']}>
                            {badgeMetadata}
                            <ExternalLinkBanner certification={props.certification} />
                            {!isBadgeUploadedByUser && (
                                <DueDateBanner badge={props.certification} />
                            )}
                            {getUploadBadgeContent()}
                            <ImportBadgeModal store={badgeUploadStore} onClose={props.onUpdate} />
                        </div>
                    </div>
                </IntersectionObserverComponent>

                {badgeStickyBanner}
            </>
        );
    },
);
