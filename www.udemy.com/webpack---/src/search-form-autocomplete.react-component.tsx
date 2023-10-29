import autobind from 'autobind-decorator';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {FormEventHandler} from 'react';
import ReactDOM from 'react-dom';

import {Keys, getUniqueId, RootCloseWrapper} from '@udemy/design-system-utils';
import {generateTrackingId} from '@udemy/event-tracking';
import {withMatchMedia} from '@udemy/hooks';
import {withI18n, WithI18nProps} from '@udemy/i18n/';
import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {CookieConsent} from '@udemy/onetrust';
import {BlockList, IconButton} from '@udemy/react-core-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {noop} from '@udemy/shared-utils';

import {discoveryTracker} from './external/browse/tracking';
import {
    MenuContentItemsOnEmptyState,
    MenuContentItems,
    MenuContentItemsProps,
    MenuContentItemsWithImage,
} from './menu-content-items.react-component';
import {
    AutoCompleteResult,
    SearchFormAutocompleteStore,
} from './search-form-autocomplete.mobx-store';
import './search-form-autocomplete.global.less';

interface MenuContentProps extends MenuContentItemsProps {
    trackMenuItemsImpression: () => void;
    onMenuContentItemClick: (index: number, result: AutoCompleteResult) => () => void;
    textSize: 'small' | 'large';
    showResultsWithImage?: boolean;
}

@observer
class MenuContent extends React.Component<MenuContentProps> {
    static defaultProps = {
        trackMenuItemsImpression: noop,
        onMenuContentItemClick: noop,
        textSize: 'large',
        showResultsWithImage: false,
    };

    render() {
        const {
            id,
            store,
            textSize,
            onMenuContentItemClick,
            trackMenuItemsImpression,
            showResultsWithImage,
        } = this.props;

        const MenuContentItemsComponent = showResultsWithImage
            ? MenuContentItemsWithImage
            : MenuContentItems;

        return (
            <BlockList
                /**
                 * WARN: This id is used by TextInput.
                 * Changing this may break ARIA
                 */
                id={`${id}-menu-content-items`}
                data-testid="menu-content-items"
                size={textSize}
                className={classNames(
                    'js-suggestions',
                    {
                        'ud-search-form-autocomplete-suggestions': !showResultsWithImage,
                    },
                    {
                        'ud-search-form-autocomplete-suggestions-with-image': showResultsWithImage,
                    },
                )}
                role="listbox"
            >
                {store.shouldLoadPopularQueries ? (
                    <MenuContentItemsOnEmptyState
                        id={id}
                        store={store}
                        onMenuContentItemClick={onMenuContentItemClick}
                        trackMenuItemsImpression={trackMenuItemsImpression}
                    />
                ) : (
                    <MenuContentItemsComponent
                        id={id}
                        store={store}
                        onMenuContentItemClick={onMenuContentItemClick}
                        trackMenuItemsImpression={trackMenuItemsImpression}
                    />
                )}
            </BlockList>
        );
    }
}

export interface SearchFormAutocompleteProps {
    searchFormAutocompleteStore: SearchFormAutocompleteStore;
    /**
     * Unique id for TextInput A11Y.
     */
    id: string;
    /**
     * Label text for TextInput A11Y.
     */
    label: string;
    /**
     * Extra props passed to TextInput.
     */
    inputProps: {
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
        onFocus?: React.FocusEventHandler<HTMLInputElement>;
        className?: string;
        name?: string;
        required?: boolean;
    };
    /**
     * Extra props passed to submit Button.
     */
    submitButtonProps: {
        udStyle?: 'primary' | 'ghost';
    };
    /**
     * Search url.
     */
    formAction: string | null;
    /**
     * Search url query params. {k: v} is submitted as ?k=v.
     */
    formActionParams: Record<string, string>;
    /**
     * By default the submit button is rendered after the input.
     * Set to true to reverse the order.
     */
    reversed: boolean;
    /**
     * Size of the text in the search input and suggestions list. Defaults to 'large'.
     */
    textSize: 'small' | 'large';
    className?: string;
    showResultsWithImage?: boolean;
    onSubmit?: FormEventHandler<HTMLDivElement>;
    isHeaderMobile: boolean | null;
}

@withMatchMedia({isHeaderMobile: 'header-mobile-max'})
@observer
class InternalSearchFormAutocomplete extends React.Component<
    SearchFormAutocompleteProps & WithI18nProps
> {
    static defaultProps = {
        id: undefined,
        label: undefined,
        inputProps: {},
        submitButtonProps: {
            udStyle: 'ghost' as SearchFormAutocompleteProps['submitButtonProps']['udStyle'],
        },
        formAction: null,
        formActionParams: {},
        reversed: false,
        textSize: 'large' as SearchFormAutocompleteProps['textSize'],
        showResultsWithImage: false,
        isHeaderMobile: null,
    };
    defaultId = getUniqueId('search-form-autocomplete');

    get id() {
        return this.props.id || this.defaultId;
    }

    @observable isOnTask = false;

    @autobind startTimeOnTask() {
        const isMenuOpen = this.props.searchFormAutocompleteStore.isMenuOpen;
        if (isMenuOpen && !this.isOnTask) {
            this.isOnTask = true;
            UD.performance.start('timeontask:autocomplete');
        } else if (!isMenuOpen) {
            this.isOnTask = false;
        }
    }

    @autobind endTimeOnTask() {
        UD.performance.end('timeontask:autocomplete');
        this.isOnTask = false;
    }

    @autobind onFocus(event: React.FocusEvent<HTMLInputElement>) {
        this.props.searchFormAutocompleteStore.openMenu();
        this.startTimeOnTask();
        this.props.searchFormAutocompleteStore.suggest(event.target.value);
        this.props.inputProps.onFocus?.(event);
    }

    @autobind changeMenuVisibility() {
        const {searchFormAutocompleteStore: store} = this.props;
        if (!this.props.isHeaderMobile && store.isMenuOpen) {
            this.closeMenu();
        } else if (this.props.isHeaderMobile && !store.isMenuOpen && this.isOnTask) {
            // menu closed by header checkbox state (header-toggle-search-bar)
            this.closeMenu();
        }
    }

    @autobind closeMenu() {
        this.endTimeOnTask();
        const {searchFormAutocompleteStore: store} = this.props;
        store.closeMenu();
        if (store.suggestions.length > 0) {
            discoveryTracker.trackAutoCompleteResultsBounce(store.trackingId);
        }
    }

    @autobind onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.searchFormAutocompleteStore.suggest(event.target.value);
        if (!this.props.searchFormAutocompleteStore.inputValue) {
            this.props.searchFormAutocompleteStore.setSuggestions([]);
        }
        this.props.inputProps.onChange?.(event);
    }

    @autobind onSubmit() {
        if (!CookieConsent.allowsPerformanceCookies()) {
            return;
        }
        Cookies.set('query_session_identifier_id', generateTrackingId());
    }

    @autobind onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const key = event.keyCode;
        const {searchFormAutocompleteStore: store} = this.props;
        if (key === Keys.RETURN && store.selectedSuggestion) {
            event.preventDefault();
            this.clickSelectedSuggestion(store.selectedSuggestionIndex);
        } else if (key === Keys.ESCAPE && !store.inputValue) {
            event.preventDefault();
            !this.props.isHeaderMobile && this.closeMenu();
            document.getElementById(this.id)?.blur();
        } else if (key === Keys.ESCAPE) {
            event.preventDefault();
            !this.props.isHeaderMobile && this.closeMenu();
            document.getElementById(this.id)?.focus();
        } else if (key === Keys.UP || key === Keys.DOWN) {
            // Arrow should always cycle through suggestions.
            event.preventDefault();
            key === Keys.UP ? store.selectPreviousSuggestion() : store.selectNextSuggestion();
        } else if (key === Keys.TAB && store.suggestions.length > 0 && store.isMenuOpen) {
            // Tab should only cycle through suggestions when they are shown.
            // Otherwise the tab order would be trapped forever in the autosuggest.
            event.preventDefault();
            event.shiftKey ? store.selectPreviousSuggestion() : store.selectNextSuggestion();
        }
    }

    clickSelectedSuggestion(index: number) {
        // eslint-disable-next-line react/no-find-dom-node
        const containerNode = ReactDOM.findDOMNode(this) as HTMLElement;
        containerNode?.querySelectorAll<HTMLElement>('.js-suggestions a')[index]?.click();
    }

    @autobind
    onMenuContentItemClick(index: number, autoCompleteResult: AutoCompleteResult) {
        return () => {
            this.endTimeOnTask();
            discoveryTracker.trackAutoCompleteResultClick(index, autoCompleteResult);
        };
    }

    @autobind
    trackMenuItemsImpression() {
        const {searchFormAutocompleteStore: store} = this.props;
        if (store.suggestions.length > 0) {
            discoveryTracker.trackAutoCompleteResultsImpression(
                this.props.searchFormAutocompleteStore.trackingId,
                this.props.searchFormAutocompleteStore.query,
            );
        }
    }

    get isExpanded() {
        const {searchFormAutocompleteStore: store} = this.props;
        return store.isMenuOpen && store.suggestions.length > 0;
    }

    get menuContent() {
        const {textSize, showResultsWithImage, searchFormAutocompleteStore: store} = this.props;
        if (!this.isExpanded) {
            return null;
        }

        return (
            <MenuContent
                id={this.id}
                store={store}
                textSize={textSize}
                onMenuContentItemClick={this.onMenuContentItemClick}
                trackMenuItemsImpression={this.trackMenuItemsImpression}
                showResultsWithImage={showResultsWithImage}
            />
        );
    }

    render() {
        const {
            formAction,
            formActionParams,
            // id,
            inputProps,
            label = this.props.gettext('Search'),
            searchFormAutocompleteStore: store,
            reversed,
            submitButtonProps,
            textSize,
            /* eslint-disable @typescript-eslint/no-unused-vars */
            showResultsWithImage,
            isHeaderMobile,
            gettext,
            dgettext,
            dngettext,
            dpgettext,
            ngettext,
            npgettext,
            pgettext,
            interpolate,
            ninterpolate,
            /* eslint-enable @typescript-eslint/no-unused-vars */
            ...htmlProps
        } = this.props;
        return (
            <RootCloseWrapper onRootClose={this.changeMenuVisibility}>
                <FormGroup
                    {...htmlProps}
                    label={label}
                    labelProps={{className: 'ud-sr-only'}}
                    formControlId={this.id}
                    className={classNames('ud-search-form-autocomplete', htmlProps.className)}
                    onKeyDown={this.onKeyDown}
                >
                    <form
                        action={formAction as string}
                        className={classNames('ud-search-form-autocomplete-input-group', {
                            'ud-search-form-autocomplete-input-group-reversed': reversed,
                        })}
                        onSubmit={this.onSubmit}
                    >
                        {Object.entries(formActionParams).map(([name, value]) => {
                            return (
                                <input
                                    key={name}
                                    type="hidden"
                                    name={name}
                                    value={value as string}
                                />
                            );
                        })}
                        <TextInput
                            name="q"
                            data-testid="search-input"
                            placeholder={label}
                            {...inputProps}
                            autoComplete="off"
                            size={textSize}
                            className={classNames(
                                'ud-search-form-autocomplete-input',
                                inputProps.className,
                            )}
                            onChange={this.onChange}
                            onFocus={this.onFocus}
                            value={store.searchPhrase}
                            role="combobox"
                            aria-autocomplete="both"
                            aria-haspopup="true"
                            aria-activedescendant={
                                store.selectedSuggestionIndex >= 0
                                    ? `${this.id}-${store.selectedSuggestionIndex}`
                                    : undefined
                            }
                            aria-expanded={this.isExpanded}
                            aria-controls={`${this.id}-menu-content-items`}
                        />
                        {this.menuContent}
                        <IconButton
                            {...submitButtonProps}
                            type="submit"
                            disabled={!store.searchPhrase}
                        >
                            <SearchIcon
                                color={
                                    submitButtonProps.udStyle === 'primary' ? 'inherit' : 'neutral'
                                }
                                label={gettext('Submit search')}
                            />
                        </IconButton>
                    </form>
                </FormGroup>
            </RootCloseWrapper>
        );
    }
}

export const SearchFormAutocomplete = withI18n(InternalSearchFormAutocomplete);
