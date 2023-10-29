import {
    PAGE_TYPE_CATEGORY,
    PAGE_TYPE_ORG_CATEGORY,
    PAGE_TYPE_ORG_SUBCATEGORY,
    PAGE_TYPE_SUBCATEGORY,
    PAGE_TYPE_SUBS_CATEGORY,
    PAGE_TYPE_SUBS_SUBCATEGORY,
    DiscoveryUnit,
} from '@udemy/discovery-api';
import {withI18n, WithI18nProps} from '@udemy/i18n';
import {UDData, withUDData} from '@udemy/ud-data';
import {action, computed, observable, when} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React from 'react';

import IsomorphicRouter from 'base-components/router/isomorphic-router.react-component';
import DiscoveryListContainer from 'browse/components/discovery-list-container/discovery-list-container.react-component';
import DiscoveryUnitsContainerStore from 'browse/components/discovery-units-container/discovery-units-container.mobx-store';
import DiscoveryUnitsContainer from 'browse/components/discovery-units-container/discovery-units-container.react-component';
import SubcategoryLinkBar from 'browse/components/link-bar/subcategory-link-bar.react-component';
import RefundNotice from 'browse/components/notices/refund-notice.react-component';
import TopCompaniesNotice from 'browse/components/notices/top-companies-notice.react-component';
import {DEVICE_TYPE_MOBILE, DEVICE_TYPE_DESKTOP} from 'browse/lib/device-type';
import {DeviceType} from 'browse/lib/device-type-props';
import {UI_REGION} from 'browse/ui-regions';
import ExperimentProvider from 'experiment/experiment-provider.react-component';
import parseNavigationCategories from 'header/parse-navigation-categories';
import {CareerTrackBackLink} from 'occupation/components/career-track-back-link/career-track-back-link.react-component';
import {
    CareerTrackDataProps,
    CareerTrackUnit,
} from 'occupation/components/career-track-unit/career-track-unit.react-component';
import {CAREER_TRACK_LANDING_PAGE} from 'occupation/constants';
import {CONTEXT_TYPES} from 'organization-common/resource-context-menu/constants';
import ResourceContextMenuProvider from 'organization-common/resource-context-menu/resource-context-menu-provider.react-component';
import {isomorphic} from 'utils/isomorphic-rendering';
import serverOrClient from 'utils/server-or-client';
import {withGlobalProviders} from 'utils/with-global-providers';
import './category.less';
/**
 * Since parseNavigationCategories is still in JS and can't export a type for this, we are allowing TS
 * to infer the type pased on the return value.
 *
 * TODO: Update this once parseNavigationCategories is converted to TS
 */
type NavigationCategory = ReturnType<typeof parseNavigationCategories>['navigationCategories'][0];

export interface CategoryProps extends WithI18nProps {
    pageObject: {
        id: number;
        category_id: number;
        title_cleaned: string;
        title: string;
        type: typeof PAGE_TYPE_CATEGORY | typeof PAGE_TYPE_SUBCATEGORY;
    };
    subsCollectionIds?: string;
    isConsumerSubsSubscriber: boolean;
    careerTrackUnitData: CareerTrackDataProps[];
    showPersonalPlanBadge?: boolean;
    showCodingExercisesBadge?: boolean;
    udData: UDData;
}

@observer
export class UnWrappedCategory extends React.Component<CategoryProps> {
    static defaultProps = {
        careerTrackUnitData: [],
    };

    static displayName = 'Category';

    constructor(props: CategoryProps) {
        super(props);
        this.isConsumerSubsSubscriber = props.isConsumerSubsSubscriber;
        this.discoveryUnitsContainerStore = new DiscoveryUnitsContainerStore({
            pageType: this.pageType,
            units: [],
            pageObjectId: props.pageObject.id,
        });
        this.ref = React.createRef();
    }

    @action async componentDidMount() {
        if (this.deviceType !== DEVICE_TYPE_MOBILE) {
            const categoryId =
                this.props.pageObject.type === 'subcategory'
                    ? this.props.pageObject.category_id
                    : this.props.pageObject.id;
            const parsedNavigationCategories = parseNavigationCategories();
            this.category = parsedNavigationCategories.navigationCategories.find(
                (cat) => cat.id === categoryId,
            );
        }
    }

    scrollToAllCourses = async () => {
        if (this.shouldScrollToCoursesWithCodingExercises) {
            await when(() => this.ref && !this.discoveryUnitsContainerStore.loading);
            this.ref.current?.scrollIntoView();
        }
    };

    private get deviceType(): DeviceType {
        const isMobile = this.props.udData.request.isMobile;
        return isMobile ? DEVICE_TYPE_MOBILE : DEVICE_TYPE_DESKTOP;
    }

    private ref: React.RefObject<HTMLDivElement>;
    discoveryUnitsContainerStore: DiscoveryUnitsContainerStore;
    @observable.ref category?: NavigationCategory;
    @observable isConsumerSubsSubscriber = false;

    get window() {
        return serverOrClient.global;
    }

    get shouldScrollToCoursesWithCodingExercises() {
        return (
            this.window.location &&
            this.searchParams.get('src') === 'lohp' &&
            this.searchParams.get('has_coding_exercises')
        );
    }

    handlePageChange = () => {
        this.ref.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    resourceContextMenuProps = {
        context: CONTEXT_TYPES.ALL_COURSES,
    };

    get pageType() {
        const {Config: udConfig} = this.props.udData;
        const type = this.props.pageObject.type;
        if (type === 'category') {
            if (this.isConsumerSubsSubscriber) {
                return PAGE_TYPE_SUBS_CATEGORY;
            }
            return udConfig.brand.has_organization ? PAGE_TYPE_ORG_CATEGORY : PAGE_TYPE_CATEGORY;
        } else if (type === 'subcategory') {
            if (this.isConsumerSubsSubscriber) {
                return PAGE_TYPE_SUBS_SUBCATEGORY;
            }
            return udConfig.brand.has_organization
                ? PAGE_TYPE_ORG_SUBCATEGORY
                : PAGE_TYPE_SUBCATEGORY;
        }
    }

    @computed
    get searchParams() {
        return new URLSearchParams(this.window.location.search);
    }

    render() {
        const {gettext, interpolate} = this.props;
        const {isMobile} = this.props.udData.request;

        const showSectionTitle = this.discoveryUnitsContainerStore.units.some(
            (unit: DiscoveryUnit) => {
                return unit.type === 'skills_hub' || unit.item_type === 'course';
            },
        );
        const headerText = interpolate(
            gettext('%(categoryName)s Courses'),
            {categoryName: this.props.pageObject.title},
            true,
        );

        const courseCardSize = isMobile ? 'small' : 'large';
        const responsiveUnit = {
            fullWidth: isMobile,
            showPager: !isMobile,
            layout: isMobile ? 'multirow' : 'singlerow',
        };

        const overridesUnitProps = {
            /* eslint-disable @typescript-eslint/naming-convention */
            PopularTopicsUnit: {
                titleTypography: isMobile ? 'ud-heading-lg' : undefined,
            },
            CourseUnit: {
                fullWidth: isMobile,
                showPager: !isMobile,
                layout: isMobile ? 'multirow' : 'singlerow',
                titleTypography: isMobile ? 'ud-heading-lg' : undefined,
            },
            SingleCourseUnit: {
                titleTypography: isMobile ? 'ud-heading-lg' : undefined,
            },
            OccupationUnit: responsiveUnit,
            /* eslint-enable @typescript-eslint/naming-convention */
        };

        const showCareerTrackBackLink =
            this.window.location &&
            this.searchParams.get('src')?.includes(CAREER_TRACK_LANDING_PAGE);

        const discoveryListTitle = this.shouldScrollToCoursesWithCodingExercises
            ? gettext('%(categoryTitle)s courses with coding exercises')
            : gettext('All %(categoryTitle)s courses');

        return (
            <IsomorphicRouter>
                <>
                    {this.category && <SubcategoryLinkBar category={this.category} />}
                    <main className="ud-container ud-page-wrapper" id="main-content-anchor">
                        {showCareerTrackBackLink && (
                            <CareerTrackBackLink
                                className="career-track-link"
                                window={this.window}
                            />
                        )}
                        <h1
                            className={isMobile ? 'ud-heading-serif-xl' : 'ud-heading-serif-xxl'}
                            styleName="heading-primary"
                        >
                            {headerText}
                        </h1>
                        {this.props.careerTrackUnitData.length > 0 && (
                            <CareerTrackUnit
                                styleName="career-track-unit"
                                careerTrackUnit={this.props.careerTrackUnitData}
                                uiRegion={UI_REGION.CAREER_TRACKS}
                                sourcePageType={this.props.pageObject.type}
                                sourcePageId={this.props.pageObject.id}
                            />
                        )}
                        {showSectionTitle && (
                            <h2
                                className={isMobile ? 'ud-heading-lg' : 'ud-heading-xl'}
                                styleName="heading-secondary"
                            >
                                {gettext('Courses to get you started')}
                            </h2>
                        )}
                        <ExperimentProvider experimentSet={['frc', 'sw']}>
                            <Provider
                                isConsumerSubsSubscriber={this.isConsumerSubsSubscriber}
                                showPersonalPlanBadge={this.props.showPersonalPlanBadge}
                                showCodingExercisesBadge={this.props.showCodingExercisesBadge}
                            >
                                <ResourceContextMenuProvider
                                    resourceContextMenuProps={this.resourceContextMenuProps}
                                >
                                    <DiscoveryUnitsContainer
                                        pageType={this.pageType}
                                        pageObjectId={this.props.pageObject.id}
                                        store={this.discoveryUnitsContainerStore}
                                        deviceType={this.deviceType}
                                        itemCount={6}
                                        unitPropsByType={overridesUnitProps}
                                    />
                                    <div className="component-margin" ref={this.ref}>
                                        <h2
                                            className={isMobile ? 'ud-heading-lg' : 'ud-heading-xl'}
                                            styleName="heading-secondary"
                                            data-purpose="heading-secondary"
                                        >
                                            {interpolate(
                                                discoveryListTitle,
                                                {categoryTitle: this.props.pageObject.title},
                                                true,
                                            )}
                                        </h2>
                                        {!this.isConsumerSubsSubscriber && (
                                            <RefundNotice styleName="refund-notice" />
                                        )}
                                        <DiscoveryListContainer
                                            pageType={this.pageType}
                                            pageSize={16}
                                            pageObjectId={this.props.pageObject.id}
                                            courseCardSize={courseCardSize}
                                            onPageChange={this.handlePageChange}
                                            subsCollectionIds={this.props.subsCollectionIds}
                                            query={this.props.pageObject.title}
                                            onAutoScroll={this.scrollToAllCourses}
                                        >
                                            {!this.isConsumerSubsSubscriber && (
                                                <TopCompaniesNotice
                                                    data-item-index={3}
                                                    pageType={this.props.pageObject.type}
                                                    refParam="right-rail"
                                                />
                                            )}
                                        </DiscoveryListContainer>
                                    </div>
                                </ResourceContextMenuProvider>
                            </Provider>
                        </ExperimentProvider>
                    </main>
                </>
            </IsomorphicRouter>
        );
    }
}

export const Category = isomorphic(withI18n(withUDData(UnWrappedCategory)));
const CategoryWithGlobalProviders = withGlobalProviders(Category);

/**
 * withGlobalProviders adds a new html element to the server side html data, it creates inconsistent state between
 * server and the client in app when we used withGlobalProviders implicitly inside the app like
 * withGlobalProviders(Category). Since this file is processed by its default component, component passed to
 * app and this file, being inconsistent.
 *
 * Therefore, we needed to import with wrapping global providers.
 */
export default CategoryWithGlobalProviders;
