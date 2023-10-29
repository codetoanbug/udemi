import {observer} from 'mobx-react';
import React from 'react';
import ReactDOM from 'react-dom';

import {FocusCycle, forceTabOrder, KeyStrings} from '@udemy/design-system-utils';
import {useMatchMedia} from '@udemy/hooks';
import {useI18n} from '@udemy/i18n';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {ProBadge} from '@udemy/learning-path';
import {BlockList, BlockListItemProps} from '@udemy/react-core-components';
import {menuAim, MenuAimArea, MenuAimInjectedProps} from '@udemy/react-popup-components';
import {noop, range} from '@udemy/shared-utils';
import {mediaQueryPxToRem} from '@udemy/styles';
import {useUDData} from '@udemy/ud-data';

import {BADGING_NAV, BROWSE_LEARNING_TYPES} from '../../browse-constants';
import {getBrowseURL} from '../../get-browse-url';
import {HeaderStore} from '../../header.mobx-store';
import {BrowseNavItem as BrowseNavItemType} from '../../types/browse-nav-item';
import {UfbContext} from '../../types/ufb-context';
import {forceHover} from '../header-dropdown.react-component';
import menuStyles from '../list-menu.module.less';
import {BrowseNavStore} from './browse-nav.mobx-store';
import styles from './browse-nav.module.less';
import {DesktopNavSectionHeading} from './desktop-nav.react-component';

export class BrowseNavItemFinders {
    findSelectedLevelOneItem = (browseNavStore: BrowseNavStore) => {
        const item = browseNavStore.selectedLevelOneItem;
        if (!item) {
            return null;
        }
        return document.querySelector<HTMLElement>(
            `.js-browse-nav-level-one [data-id="${item.id}"]`,
        );
    };

    findSelectedLevelTwoItem = (browseNavStore: BrowseNavStore) => {
        const item = browseNavStore.selectedLevelTwoItem;
        if (!item) {
            return null;
        }
        return document.querySelector<HTMLElement>(
            `.js-browse-nav-level-two [data-id="${item.id}"]`,
        );
    };

    findFirstLevelTwoItem = () => {
        return document.querySelector<HTMLElement>('.js-browse-nav-level-two [data-id]');
    };

    findLastLevelTwoItem = () => {
        const items = document.querySelectorAll<HTMLElement>('.js-browse-nav-level-two [data-id]');
        return items ? items[items.length - 1] : null;
    };

    findFirstLevelThreeItem = () => {
        return document.querySelector<HTMLElement>('.js-browse-nav-level-three [data-id]');
    };

    findLastLevelThreeItem = () => {
        const items = document.querySelectorAll<HTMLElement>(
            '.js-browse-nav-level-three [data-id]',
        );
        return items ? items[items.length - 1] : null;
    };
}

export interface BrowseNavProps {
    browseNavStore: BrowseNavStore;
    headerStore: HeaderStore;
    ufbContext?: UfbContext;
}

export const BrowseNav = observer(({browseNavStore, headerStore, ufbContext}: BrowseNavProps) => {
    const {Config, me} = useUDData();
    const {gettext} = useI18n();
    const canFitLevelThree = useMatchMedia(`(min-width: ${mediaQueryPxToRem(930)}rem)`) ?? true;
    const ref = React.useRef<HTMLDivElement>(null);
    const [disposeForceTabOrder, setDisposeForceTabOrder] = React.useState<() => void>();
    const [itemFinders] = React.useState(new BrowseNavItemFinders());

    // Flags
    const isUBUser = me.is_authenticated && !!me.organization;
    const isUBProUser =
        isUBUser &&
        (Config.features.organization.learning_path.pro_path ||
            (me.is_authenticated && me.organization?.is_pro_license_holder));
    const isPPUser = headerStore.userSpecificContext.user?.consumer_subscription_active;
    const isTPUser = isUBUser && Config.brand.is_team;
    const showUpdatedPPAndUBNavigation =
        headerStore.userSpecificContext.user?.show_updated_pp_and_ub_navigation;
    const showUpdatedMXNavigation =
        headerStore.userSpecificContext.user?.show_updated_mx_navigation;
    const showLearningTypesMenu = isPPUser || (isUBProUser && showUpdatedPPAndUBNavigation);
    const showBadgesMenu = showUpdatedPPAndUBNavigation || showUpdatedMXNavigation;

    // Item finders
    const findSelectedLevelOneItem = () => itemFinders.findSelectedLevelOneItem(browseNavStore);
    const findSelectedLevelTwoItem = () => itemFinders.findSelectedLevelTwoItem(browseNavStore);
    const findFirstLevelTwoItem = () => itemFinders.findFirstLevelTwoItem();
    const findLastLevelTwoItem = itemFinders.findLastLevelTwoItem;
    const findFirstLevelThreeItem = itemFinders.findFirstLevelThreeItem;
    const findLastLevelThreeItem = itemFinders.findLastLevelThreeItem;

    React.useEffect(() => {
        // - If you TAB on the selected level N item, you go to level N + 1.
        // - If you ESC on level N + 1, you go back to level N.
        const dispose = forceTabOrder([
            [findSelectedLevelOneItem, findFirstLevelTwoItem],
            [findSelectedLevelTwoItem, findFirstLevelThreeItem],
            [findLastLevelThreeItem, findSelectedLevelTwoItem],
            [findLastLevelTwoItem, findSelectedLevelOneItem],
        ]);
        setDisposeForceTabOrder(dispose);

        const currentRef = ref.current;
        // We use event.stopPropagation when you ESC on sub-navs to prevent Popover from
        // closing entirely; we want only the sub-nav to close.
        // The stopPropagation works only via addEventListener, not via React's onKeyUp.
        currentRef?.addEventListener('keyup', onKeyUp);

        return () => {
            disposeForceTabOrder?.();
            currentRef?.removeEventListener('keyup', onKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onKeyUp(event: KeyboardEvent) {
        if (event.key === KeyStrings.ESCAPE || event.key === KeyStrings.LEFT) {
            if (browseNavStore.selectedLevelTwoItem) {
                // Deselect the selected level two item on ESCAPE.
                event.stopPropagation();
                findSelectedLevelTwoItem()?.focus();
                browseNavStore.selectLevelTwoItem(browseNavStore.selectedLevelTwoItem);
            } else if (browseNavStore.selectedLevelOneItem) {
                // Deselect the selected level one item on ESCAPE.
                event.stopPropagation();
                findSelectedLevelOneItem()?.focus();
                browseNavStore.selectLevelOneItem(browseNavStore.selectedLevelOneItem);
            }
        }
    }

    function renderLevelOneNavItem(item: BrowseNavItemType) {
        return (
            <BrowseNavItem
                navItem={item}
                key={item.id}
                onSelect={browseNavStore.selectLevelOneItem}
                href={item.absolute_url}
                id={`header-browse-nav-${item.type}-${item.id}`}
                isLearningTypeNavItem={true}
                isSelected={item === browseNavStore.selectedLevelOneItem}
            />
        );
    }

    function renderLearningTypesMenu() {
        let headingText;

        if (isUBProUser) {
            headingText = gettext('Explore Pro');
        } else {
            headingText = showUpdatedPPAndUBNavigation
                ? gettext('Explore active learning')
                : gettext('Explore by type');
        }
        return (
            <>
                <DesktopNavSectionHeading>
                    {headingText}
                    {isUBProUser && <ProBadge aria-hidden="true" />}
                </DesktopNavSectionHeading>
                <BlockList size="small" className={menuStyles['section']}>
                    {(headerStore.userSpecificContext.user?.enableLabsInPersonalPlan ||
                        isUBProUser) &&
                        renderLevelOneNavItem(BROWSE_LEARNING_TYPES(gettext).LABS)}
                    {renderLevelOneNavItem(BROWSE_LEARNING_TYPES(gettext).ASSESSMENTS)}
                    {isUBProUser &&
                        renderLevelOneNavItem(BROWSE_LEARNING_TYPES(gettext).UDEMY_PRO_PATHS)}
                </BlockList>
            </>
        );
    }

    function renderBadgesMenu() {
        // Hide Badges section for UB China
        if (Config.brand.organization && Config.brand.organization.is_enterprise_china) {
            return null;
        }

        return (
            <>
                <DesktopNavSectionHeading>{gettext('Explore badges')}</DesktopNavSectionHeading>
                <BlockList size="small" className={menuStyles['section']}>
                    {renderLevelOneNavItem(BADGING_NAV(gettext).CERTIFICATIONS)}
                </BlockList>
            </>
        );
    }

    function renderCategoriesMenu() {
        const showHeading =
            isPPUser ||
            (isUBUser && !isTPUser) ||
            (isTPUser && showUpdatedPPAndUBNavigation) ||
            showUpdatedMXNavigation;
        const showUpdatedCategoriesHeading =
            isPPUser || showUpdatedPPAndUBNavigation || showUpdatedMXNavigation;
        const hasBrowseNavigationCategories = browseNavStore.navigationCategories?.length > 0;
        return (
            <>
                {showHeading && (
                    <DesktopNavSectionHeading>
                        {showUpdatedCategoriesHeading
                            ? gettext('Explore by category')
                            : gettext('All categories')}
                    </DesktopNavSectionHeading>
                )}
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    {hasBrowseNavigationCategories
                        ? browseNavStore.navigationCategories.map((category) => (
                              <BrowseNavItem
                                  key={category.id}
                                  navItem={category}
                                  onSelect={browseNavStore.selectLevelOneItem}
                                  findFirstSubNavItem={findFirstLevelTwoItem}
                                  isSelected={category === browseNavStore.selectedLevelOneItem}
                                  subNavId="header-browse-nav-level-two"
                                  id={`header-browse-nav-${category.type}-${category.id}`}
                              />
                          ))
                        : range(13).map((i) => (
                              <BlockList.Item
                                  key={i}
                                  loading={true}
                                  className={menuStyles['item']}
                              />
                          ))}
                </BlockList>
            </>
        );
    }

    function renderLevelOneNav() {
        return (
            <div
                className={`js-browse-nav-level-one ${styles['nav']}`}
                data-testid="browse-nav-list"
            >
                {showBadgesMenu && renderBadgesMenu()}
                {showLearningTypesMenu && renderLearningTypesMenu()}
                {ufbContext?.getBrowseNavLevelOneItems?.(itemFinders)}
                {renderCategoriesMenu()}
            </div>
        );
    }

    function renderSubcategoryNav() {
        let labelledbyId;
        let content = null;
        const parentItem = browseNavStore.selectedLevelOneItem;

        // We don't want to show the subcategory nav for certain parent items
        const isExcludedParentItemType =
            Boolean(parentItem) &&
            [
                ...Object.values(BADGING_NAV(gettext)).map((item) => item.type),
                ...Object.values(BROWSE_LEARNING_TYPES(gettext)).map((item) => item.type),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ].includes(parentItem?.type as any);

        if (parentItem && !isExcludedParentItemType) {
            labelledbyId = `header-browse-nav-${parentItem.type}-${parentItem.id}`;
            const ufbContent = ufbContext?.getBrowseNavLevelTwoItems?.(parentItem);
            content = ufbContent || (
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    {parentItem.children?.map((subcategory) => (
                        <BrowseNavItem
                            key={subcategory.id}
                            navItem={subcategory}
                            onSelect={browseNavStore.selectLevelTwoItem}
                            isSelected={subcategory === browseNavStore.selectedLevelTwoItem}
                            findFirstSubNavItem={findFirstLevelThreeItem}
                            subNavId={
                                canFitLevelThree ? 'header-browse-nav-level-three' : undefined
                            }
                            id={`header-browse-nav-${subcategory.type}-${subcategory.id}`}
                        />
                    ))}
                </BlockList>
            );
        }
        return (
            <FocusCycle>
                <div
                    aria-labelledby={labelledbyId}
                    id="header-browse-nav-level-two"
                    className={`js-browse-nav-level-two ${styles['nav']}`}
                    style={{display: content ? 'block' : 'none'}}
                    data-testid="browse-nav-list"
                >
                    {content}
                </div>
            </FocusCycle>
        );
    }

    function renderTopicNav() {
        if (!canFitLevelThree) {
            return null;
        }
        let labelledbyId;
        let heading = null;
        let content = null;
        const parentItem = browseNavStore.selectedLevelTwoItem;
        if (parentItem) {
            const topics = browseNavStore.getTopics(parentItem);
            labelledbyId = `header-browse-nav-${parentItem.type}-${parentItem.id}`;
            heading = (
                <DesktopNavSectionHeading>{gettext('Popular topics')}</DesktopNavSectionHeading>
            );
            content = (
                <BlockList size="small" className={menuStyles['section']} iconAlignment="right">
                    {topics
                        ? topics.map((topic) => (
                              <BrowseNavItem
                                  onSelect={browseNavStore.selectLevelThreeItem}
                                  key={topic.id}
                                  navItem={topic}
                              />
                          ))
                        : range(9).map((i) => (
                              <BlockList.Item
                                  key={i}
                                  loading={true}
                                  className={menuStyles['item']}
                              />
                          ))}
                </BlockList>
            );
        }

        return (
            <FocusCycle>
                <div
                    aria-labelledby={labelledbyId}
                    id="header-browse-nav-level-three"
                    className={`js-browse-nav-level-three ${styles['nav']}`}
                    style={{display: content ? 'block' : 'none'}}
                    data-testid="browse-nav-list"
                >
                    {heading}
                    {content}
                </div>
            </FocusCycle>
        );
    }

    return (
        <div
            ref={ref}
            className={`${menuStyles['list-menu-container']} ${styles['nav-container']}`}
            data-testid="browse-nav"
        >
            {renderLevelOneNav()}
            {renderSubcategoryNav()}
            {renderTopicNav()}
        </div>
    );
});

interface BrowseNavItemRef {
    getTriggerNode(): HTMLElement | null;
    onMouseLeave(mousePos: {x: number; y: number}): void;
    getMenuNode(): HTMLElement | null;
}

interface OnSelectContext {
    toggle: boolean;
    selectedVia: string;
}

interface BrowseNavItemProps extends MenuAimInjectedProps {
    navItem: BrowseNavItemType;
    isSelected?: boolean;
    subNavId?: string;
    isLearningTypeNavItem?: boolean;
    onSelect?(navItem: BrowseNavItemType, context: OnSelectContext): void;
    findFirstSubNavItem?(): HTMLElement | null;
}

const InternalBrowseNavItem = React.forwardRef<
    BrowseNavItemRef,
    BrowseNavItemProps & BlockListItemProps<React.ElementType>
>(
    (
        {
            navItem,
            isSelected,
            subNavId,
            isLearningTypeNavItem,
            onSelect,
            findFirstSubNavItem,
            onMenuAimUpdate = noop,
            ...blockListItemProps
        },
        ref,
    ) => {
        const {Config} = useUDData();
        const [selectedVia, setSelectedVia] = React.useState<string>();
        const itemRef = React.useRef<HTMLDivElement>(null);

        const getMenuNode = React.useCallback(() => {
            if (subNavId) {
                return document.getElementById(subNavId);
            }
            return null;
        }, [subNavId]);

        React.useImperativeHandle(
            ref,
            () => {
                return {
                    getTriggerNode: () => itemRef.current,
                    onMouseLeave: (mousePos: {x: number; y: number}) =>
                        forceHover(`.${menuStyles.item}`, mousePos),

                    getMenuNode,
                };
            },
            [getMenuNode],
        );

        function focusOnFirstSubNavItem() {
            const firstSubNavItem = findFirstSubNavItem?.();
            firstSubNavItem && firstSubNavItem.focus();
        }

        function onClick(event: React.MouseEvent) {
            if (selectedVia === 'keyboard' && subNavId) {
                // See HeaderButton.onClick in header-dropdown.react-component.js.
                event.preventDefault();
            }

            setSelectedVia('click');
            onSelect?.(navItem, {toggle: false, selectedVia: 'click'});
        }

        function onKeyDown(event: React.KeyboardEvent) {
            if (
                event.key === KeyStrings.RETURN ||
                event.key === KeyStrings.SPACE ||
                event.key === KeyStrings.RIGHT
            ) {
                event.preventDefault();
                setSelectedVia('keyboard');
                onSelect?.(navItem, {
                    toggle: event.key !== KeyStrings.RIGHT,
                    selectedVia: 'keyboard',
                });
                if (findFirstSubNavItem) {
                    setTimeout(focusOnFirstSubNavItem, 0);
                }
            }
        }

        function onMouseOver(event: React.MouseEvent) {
            if (!isSelected) {
                setSelectedVia('mouse');
                onSelect?.(navItem, {toggle: false, selectedVia: 'mouse'});
                const target = event.target as HTMLElement;
                if (target.tagName && target.tagName.toLowerCase() !== 'path') {
                    // Ignore mouseover events on MenuAimSVG.
                    setTimeout(onMenuAimUpdate, 0); // Wait for menu to render.
                }
            }
        }

        function renderAimArea() {
            const container = getMenuNode();
            return container && ReactDOM.createPortal(<MenuAimArea />, container);
        }

        const enableMouseOver = subNavId || isLearningTypeNavItem;

        // We want onClick for a11y, not onFocus.
        /* eslint-disable jsx-a11y/mouse-events-have-key-events */
        return (
            <BlockList.Item
                ref={itemRef.current ? itemRef : null}
                href={getBrowseURL(navItem.absolute_url, Config.brand.has_organization)}
                data-testid="browse-nav-item"
                {...blockListItemProps}
                data-id={navItem.id}
                className={menuStyles['item']}
                color={subNavId && isSelected ? 'link' : 'neutral'}
                icon={subNavId ? <NextIcon label={false} /> : null}
                aria-expanded={!subNavId ? undefined : isSelected}
                onClick={onSelect ? onClick : undefined}
                onKeyDown={subNavId ? onKeyDown : undefined}
                onMouseOver={enableMouseOver ? onMouseOver : undefined}
            >
                {navItem.title}
                {isSelected && renderAimArea()}
            </BlockList.Item>
        );
        /* eslint-enable jsx-a11y/mouse-events-have-key-events */
    },
);

export const BrowseNavItem = menuAim({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTriggerNode: (component: any) => component.getTriggerNode(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMenuNode: (component: any) => component.getMenuNode(),
    onMouseLeave: (component, mousePos) => component.onMouseLeave(mousePos),
    // @ts-expect-error TS doesn't like this
})(InternalBrowseNavItem);
