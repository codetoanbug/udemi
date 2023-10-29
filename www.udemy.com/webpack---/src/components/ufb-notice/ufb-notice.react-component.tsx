import classNames from 'classnames';
import {observer} from 'mobx-react';
import React from 'react';

import {Tracker} from '@udemy/event-tracking';
import {useI18n, LocalizedHtml} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {useUDLink} from '@udemy/ud-data';

import {UFBNoticeClickEvent} from './events';
import styles from './ufb-notice.module.less';

interface UFBNoticeProps {
    link?: string;
    placement: string;
    isOnsiteRequestDemo?: boolean;
}

export const UFBNotice = observer(({link, placement, isOnsiteRequestDemo}: UFBNoticeProps) => {
    const {gettext, locale} = useI18n();
    const udLink = useUDLink();

    function handleClick() {
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale,
                placement,
            }),
        );
    }

    return (
        <div
            className={classNames('footer-section', styles['notice-row'])}
            data-testid="ufb-notice"
        >
            <div className={classNames('ud-heading-lg', styles['notice'])}>
                <LocalizedHtml
                    html={gettext(
                        'Top companies choose <a class="link">Udemy Business</a> to build in-demand career skills.',
                    )}
                    interpolate={{
                        link: (
                            /* eslint-disable react/jsx-no-target-blank */
                            /* this.props.link is always a business.udemy.com link.
                             * We allow referrer for tracking purposes. */
                            <a
                                data-purpose="ufb-link"
                                className="inverted-link"
                                href={link}
                                target={isOnsiteRequestDemo ? undefined : '_blank'}
                                rel={isOnsiteRequestDemo ? undefined : 'noopener'}
                                onClick={handleClick}
                            />
                            /* eslint-enable react/jsx-no-target-blank */
                        ),
                    }}
                />
            </div>
            <div className={styles['partner-logos']}>
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/nasdaq-light.svg')}
                    alt="Nasdaq"
                    height={44}
                    width={115}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/volkswagen-light.svg')}
                    alt="Volkswagen"
                    height={44}
                    width={44}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/box-light.svg')}
                    alt="Box"
                    height={44}
                    width={67}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/netapp-light.svg')}
                    alt="NetApp"
                    height={44}
                    width={115}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/eventbrite-light.svg')}
                    alt="Eventbrite"
                    height={44}
                    width={115}
                />
            </div>
        </div>
    );
});
