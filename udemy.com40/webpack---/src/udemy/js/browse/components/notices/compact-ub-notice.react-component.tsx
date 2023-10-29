import {Tracker} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n, LocalizedHtml} from '@udemy/i18n';
import {toBusinessUdemy} from '@udemy/organization';
import {Image} from '@udemy/react-core-components';
import {useUDData, useUDLink} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import {UFBNoticeClickEvent} from 'browse/events';

import styles from './compact-ub-notice.less';
import TopCompaniesNotice from './top-companies-notice.react-component';

const IMAGE_HEIGHT = 44;

export const CompactUBNotice = () => {
    const {gettext} = useI18n();
    const {Config, request} = useUDData();
    const udLink = useUDLink();
    const isMobileMax = useMatchMedia('mobile-max');
    if (!Config.features.ufb_notices) {
        return null;
    }

    const handleClick = () => {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale: request.locale,
                placement: 'srp',
            }),
        );
    };

    return (
        <div className={styles.container}>
            <div className={classNames('ud-heading-lg', styles['notice-text'])}>
                <LocalizedHtml
                    html={gettext(
                        'Top companies trust <a class="link">Udemy Business</a> to build in-demand career skills.',
                    )}
                    interpolate={{
                        link: (
                            /* eslint-disable react/jsx-no-target-blank */
                            /* this.props.link is always a business.udemy.com link.
                             * We allow referrer for tracking purposes. */
                            <a
                                data-purpose="ufb-link"
                                className="inverted-link"
                                href={toBusinessUdemy('request-demo', {}, false, {
                                    request,
                                    // eslint-disable-next-line @typescript-eslint/naming-convention
                                    Config,
                                })}
                                target="_blank"
                                rel="noopener"
                                onClick={handleClick}
                            />
                            /* eslint-enable react/jsx-no-target-blank */
                        ),
                    }}
                />
            </div>

            <div className={styles['partner-logos']}>
                {isMobileMax ? (
                    <div>
                        <Image
                            src={udLink.toStorageStaticAsset('partner-logos/v4/box-dark.svg', {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Config,
                            })}
                            alt="Box"
                            height={IMAGE_HEIGHT}
                            width={44}
                        />
                        <Image
                            src={udLink.toStorageStaticAsset(
                                'partner-logos/v4/volkswagen-dark.svg',
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                {Config},
                            )}
                            alt="Volkswagen"
                            height={IMAGE_HEIGHT}
                            width={44}
                        />
                        <Image
                            src={udLink.toStorageStaticAsset('partner-logos/v4/netapp-dark.svg', {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                Config,
                            })}
                            alt="NetApp"
                            height={IMAGE_HEIGHT}
                            width={115}
                        />
                    </div>
                ) : (
                    <>
                        {TopCompaniesNotice.renderLogos(
                            {className: '', imageHeight: IMAGE_HEIGHT},
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            {Config},
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
