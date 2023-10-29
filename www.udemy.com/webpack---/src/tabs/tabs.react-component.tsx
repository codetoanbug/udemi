import {getUniqueId, Keys} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {KeyboardEventHandler, useEffect, useRef, useState} from 'react';

import {Carousel, CarouselMutationEvent} from '../carousel/carousel.react-component';
import styles from './tabs.module.less';

/** React props interface for the Tabs component. */
interface TabProps {
    /**
     * Unique id.
     *
     * @remarks
     * `id` is compared with {@link Tabs} `activeTabId` and `defaultTabId`; match their types accordingly.
     *
     * @privateRemarks
     * It is typed as `unknown` since pre-typescript consumers have used a variety of value
     * types for this prop and for TabsProps#{activeTabId, defaultTabId}. These components
     * do not access any properties on these props. They are only compared with one-another,
     * hence `unknown` rather than `any`.
     */
    id?: unknown;
    /** Custom render function for a TabButton, if desired. */
    renderTabButton?: (tabButton: React.ReactElement) => React.ReactNode;
    /** The displayed title for the Tab instance. */
    title: React.ReactNode;
}

/**
 * The Tab component.
 *
 * @remarks
 * This component just returns its children. The {@link Tabs} component uses its structure
 * to build the tab titles and contents.
 */
export class Tab extends React.Component<React.PropsWithChildren<TabProps>> {
    render() {
        return this.props.children;
    }
}

/** The React props interface for the Tabs component. */
export interface TabsProps {
    /** Flag off which to set `showPager` and `allowScroll` on child `Carousel` component */
    prioritizeTouch?: boolean;
    /** `activeTabId` is compared to the `id` property of individual {@link Tab} components; match their types accordingly */
    activeTabId?: unknown;
    /**
     * Children of the Tabs component.
     *
     * @remarks
     * Though typed as a `React.ReactNode`, this should be instances of the {@link Tab} component. */
    children?: React.ReactNode;
    /** `defaultTabId` is compared to the `id` property of individual {@link Tab} components; match their types accordingly */
    defaultTabId?: unknown;
    /** Flag to turn styling on to enable the Tabs component to be the full width of its container. */
    fullWidth?: boolean;
    /**
     * Event handler for selecting an individual tab.
     *
     * @remarks
     * The type of `tabId` will depend on the values of the `id` property of the {@link Tab} component.*/
    onSelect?: (tabId: unknown) => void;
    /** The toggle strategy to use for individual Tabs
     *
     * - `add-remove` - Add/Remove tabs content from the DOM based on if it is active.
     * - `show-hide` - Show/Hide content based on active state, but leave it in the DOM.
     *
     * @defaultValue `show-hide` in `Tabs`
     */
    toggleStrategy?: 'show-hide' | 'add-remove';
    /** The size of the Tabs component. */
    size?: 'small' | 'large' | 'xlarge';
    /**
     * Flag to invert nav button text and border colors.
     *
     * @remarks
     * Used for displaying tabs on dark background, with white text.
     */
    invertedColors?: boolean;
}

/** The Tabs component.
 *
 * @privateRemarks
 * Object.assign is used to skirt TypeScript type checking so we can expose:
 * - Tabs.Tab - The {@link Tab} component.
 */
export const Tabs = Object.assign(
    observer(
        ({
            children = [],
            fullWidth = false,
            toggleStrategy = 'show-hide',
            size = 'large',
            invertedColors = false,
            prioritizeTouch = false,
            ...props
        }: TabsProps) => {
            const [id] = useState(() => getUniqueId('tabs'));
            const carouselRef = useRef<Carousel>(null);
            const tabContainerRef = useRef<HTMLDivElement>(null);
            const [isMounted, setIsMounted] = useState<boolean>(false);
            const [isCarouselLastPage, setIsCarouselLastPage] = useState<boolean>(false);
            const [isCarouselPageable, setIsCarouselPageable] = useState<boolean>(false);
            const {gettext} = useI18n();

            useEffect(() => {
                setIsMounted(true);
            }, []);

            const tabs = React.Children.toArray(children).filter(Boolean) as React.ReactElement<
                React.ComponentProps<typeof Tab>
            >[];

            const defaultTabIndex = () => {
                if (!props.defaultTabId) {
                    return 0;
                }
                return Math.max(
                    0,
                    tabs.findIndex((tab) => tab.props.id === props.defaultTabId),
                );
            };

            const [selectedActiveTabIndex, setSelectedActiveTabIndex] = useState(() =>
                defaultTabIndex(),
            );

            // Derived from user-selected tab index, the override prop
            // activeTabId and the defaultTabIndex()
            const activeTabIndex = () => {
                if (!props.activeTabId) {
                    return selectedActiveTabIndex;
                }
                const index = tabs.findIndex((tab) => tab.props.id === props.activeTabId);
                return index === -1 ? defaultTabIndex() : index;
            };

            const hasOverflow = () => {
                const carousel = carouselRef.current;
                return isMounted && !!carousel && isCarouselPageable && !isCarouselLastPage;
            };

            const updateActiveTabIndex = (index: number) => {
                if (index !== activeTabIndex()) {
                    setSelectedActiveTabIndex(index);
                    props.onSelect?.(tabs[index].props.id);
                }
            };

            const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
                if (event.keyCode === Keys.LEFT || event.keyCode === Keys.RIGHT) {
                    const tabs = tabContainerRef.current?.querySelectorAll(
                        '[role="tab"]',
                    ) as NodeListOf<HTMLElement>;
                    if (tabs) {
                        const targetTab =
                            tabs[activeTabIndex() + (event.keyCode === Keys.RIGHT ? 1 : -1)];
                        if (targetTab) {
                            targetTab.click();
                            targetTab.focus();
                            if (hasOverflow()) {
                                targetTab.scrollIntoView();
                            }
                        }
                    }
                }
            };

            const handleCarouselMutation = ({isLastPage, isPageable}: CarouselMutationEvent) => {
                setIsCarouselLastPage(isLastPage);
                setIsCarouselPageable(isPageable);
            };

            const navButtons: JSX.Element[] = [],
                tabContents: JSX.Element[] = [];

            tabs.forEach((tab, index) => {
                const isActive = activeTabIndex() === index;
                const tabContentId = `${id}-content-${index}`;
                const tabId = `${id}-tab-${index}`;
                const tabButton = (
                    <Button
                        id={tabId}
                        aria-selected={isActive}
                        onClick={() => updateActiveTabIndex(index)}
                        onKeyDown={onKeyDown}
                        role="tab"
                        size={size === 'small' ? 'medium' : 'large'}
                        className={classNames('ud-nav-button', styles['nav-button'], {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'ud-nav-button-active': isActive,
                            [styles.active]: isActive,
                            [styles.xlarge]: size === 'xlarge',
                        })}
                        tabIndex={isActive ? 0 : -1}
                        udStyle="ghost"
                    >
                        {tab.props.title}
                    </Button>
                );
                navButtons.push(
                    <div
                        key={`${id}-title-${index}`}
                        className={classNames(
                            'ud-nav-button-container',
                            styles['nav-button-container'],
                            {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'ud-nav-button-container-active': isActive,
                                [styles.active]: isActive,
                            },
                            [styles[size]],
                        )}
                    >
                        {tab.props.renderTabButton
                            ? tab.props.renderTabButton(tabButton)
                            : tabButton}
                    </div>,
                );
                tabContents.push(
                    <div
                        key={tabContentId}
                        id={tabContentId}
                        role="tabpanel"
                        className={classNames('ud-tab-content', styles['tab-content'], {
                            [styles.active]: isActive,
                        })}
                        tabIndex={isActive ? 0 : -1}
                        data-purpose="tab-container"
                        aria-labelledby={tabId}
                    >
                        {(toggleStrategy === 'show-hide' || isActive) && tab.props.children}
                    </div>,
                );
            });

            if (!navButtons.length || !tabContents.length) {
                return null;
            }

            const navButtonsWrapped = fullWidth ? (
                navButtons
            ) : (
                <Carousel
                    pagerButtonSize={size === 'large' ? 'large' : 'medium'}
                    ref={carouselRef}
                    allowScroll={prioritizeTouch}
                    showPager={true}
                    pagerButtonClassName={styles['pagination-buttons']}
                    ariaLive="off"
                    gridSize={size === 'xlarge' ? 'large' : 'medium'}
                    onMutation={handleCarouselMutation}
                    ariaLabel={gettext('Tab Navigation')}
                >
                    {navButtons}
                </Carousel>
            );

            const gradient =
                !fullWidth && prioritizeTouch && hasOverflow() ? (
                    <div data-purpose="tab-overflow-gradient" className={styles.gradient} />
                ) : null;

            return (
                <div
                    className={classNames(styles['tabs-container'], {
                        [styles['full-width']]: fullWidth,
                        [styles.inverted]: invertedColors,
                    })}
                >
                    <div
                        className={classNames('ud-tabs-nav-buttons', styles['tabs-nav-buttons'])}
                        role="tablist"
                        ref={tabContainerRef}
                        data-purpose="tab-nav-buttons"
                    >
                        {navButtonsWrapped}
                        {gradient}
                    </div>
                    {tabContents}
                </div>
            );
        },
    ),

    // define Tabs.Tab helper property:
    // eslint-disable-next-line @typescript-eslint/naming-convention
    {Tab, displayName: 'Tabs'},
);
