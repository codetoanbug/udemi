import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import AssignmentIcon from '@udemy/icons/dist/assignment.ud-icon';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import React from 'react';

import {CertificationModel} from '../certification.mobx-model';
import {sendCertificateDetailLinkClickEvent} from '../common/utils/event-helpers';
import detailStyles from '../detail-page.less';

export const ExternalLinkBanner: React.FC<{certification: CertificationModel}> = (props) => {
    const {gettext} = useI18n();
    const isMobile = useMatchMedia('mobile-max');
    const {
        certification: {criteria, name},
    } = props;

    const popoverContent = (
        <Popover
            className={classNames(detailStyles['badge-info-tooltip-container'])}
            canToggleOnHover={true}
            placement={'bottom'}
            withPadding={true}
            trigger={
                <InfoOutlineIcon
                    className={classNames(detailStyles['badge-info-icon'])}
                    label={false}
                    size="small"
                />
            }
        >
            <div>
                <p>
                    {gettext(
                        'Please be aware that the link will take you to an external website.' +
                            ' Please note that Udemy is not connected to or partnered with the external site.',
                    )}
                </p>
            </div>
        </Popover>
    );

    const externalLinkIcon = (
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

    return (
        <div className={classNames(detailStyles['badge-detail-container'], 'ud-container')}>
            <div className={classNames(detailStyles['badge-detail-info-container'])}>
                <div className={classNames(detailStyles['icon-container'])}>
                    <AssignmentIcon
                        label={false}
                        size="large"
                        className={classNames(detailStyles['card-icon'], detailStyles.assessment)}
                    />
                </div>
                <div className={classNames('ud-heading-md')}>
                    {gettext('Learn about the badge and schedule your certification exam')}
                </div>
                {!isMobile && popoverContent}
            </div>
            <a
                href={criteria.id}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(detailStyles['badge-detail-link-container'])}
                onClick={() => sendCertificateDetailLinkClickEvent(name)}
                data-purpose="certification-detail-link"
            >
                {externalLinkIcon}
            </a>
        </div>
    );
};
