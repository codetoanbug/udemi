import {Link} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import React from 'react';
import {useLocation} from 'react-router-dom';

import './side-navigation.less';

interface SideNavigationItemProps {
    path: string;
    text: string;
    isAccordion: boolean;
    isLastItem: boolean;
    badgeColorClass?: string;
    badgeColorText?: string;
    onClick?: () => void;
}

export const PerformanceSideNavigationItem = observer(
    ({
        path,
        text,
        isAccordion,
        isLastItem,
        badgeColorClass,
        badgeColorText,
        onClick,
    }: SideNavigationItemProps) => {
        const currentLocation = useLocation();

        function getWithBasePath(path: string) {
            const basePath = `/performance`;
            return basePath + path;
        }

        function getWithPrimaryPath(path: string) {
            const primaryPath = `/instructor`;
            return primaryPath + getWithBasePath(path);
        }

        function isActive() {
            const currentPath = currentLocation.pathname;
            const primaryPath = getWithPrimaryPath(path);
            // In conversion tab, get-links-path returns url without slash before query params.
            return primaryPath.includes(currentPath.substring(0, currentPath.length - 1));
        }

        function setActiveStyle(style: string): string {
            const active = ' active';
            if (isActive()) {
                return style + active;
            }
            return style;
        }

        function getStyle(isItem: boolean): string {
            if (isAccordion) {
                if (isItem) {
                    return setActiveStyle(bulletAccordionItemStyle);
                }
                return setActiveStyle(bulletAccordionStyle);
            }

            if (isItem) {
                return setActiveStyle(bulletItemStyle);
            }
            return setActiveStyle(bulletStyle);
        }

        function getBulletIcon() {
            if (isActive()) {
                return <span styleName="bullet-icon"></span>;
            }
            return null;
        }

        function getSeperator() {
            return (
                <div styleName={'bottom'}>
                    {' '}
                    <hr styleName={'seperator'}></hr>{' '}
                </div>
            );
        }

        const bulletStyle = 'bullet';
        const bulletItemStyle = 'bullet-item';
        const bulletAccordionStyle = 'bullet-accordion';
        const bulletAccordionItemStyle = 'bullet-accordion-item';
        const customStyle = isAccordion ? 'bullet-accordion-item-link' : 'bullet-item-link';
        return (
            <div>
                {isLastItem && getSeperator()}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div data-purpose="side-navigation-item-performance-component" onClick={onClick}>
                    <li>
                        <div styleName={getStyle(false)}>
                            {getBulletIcon()}
                            <span styleName={getStyle(true)}>
                                <Link styleName={customStyle} to={getWithBasePath(path)}>
                                    {text}
                                </Link>
                                {badgeColorClass && badgeColorText && (
                                    <Badge styleName={badgeColorClass}>{badgeColorText}</Badge>
                                )}
                            </span>
                        </div>
                    </li>
                </div>
                {!isLastItem && !isAccordion && getSeperator()}
            </div>
        );
    },
);
