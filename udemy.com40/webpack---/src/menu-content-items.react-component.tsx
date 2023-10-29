import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';

import {useI18n, I18nApi} from '@udemy/i18n';
import ArticleIcon from '@udemy/icons/dist/article.ud-icon';
import EmptyCourseImageIcon from '@udemy/icons/dist/empty-course-image.ud-icon';
import PersonIcon from '@udemy/icons/dist/person.ud-icon';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import TrendingGraphIcon from '@udemy/icons/dist/trending-graph.ud-icon';
import {Avatar, AvatarUser, BlockList, Image} from '@udemy/react-core-components';
import {safelySetInnerHTML} from '@udemy/shared-utils';

import {boldSearchTerms} from './bold-search-terms';
import {
    AutoCompleteResult,
    SearchFormAutocompleteStore,
} from './search-form-autocomplete.mobx-store';

import './search-form-autocomplete.global.less';

export interface MenuContentItemsProps {
    /**
     * Unique Identifier for menu content items
     */
    id: string;
    /**
     * Track impressions of menu items
     */
    trackMenuItemsImpression: () => void;
    /**
     * Function to fire when a menu item is clicked
     */
    onMenuContentItemClick: (index: number, result: AutoCompleteResult) => () => void;
    /**
     * Store to retrieve menu items content
     */
    store: SearchFormAutocompleteStore;
}

interface MenuContentIconProps {
    id: number;
    title: string;
    display_name?: string;
    img_link?: string;
    initials?: string;
    type?: AutoCompleteResult['type'];
}

/**
 * Returns label for given menu content type
 */
const getMenuContentTypeLabel = (type: AutoCompleteResult['type'], gettext: I18nApi['gettext']) => {
    if (type === 'course') {
        return gettext('Course');
    } else if (type === 'user') {
        return gettext('Instructor');
    }

    return null;
};

/**
 * Returns the Menu Content Icon for the given result
 */
const MenuContentIcon = ({
    id,
    title,
    display_name: displayName,
    type,
    img_link: imageLink,
    initials,
}: MenuContentIconProps) => {
    let icon = null;
    let className = null;
    const [hasImage, setHasImage] = useState(!!imageLink);
    const onErrorImage = () => setHasImage(false);
    if (type === 'course' && hasImage) {
        icon = <Image alt="" src={imageLink} width={32} height={32} onError={onErrorImage} />;
        className = 'ud-search-form-autocomplete-group-course-img';
    } else if (type === 'course') {
        icon = <EmptyCourseImageIcon size={'medium'} label={false} />;
        className = 'ud-search-form-autocomplete-group-icon';
    } else if (type === 'user') {
        const user: AvatarUser = {
            id,
            image_75x75: imageLink,
            display_name: displayName,
            initials,
            title,
        };
        icon = (
            <Avatar
                size="small"
                user={user}
                alt="NONE"
                onError={onErrorImage}
                data-testid="avatar"
                {...(!hasImage && {
                    icon: <PersonIcon size="small" color="inherit" label={false} />,
                })}
            />
        );
        className = 'ud-search-form-autocomplete-group-img';
    } else {
        icon = <SearchIcon data-testid="search" size={'medium'} label={false} />;
        className = 'ud-search-form-autocomplete-group-icon';
    }
    return (
        <div data-testid="menu-content-icon" data-type={type} className={className}>
            {icon}
        </div>
    );
};

/**
 * Menu content items using images and labels per result
 */
export const MenuContentItemsWithImage = observer(
    ({id, store, onMenuContentItemClick, trackMenuItemsImpression}: MenuContentItemsProps) => {
        useEffect(trackMenuItemsImpression, [
            store.suggestions.map((s: {id: number}) => s.id).join(','),
            trackMenuItemsImpression,
        ]);
        const {gettext} = useI18n();
        return (
            <>
                {store.suggestions.map((result: AutoCompleteResult, index: number) => {
                    const isSelected = index === store.selectedSuggestionIndex;
                    return (
                        <div
                            key={`${index}-${result.link}`}
                            data-testid="result-with-image"
                            className="ud-search-form-autocomplete-suggestion-block-list-item"
                        >
                            <BlockList.Item
                                /**
                                 * WARN: Changing this id will affect ARIA.
                                 * Refer to SearchFormAutoComplete's TextInput attribute "aria-activedescendant"
                                 * **/
                                id={`${id}-${index}`}
                                aria-label={result.ariaLabel}
                                aria-selected={isSelected}
                                role="option"
                                key={index}
                                href={result.link}
                                color="neutral"
                                className={classNames('ud-search-form-autocomplete-suggestion', {
                                    'ud-search-form-autocomplete-suggestion-focus': isSelected,
                                })}
                                onClick={onMenuContentItemClick(index, result)}
                            >
                                <div
                                    aria-hidden="true"
                                    className={classNames('ud-search-form-autocomplete-group', {
                                        'ud-search-form-autocomplete-group-search':
                                            result.type === 'search_log',
                                    })}
                                    data-testid="group-search"
                                >
                                    {<MenuContentIcon {...result} />}
                                    <div className="ud-search-form-autocomplete-suggestion-content">
                                        <div
                                            data-purpose="label"
                                            data-testid="label"
                                            className={classNames(
                                                'ud-search-form-autocomplete-suggestion-content',
                                                'ud-heading-md',
                                            )}
                                        >
                                            {result.label}
                                        </div>
                                        {result.type !== 'search_log' && (
                                            <div className="ud-search-form-autocomplete-suggestion-details">
                                                <div className="ud-heading-xs">
                                                    {getMenuContentTypeLabel(result.type, gettext)}
                                                </div>
                                                {result.instructor_name &&
                                                    result.instructor_name.length > 0 && (
                                                        <div
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                'ud-text-xs',
                                                                'ud-search-form-autocomplete-suggestion-instructor-name',
                                                            )}
                                                            data-testid="instructor-name"
                                                        >
                                                            {result.instructor_name[0]}
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </BlockList.Item>
                        </div>
                    );
                })}
            </>
        );
    },
);

/**
 * For Empty State Search Autocomplete Suggestions Experiment - MX only
 */
export const MenuContentItemsOnEmptyState = observer(
    ({id, store, onMenuContentItemClick, trackMenuItemsImpression}: MenuContentItemsProps) => {
        const {gettext} = useI18n();
        useEffect(trackMenuItemsImpression, [
            store.suggestions.map((s: {id: number}) => s.id).join(','),
            trackMenuItemsImpression,
        ]);
        const searchLogs = store.suggestions.filter(
            (result: AutoCompleteResult) => result.type === 'search_log',
        );
        const courseLogs = store.suggestions.filter(
            (result: AutoCompleteResult) => result.type === 'course',
        );
        const baseCourseLogsIndex = store.suggestions.indexOf(courseLogs[0]);
        const isSelected = (index: number) => index === store.selectedSuggestionIndex;

        return (
            <>
                {searchLogs && (
                    <div className="ud-search-form-autocomplete-title">
                        <div
                            className={classNames(
                                'ud-heading-md',
                                'ud-search-form-autocomplete-title-text',
                            )}
                            data-purpose="title"
                        >
                            {gettext('Popular on Udemy')}
                        </div>
                    </div>
                )}
                {searchLogs.map((result: AutoCompleteResult, index: number) => {
                    return (
                        <div
                            key={`${index}-${result.link}`}
                            className="ud-search-form-autocomplete-suggestion-block-list-item"
                        >
                            <BlockList.Item
                                /**
                                 * WARN: Changing this id will affect ARIA.
                                 * Refer to SearchFormAutoComplete's TextInput attribute "aria-activedescendant"
                                 * **/
                                id={`${id}-${index}`}
                                aria-label={result.ariaLabel}
                                aria-selected={isSelected(index)}
                                role="option"
                                key={index}
                                href={result.link}
                                color="neutral"
                                className={classNames('ud-search-form-autocomplete-suggestion', {
                                    'ud-search-form-autocomplete-suggestion-focus':
                                        isSelected(index),
                                })}
                                onClick={onMenuContentItemClick(index, result)}
                            >
                                <div
                                    aria-hidden="true"
                                    className="ud-search-form-autocomplete-group"
                                >
                                    <div className="ud-search-form-autocomplete-group-icon">
                                        <TrendingGraphIcon label={false} />
                                    </div>
                                    <div className="ud-search-form-autocomplete-suggestion-content">
                                        <div
                                            data-purpose="label"
                                            className="ud-search-form-autocomplete-suggestion-content"
                                        >
                                            {result.label}
                                        </div>
                                    </div>
                                </div>
                            </BlockList.Item>
                        </div>
                    );
                })}
                {courseLogs && (
                    <div className="ud-search-form-autocomplete-title">
                        <div
                            className={classNames(
                                'ud-heading-md',
                                'ud-search-form-autocomplete-title-text',
                            )}
                            data-purpose="title"
                        >
                            {gettext('Popular Courses on Udemy')}
                        </div>
                    </div>
                )}
                {courseLogs.map((result: AutoCompleteResult, idx: number) => {
                    const index = idx + baseCourseLogsIndex;
                    return (
                        <div
                            key={`${index}-${result.link}`}
                            className="ud-search-form-autocomplete-suggestion-block-list-item"
                        >
                            <BlockList.Item
                                /**
                                 * WARN: Changing this id will affect ARIA.
                                 * Refer to SearchFormAutoComplete's TextInput attribute "aria-activedescendant"
                                 * **/
                                id={`${id}-${index}`}
                                aria-label={result.ariaLabel}
                                aria-selected={isSelected(index)}
                                role="option"
                                key={index}
                                href={result.link}
                                color="neutral"
                                className={classNames('ud-search-form-autocomplete-suggestion', {
                                    'ud-search-form-autocomplete-suggestion-focus':
                                        isSelected(index),
                                })}
                                onClick={onMenuContentItemClick(index, result)}
                            >
                                <div
                                    aria-hidden="true"
                                    className="ud-search-form-autocomplete-group"
                                >
                                    <MenuContentIcon {...result} />
                                    <div className="ud-search-form-autocomplete-suggestion-content">
                                        <div
                                            data-purpose="label"
                                            className="ud-search-form-autocomplete-suggestion-content"
                                        >
                                            {result.label}
                                        </div>
                                        <div className="ud-search-form-autocomplete-suggestion-details">
                                            <div className="ud-heading-xs">
                                                {getMenuContentTypeLabel(result.type, gettext)}
                                            </div>
                                            {result.instructor_name &&
                                                result.instructor_name.length > 0 && (
                                                    <div
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            'ud-text-xs',
                                                            'ud-search-form-autocomplete-suggestion-instructor-name',
                                                        )}
                                                    >
                                                        {result.instructor_name[0]}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </BlockList.Item>
                        </div>
                    );
                })}
            </>
        );
    },
);

/**
 * Menu content items using icons without labels
 */
export const MenuContentItems = observer(
    ({id, store, onMenuContentItemClick, trackMenuItemsImpression}: MenuContentItemsProps) => {
        useEffect(trackMenuItemsImpression, [
            store.suggestions.map((s: {id: number}) => s.id).join(','),
            trackMenuItemsImpression,
        ]);
        return (
            <>
                {store.suggestions.map(
                    (result: AutoCompleteResult, index: React.Key | null | undefined) => {
                        const isSelected = index === store.selectedSuggestionIndex;
                        const label = boldSearchTerms(result.label as string, store.inputValue);
                        let icon = null;
                        if (result.type === 'course') {
                            icon = <ArticleIcon label={false} />;
                        } else if (result.type === 'user') {
                            icon = <PersonIcon label={false} />;
                        } else {
                            icon = <SearchIcon label={false} />;
                        }
                        return (
                            <BlockList.Item
                                key={index}
                                /**
                                 * WARN: Changing this id will affect ARIA.
                                 * Refer to SearchFormAutoComplete's TextInput attribute "aria-activedescendant"
                                 * **/
                                id={`${id}-${index}`}
                                href={result.link}
                                aria-selected={isSelected}
                                role="option"
                                icon={icon}
                                color="neutral"
                                aria-label={result.ariaLabel}
                                className={classNames('ud-search-form-autocomplete-suggestion', {
                                    'ud-search-form-autocomplete-suggestion-focus': isSelected,
                                })}
                                onClick={onMenuContentItemClick(index as number, result)}
                            >
                                <div
                                    aria-hidden="true"
                                    data-type={result.type}
                                    className="ud-search-form-autocomplete-suggestion-content"
                                    {...safelySetInnerHTML({
                                        descriptionOfCaller: 'search-form-autocomplete:label',
                                        html: label,
                                        dataPurpose: 'label',
                                    })}
                                />
                            </BlockList.Item>
                        );
                    },
                )}
            </>
        );
    },
);
