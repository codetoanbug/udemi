import Observer from '@researchgate/react-intersection-observer';
import classNames from 'classnames';
import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';

import {TrackImpression} from '@udemy/event-tracking';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {useUDData} from '@udemy/ud-data';

import {ctaButtonUdStyle} from './bar-types';
import {BasicBarContent} from './basic.react-component';
import {ApiClass, getSmartBarStore} from './smart-bar-store.mobx-store';
import styles from './smart-bar.module.less';

export interface SmartBarProps {
    isPersonalPlanSubscriber?: boolean;
    isUdemyBusinessSubscriber?: boolean;
    forceNotSticky?: boolean;
    skipNoticeBackend?: boolean;
    muteEvents?: boolean;
    hideWhenStickyPositionHidden?: boolean;
    disableHideButtonWhenVisible?: boolean;
    store?: ReturnType<typeof getSmartBarStore>;
}

/**
 * The <SmartBar/> is a component that displays a message to the user, typically used by Marketing for promotions.  It is located at the top of the page.
 * <SmartBar/> message configuration is performed within Marketing Technologies Campaign Management tool.
 *
 * The <SmartBar/> can appear as 'sticky', and has a tightly coupled companion component <SmartBarSpacer/> that is used to help with
 * page layout and behaviors.
 *
 * @param {boolean} isPersonalPlanSubscriber True if user is a personal plan subscriber; used to pick use_case_group for notice API
 * @param {boolean} isUdemyBusinessSubscriber True if user is a UB subscriber; used to pick use_case_group for notice API
 * @param {boolean} skipNoticeBackend True for all <SmartBarSpacer/> (all should wait for the single instance of SmartBar to call notice API)
 * @param {boolean} muteEvents True for all <SmartBarSpacer/> (none should not send impression events)
 * @param {boolean} hideWhenStickyPositionHidden True for <SmartBarSpacer/> used in certain fixed position elements
 * @param {boolean} disableHideButtonWhenVisible True for <SmartBarSpacer/> that indicates the user has top of page in view
 */
const SmartBarComponent = (props: SmartBarProps) => {
    const [smartBarStore, setSmartBarStore] = useState<ApiClass | undefined>();
    const {me, Config, request, userAgnosticTrackingParams, isGlobalMeContextLoading} = useUDData();
    const {gettext, interpolate} = useI18n();
    const isMobile = useMatchMedia('sm-max');
    const disableHideButtonWhenVisible = props.disableHideButtonWhenVisible ?? false;

    useEffect(() => {
        if (!isGlobalMeContextLoading && !smartBarStore) {
            if (props.store) {
                setSmartBarStore(props.store);
            } else {
                if (!smartBarStore) {
                    const store = getSmartBarStore({
                        params:
                            typeof window !== 'undefined'
                                ? Object.fromEntries(
                                      new URLSearchParams(window.location?.search).entries(),
                                  )
                                : {},
                        isPersonalPlanSubscriber: props.isPersonalPlanSubscriber,
                        isUdemyBusinessSubscriber: props.isUdemyBusinessSubscriber,
                        skipNoticeBackend: props.skipNoticeBackend,
                        udConfig: Config,
                        udRequest: request,
                        udMe: me,
                        userAgnosticTrackingParams,
                    });
                    if (store) {
                        setSmartBarStore(store);
                    }
                }
            }
        }
    }, [
        isGlobalMeContextLoading,
        Config,
        props.isPersonalPlanSubscriber,
        props.isUdemyBusinessSubscriber,
        smartBarStore,
        me,
        request,
        userAgnosticTrackingParams,
        props.store,
        props.skipNoticeBackend,
    ]);

    const onClickOptIn = useCallback(() => {
        if (!smartBarStore?.optInJustApplied()) {
            smartBarStore
                ?.optIn()
                .then(() => {
                    runInAction(() => {
                        smartBarStore?.optedIn();
                        smartBarStore?.sendDealOptInEvent();
                        window.location.reload();
                    });
                })
                .catch(smartBarStore.optedOut);
        }
    }, [smartBarStore]);

    const onClickCta = useCallback(() => {
        smartBarStore?.sendClickEvent(smartBarStore?.data.get('cta_url'), 'cta');
    }, [smartBarStore]);

    function isSticky() {
        return props.forceNotSticky ? false : smartBarStore?.isSticky;
    }

    // Do not render conditions
    const shouldNotRender =
        !smartBarStore ||
        smartBarStore.isHidden ||
        request.termsBarType ||
        (smartBarStore.isStickyPositionHidden && props.hideWhenStickyPositionHidden); // Hide certain SmartBarSpacers when hidden_sticky=true)

    if (shouldNotRender) {
        return null;
    }

    // Smartbar classes
    const smartBarClasses = classNames(
        isSticky() && !smartBarStore.isStickyPositionHidden ? styles['smart-bar--sticky'] : null,
        isMobile ? styles['smart-bar--mobile'] : null,
        smartBarStore.noticeType
            ?.classes(smartBarStore.data)
            .split(' ')
            .map((className) => styles[className])
            .join(' '),
    );

    const hideButtonClasses = classNames(
        styles['smart-bar__close'],
        smartBarStore.hideButtonHidden ? styles['smart-bar__close_hidden'] : null,
    );

    const contentWrapperClasses = classNames(
        styles['smart-bar__content_wrapper'],
        smartBarStore.shouldRenderHideButton
            ? styles['smart-bar__content_wrapper--with-button']
            : null,
        isMobile ? styles['smart-bar__content_wrapper--mobile'] : null,
    );
    const contentClasses = classNames(
        styles['smart-bar__content'],
        isMobile ? styles['smart-bar__content--mobile'] : null,
    );
    const ctaButtonWrapperClasses = classNames(
        styles['smart-bar__cta-button-wrapper'],
        isMobile ? styles['smart-bar__cta-button-wrapper--mobile'] : null,
    );

    const smartBarCtaText = smartBarStore.data.get('cta_text');
    const smartBarCtaUrl = smartBarStore?.data.get('cta_url');
    const smartBarCtaAppliedText = smartBarStore.data.get('cta_applied_text');
    const smartBarCtaTarget = smartBarStore.data.get('cta_target');

    let linkHtmlProps = {};
    if (smartBarCtaTarget === 'new_tab') {
        linkHtmlProps = {
            target: '_blank',
            rel: 'noopener noreferrer',
        };
    }

    const ctaButtonText = interpolate(
        gettext('%(ctaText)s'),
        {
            ctaText: smartBarCtaText,
        },
        true,
    );

    const ctaAppliedButtonText = interpolate(
        gettext('%(ctaAppliedText)s'),
        {
            ctaAppliedText: smartBarCtaAppliedText,
        },
        true,
    );

    const content = (
        <BasicBarContent
            className={contentClasses}
            smartBarStore={smartBarStore}
            membership={smartBarStore.membership}
        />
    );

    const optInButton = (
        <div className={ctaButtonWrapperClasses}>
            <Button
                className="smart-bar__cta-button"
                data-testid="smart-bar-opt-in-cta"
                udStyle={ctaButtonUdStyle(smartBarStore.data)}
                size="medium"
                onClick={onClickOptIn}
            >
                {smartBarStore.optInJustApplied() ? (
                    ctaAppliedButtonText
                ) : smartBarStore.optInApplying() ? (
                    <Loader color="inherit" overlay={true} />
                ) : (
                    ctaButtonText
                )}
            </Button>
        </div>
    );

    const linkButton = (
        <div className={ctaButtonWrapperClasses}>
            <Button
                className="smart-bar__cta-button"
                data-testid="smart-bar-link-cta"
                udStyle={ctaButtonUdStyle(smartBarStore.data)}
                size="medium"
                componentClass="a"
                href={smartBarCtaUrl}
                onClick={onClickCta}
                {...linkHtmlProps}
            >
                {ctaButtonText}
            </Button>
        </div>
    );

    let ctaButton = null;
    if (smartBarStore?.noticeType?.showOptIn && !smartBarStore.membership.get('opt_in')) {
        ctaButton = optInButton;
    } else if (smartBarCtaUrl) {
        ctaButton = linkButton;
    }

    const hideButton = (
        <div>
            {smartBarStore.shouldRenderHideButton && (
                <IconButton
                    udStyle="ghost"
                    className={hideButtonClasses}
                    size="medium"
                    onClick={() => smartBarStore.hide()}
                    data-testid="smart-bar-hide"
                >
                    <CloseIcon label={gettext('Close')} />
                </IconButton>
            )}
        </div>
    );

    let smartBar;

    if (isMobile) {
        smartBar = (
            <div className={smartBarClasses} data-testid="smart-bar">
                <div className={contentWrapperClasses}>
                    {content}
                    {hideButton}
                </div>
                {ctaButton}
            </div>
        );
    } else {
        smartBar = (
            <div className={smartBarClasses} data-testid="smart-bar">
                <div className={contentWrapperClasses}>
                    {content}
                    {ctaButton}
                </div>
                {hideButton}
            </div>
        );
    }

    if (disableHideButtonWhenVisible) {
        const options = {
            onChange: (ioEntry: {isIntersecting: boolean}) => {
                smartBarStore.setIsInStickyPosition(!ioEntry.isIntersecting);
            },
        };
        smartBar = <Observer {...options}>{smartBar}</Observer>;
    }

    if (props.muteEvents) {
        return <div data-testid="smart-bar-container">{smartBar}</div>;
    }

    return (
        <TrackImpression
            trackFunc={() => {
                smartBarStore.sendImpressionsEvent();
            }}
        >
            <div data-testid="smart-bar-container">{smartBar}</div>
        </TrackImpression>
    );
};

SmartBarComponent.displayName = 'SmartBar';

export const SmartBar = observer(SmartBarComponent);

/**
 * SmartBarSpacer wraps a SmartBar with visibility: hidden.  It is used to keep the layout consistent with a SmartBar
 * in sticky position for page elements that are depend on the height of the SmartBar, such as the Header contents
 * and the CLP slider-menu.
 *
 * @param {boolean} disableHideButtonWhenVisible - True for SmartBarSpacer intended to track when top of page is visible
 */
interface SmartBarSpacerProps {
    disableHideButtonWhenVisible?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store?: any;
}
export const SmartBarSpacer = ({
    disableHideButtonWhenVisible = false,
    store = null,
    ...rest
}: SmartBarSpacerProps) => {
    return (
        <div
            className={classNames('smart-bar-spacer', styles['smart-bar-spacer'])}
            data-testid="smart-bar-spacer"
        >
            <SmartBar
                forceNotSticky={true}
                skipNoticeBackend={true}
                muteEvents={true}
                hideWhenStickyPositionHidden={true}
                disableHideButtonWhenVisible={disableHideButtonWhenVisible}
                store={store}
                {...rest}
            />
        </div>
    );
};

SmartBarSpacer.displayName = 'SmartBarSpacer';
