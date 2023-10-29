import {Breadcrumb} from '@udemy/react-navigation-components';
import classNames from 'classnames';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

interface Category {
    id: number;
    title: string;
    url: string;
}

interface Topic {
    id: number;
    title: string;
    topic_channel_url: string;
}

export interface TopicMenuProps {
    enabled: boolean;
    hasDarkBackground: boolean;
    breadcrumbs: Array<Category | Topic>;
}

export const TopicMenu = ({enabled, hasDarkBackground, breadcrumbs}: TopicMenuProps) => {
    if (!enabled || breadcrumbs.length < 2) {
        return null;
    }
    return (
        <div
            className={classNames(
                'course-landing-page__main-content course-landing-page__topic-menu',
                {
                    'dark-background-inner-text-container': hasDarkBackground,
                },
            )}
        >
            <Breadcrumb
                className={classNames('topic-menu', {
                    'topic-menu-condensed': breadcrumbs.length > 2,
                })}
            >
                {breadcrumbs.map((b, i) => {
                    const href = (b as Category).url ?? (b as Topic).topic_channel_url;
                    return (
                        <Breadcrumb.Item key={i} href={href}>
                            {b.title}
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        </div>
    );
};

export default isomorphic(TopicMenu);
