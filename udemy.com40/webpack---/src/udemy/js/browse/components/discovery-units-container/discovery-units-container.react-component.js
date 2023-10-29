import {
    PAGE_TYPE_CATEGORY,
    PAGE_TYPE_SUBCATEGORY,
    PAGE_TYPE_LOGGED_IN_HOMEPAGE,
    PAGE_TYPE_TOPIC,
    pageTypes,
    PAGE_TYPE_ORG_CATEGORY,
    PAGE_TYPE_ORG_SUBCATEGORY,
    PAGE_TYPE_SUBS_CATEGORY,
    PAGE_TYPE_SUBS_SUBCATEGORY,
} from '@udemy/discovery-api';
import {TrackingContextProvider} from '@udemy/event-tracking';
import {withI18n} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {observer, Provider, PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import DiscoveryUnitRenderer from 'browse/components/discovery-units/discovery-unit-renderer/discovery-unit-renderer.react-component';
import InfiniteScrollContainer from 'browse/components/infinite-scroll-container/infinite-scroll-container.react-component';
import {sortChildren} from 'browse/components/item-injector/item-injector.react-component';
import {deviceTypeProps} from 'browse/lib/device-type';
import {discoveryTracker} from 'browse/tracking';

import styles from './discovery-units-container.less';
import DiscoveryUnitsContainerStore from './discovery-units-container.mobx-store';
import DiscoveryUnitsLoadingSkeleton from './discovery-units-loading-skeleton.react-component';

@observer
export class InternalDiscoveryUnitsContainer extends React.Component {
    static propTypes = {
        alternateHeadline: PropTypes.shape({
            title: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        }),
        disableInfiniteScroll: PropTypes.bool,
        itemCount: PropTypes.number,
        pageObjectId: PropTypes.number,
        pageObject: PropTypes.object,
        pageType: PropTypes.oneOf(pageTypes).isRequired,
        units: MobxPropTypes.arrayOrObservableArray,
        filter: PropTypes.func,
        showTitle: PropTypes.bool,
        store: PropTypes.object,
        skeletonComponent: PropTypes.func,
        ...deviceTypeProps,
        fetchOptions: PropTypes.object,
        itemIndicesByType: PropTypes.object,
        gettext: PropTypes.func.isRequired,
        pgettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        alternateHeadline: undefined,
        disableInfiniteScroll: false,
        itemCount: 12,
        units: [],
        pageObjectId: undefined,
        pageObject: {},
        filter: () => true,
        showTitle: true,
        store: undefined,
        skeletonComponent: DiscoveryUnitsLoadingSkeleton,
        fetchOptions: {},
        itemIndicesByType: {},
    };

    constructor(props) {
        super(props);
        const {pageType, pageObjectId, pageObject, units} = props;
        this.store =
            props.store ||
            new DiscoveryUnitsContainerStore(
                {
                    pageType,
                    units,
                    pageObjectId,
                    pageObject,
                },
                this.props.udData,
            );
    }

    componentDidMount() {
        // only perform initital fetch if there is no initial data
        if (!this.props.units.length) {
            const options = {
                pageSize: 6,
                // We should consider lowering the item count for all pages in the future
                // to reduce page load time.
                itemCount: this.props.itemCount,
                ...this.props.fetchOptions,
            };
            this.store.fetchUnits(options);
        } else {
            this.store.processPreloadedUnits();
        }
    }

    renderUnit = (unit, i) => {
        const {pageType, unitPropsByType} = this.props;

        /** Injected at the 0th index */
        if (unit.type === 'related_categories_and_subcategories') {
            return (
                <DiscoveryUnitRenderer
                    unit={unit}
                    unitPropsByType={unitPropsByType}
                    pageType={pageType}
                    data-item-index={0}
                    className={styles['related-categories']}
                />
            );
        }

        /** Injected at the 0th index */
        if (
            pageType === PAGE_TYPE_LOGGED_IN_HOMEPAGE &&
            unit.type === 'recently_viewed_and_wishlisted'
        ) {
            return (
                <DiscoveryUnitRenderer
                    unit={unit}
                    pageType={pageType}
                    data-item-index={0}
                    showTitle={true}
                    className="component-margin"
                />
            );
        }

        if (pageType === PAGE_TYPE_TOPIC && unit.type === 'labels') {
            return (
                <DiscoveryUnitRenderer
                    unit={unit}
                    pageType={pageType}
                    data-item-index={-1}
                    showTitle={true}
                    className={classNames('component-margin', styles['topic-labels'])}
                />
            );
        }

        if (unit.type === 'bestseller_labels') {
            return (
                <DiscoveryUnitRenderer
                    unit={unit}
                    unitPropsByType={unitPropsByType}
                    pageType={this.props.pageType}
                    className="component-margin"
                />
            );
        }

        const hideTitle =
            ([PAGE_TYPE_CATEGORY, PAGE_TYPE_SUBCATEGORY, PAGE_TYPE_SUBS_CATEGORY].includes(
                this.props.pageType,
            ) &&
                i === 0) ||
            !this.props.showTitle;

        if (
            [
                PAGE_TYPE_ORG_CATEGORY,
                PAGE_TYPE_ORG_SUBCATEGORY,
                PAGE_TYPE_SUBS_SUBCATEGORY,
            ].includes(pageType) &&
            unit.type === 'bestseller'
        ) {
            return (
                <DiscoveryUnitRenderer
                    {...this.props}
                    unit={unit}
                    pageType={pageType}
                    showTitle={false}
                    className="component-margin"
                    deviceType={this.props.deviceType}
                    data-item-index={0}
                />
            );
        }

        return (
            <DiscoveryUnitRenderer
                {...this.props}
                alternateHeadline={this.props.alternateHeadline}
                unit={unit}
                pageType={pageType}
                showTitle={!hideTitle}
                className="component-margin"
                deviceType={this.props.deviceType}
                data-item-index={unit.type && this.props.itemIndicesByType[unit.type]}
            />
        );
    };

    handleLastChildEnter = () => {
        if (this.props.disableInfiniteScroll) {
            return;
        }
        const options = {
            pageSize: 6,
            // Use the same item count as UDHeavy. We should consider lowering the item
            // count for all pages in the future to reduce page load time.
            itemCount: this.props.itemCount,
            ...this.props.fetchOptions,
        };
        this.store.fetchUnits(options);
    };

    refreshPage = () => {
        window.location.reload(true);
    };

    render() {
        const {
            gettext,
            pgettext,
            skeletonComponent: SkeletonComponent,
            filter,
            children,
        } = this.props;
        if (this.store.error) {
            return (
                <>
                    <AlertBanner
                        title={gettext('There was a problem loading course recommendations')}
                        body={gettext('Please reload the page to resolve this issue')}
                        ctaText={pgettext('e.g. Refresh a webpage', 'Reload Page')}
                        onAction={this.refreshPage}
                        udStyle="warning"
                    />
                    <SkeletonComponent className="component-margin" />
                </>
            );
        }

        if (this.store.firstLoad) {
            return <SkeletonComponent className="component-margin" />;
        }

        if (!this.store.units.length) {
            return null;
        }

        return (
            <Provider discoveryUnitsStore={this.store}>
                <TrackingContextProvider
                    trackingContext={{
                        trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                        backendSource: this.store.backendSource,
                    }}
                >
                    <InfiniteScrollContainer onLastChildEnter={this.handleLastChildEnter}>
                        {sortChildren([
                            ...this.store.units.filter(filter).map(this.renderUnit),
                            ...React.Children.toArray(children),
                        ])
                            .filter(Boolean)
                            .map((child, i) => (
                                <DiscoveryUnitWrapper shouldSendPerfMetric={i === 0} key={i}>
                                    {child}
                                </DiscoveryUnitWrapper>
                            ))}
                    </InfiniteScrollContainer>
                </TrackingContextProvider>
            </Provider>
        );
    }
}

// mobx-react `Provider` is a functional component. We need a class component because
// the react-intersection-observer `Observer` inside InfiniteScrollContainer uses `ref`.
class DiscoveryUnitWrapper extends React.Component {
    static propTypes = {
        shouldSendPerfMetric: PropTypes.bool.isRequired,
    };

    render() {
        return (
            <Provider shouldSendPerfMetric={this.props.shouldSendPerfMetric}>
                {this.props.children}
            </Provider>
        );
    }
}

export default withI18n(withUDData(InternalDiscoveryUnitsContainer));
