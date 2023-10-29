import {Tracker} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {toBusinessUdemy} from '@udemy/organization';
import {MarketplaceOnly} from '@udemy/react-brand-components';
import {Image} from '@udemy/react-core-components';
import {AdvertisingBanner} from '@udemy/react-messaging-components';
import {udLink, withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {UFBNoticeClickEvent} from 'browse/events';
import {getOrgNumericSiteStat} from 'utils/site-stats';

import styles from './top-companies-notice.less';

const DEFAULT_LOGOS_OPTIONS = {className: styles.logos, imageHeight: 44};

class InternalTopCompaniesNotice extends React.Component {
    static propTypes = {
        refParam: PropTypes.string.isRequired,
        linkParams: PropTypes.object,
        pageType: PropTypes.string,
        className: PropTypes.string,
        isOnsiteRequestDemo: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    // Should be required but is out of scope for this PR
    static defaultProps = {
        linkParams: {},
        pageType: 'page_not_specified',
        className: undefined,
        isOnsiteRequestDemo: false,
    };

    static renderLogos(options = DEFAULT_LOGOS_OPTIONS, udData = {}) {
        return (
            <div className={options.className}>
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/nasdaq-dark.svg', udData)}
                    alt="Nasdaq"
                    height={options.imageHeight}
                    width={115}
                />
                <Image
                    src={udLink.toStorageStaticAsset(
                        'partner-logos/v4/volkswagen-dark.svg',
                        udData,
                    )}
                    alt="Volkswagen"
                    height={options.imageHeight}
                    width={44}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/box-dark.svg', udData)}
                    alt="Box"
                    height={options.imageHeight}
                    width={67}
                />
                <Image
                    src={udLink.toStorageStaticAsset('partner-logos/v4/netapp-dark.svg', udData)}
                    alt="NetApp"
                    height={options.imageHeight}
                    width={115}
                />
                <Image
                    src={udLink.toStorageStaticAsset(
                        'partner-logos/v4/eventbrite-dark.svg',
                        udData,
                    )}
                    alt="Eventbrite"
                    height={options.imageHeight}
                    width={115}
                />
            </div>
        );
    }

    handleClick = () => {
        const {refParam, udData} = this.props;
        Tracker.publishEvent(
            new UFBNoticeClickEvent({
                locale: udData.request.locale,
                placement: refParam,
            }),
        );
    };

    render() {
        const {
            className,
            refParam,
            linkParams,
            isOnsiteRequestDemo,
            gettext,
            interpolate,
            udData,
            ...restProps
        } = this.props;
        const {Config, request} = udData;
        return (
            <MarketplaceOnly>
                <div data-purpose="top-companies-wrapper">
                    <AdvertisingBanner
                        background="light"
                        title={gettext('Top companies trust Udemy')}
                        titleClassName="ud-heading-serif-lg"
                        subtitle={interpolate(
                            gettext("Get your team access to Udemy's top %(num_courses)s+ courses"),
                            {num_courses: getOrgNumericSiteStat('num_courses')},
                            true,
                        )}
                        submitButtonText={gettext('Try Udemy Business')}
                        submitButtonProps={{
                            udStyle: 'secondary',
                            size: 'medium',
                            componentClass: 'a',
                            href: toBusinessUdemy(
                                'request-demo',
                                {
                                    ...linkParams,
                                    ref: refParam,
                                },
                                isOnsiteRequestDemo,
                                {Config, request},
                            ),
                            onClick: this.handleClick,
                            target: isOnsiteRequestDemo ? null : '_blank',
                            rel: isOnsiteRequestDemo ? null : 'noopener',
                        }}
                        {...restProps}
                        className={classNames(styles['background-container'], className)}
                    >
                        {InternalTopCompaniesNotice.renderLogos(DEFAULT_LOGOS_OPTIONS, {Config})}
                    </AdvertisingBanner>
                </div>
            </MarketplaceOnly>
        );
    }
}

const TopCompaniesNotice = withI18n(withUDData(InternalTopCompaniesNotice));
const TopCompaniesNoticeWithStaticMethods = Object.assign({}, TopCompaniesNotice, {
    renderLogos: InternalTopCompaniesNotice.renderLogos,
});

export default TopCompaniesNoticeWithStaticMethods;
