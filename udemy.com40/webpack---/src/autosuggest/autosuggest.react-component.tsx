/* eslint-disable @typescript-eslint/naming-convention */
import {
    Keys,
    RootCloseWrapper,
    RootCloseEventHandler,
    ROOT_CLOSE_REASON,
} from '@udemy/design-system-utils';
import {useI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {ButtonHtmlProps, ButtonSizeType, Button, IconButton} from '@udemy/react-core-components';
import {TextInput, TextInputProps} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';

import {AutosuggestStore} from './autosuggest.mobx-store';
import styles from './autosuggest.module.less';
import {AUTOSUGGEST_LOADING_STATE} from './constants';

/** The function signature for a `renderSuggestion` method. */
export type AutosuggestRenderSuggestionRenderMethod = (
    index: number,
    children: React.ReactNode,
    suggestionProps?: ButtonHtmlProps,
) => JSX.Element;

/** React props interface for the Autosuggest component. */
export interface AutosuggestProps<TSuggestionDataModel> extends TextInputProps {
    /** The MobX store containing and tracking suggestions. */
    autosuggestStore: AutosuggestStore<TSuggestionDataModel>;
    /** Render method for displaying suggestions. */
    renderSuggestions: (
        suggestions: TSuggestionDataModel[],
        renderSuggestion: AutosuggestRenderSuggestionRenderMethod,
    ) => void;
    /** Optional icon to display at the beginning of the internal `TextInput` component. */
    icon?: React.ReactNode;
    /**
     * Content to display when there are no results.
     *
     * @remarks
     * Pass `null` to not render anything.
     */
    noResultsContent?: React.ReactNode;
    /** Event handler for when there is a change event on suggestions. */
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    /** Event handler for when the internal `TextInput` is cleared. */
    onClearInput?: () => void;
    /** Event handler for when a suggestion is selected. */
    onSuggestionSelected: (suggestion: TSuggestionDataModel) => void;
    /** Optional flag to show the ability to clear the internal `TextInput` */
    showClearInputButton?: boolean;
    /** CSS ClassName to apply to the Autosuggest wrapping `<div>`. */
    className?: string;
    /** Event handler for when internal `TextInput` receives focus.  */
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

@observer
export class Autosuggest<TSuggestionDataModel> extends React.Component<
    AutosuggestProps<TSuggestionDataModel>
> {
    static defaultProps = {
        onChange: undefined,
        onClearInput: undefined,
        onSuggestionSelected: undefined,
        icon: undefined,
        noResultsContent: undefined,
        showClearInputButton: false,
        className: undefined,
        onFocus: undefined,
    };

    ref = React.createRef<HTMLDivElement>();

    onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.props.autosuggestStore.openMenu();
        this.props.onFocus?.(event);
    };

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.autosuggestStore.suggest(event.target.value);
        this.props.onChange?.(event);
    };

    onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const key = event.keyCode;
        const {autosuggestStore: store} = this.props;
        if (key === Keys.RETURN && store.selectedSuggestion) {
            event.preventDefault();
            this.clickSelectedSuggestion(store.selectedSuggestionIndex);
        } else if (key === Keys.ESCAPE) {
            event.preventDefault();
            store.closeMenu();
            this.ref.current?.querySelector('input')?.focus();
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
    };

    onRootClose: RootCloseEventHandler = (event, container, closeReason) => {
        if (
            closeReason === ROOT_CLOSE_REASON.KEYBOARD &&
            container?.contains(event.target as Node)
        ) {
            if (this.menuContent) {
                event.stopPropagation();
            }
        }
        this.props.autosuggestStore.closeMenu();
    };

    onClickSuggestion = (event: React.MouseEvent) => {
        const index = parseInt(
            (event.currentTarget as HTMLButtonElement).dataset.index as string,
            10,
        );
        this.props.autosuggestStore.selectSuggestion(index, this.props.onSuggestionSelected);
    };

    clickSelectedSuggestion = (index: number) => {
        (
            this.ref.current?.querySelectorAll('.ud-autosuggest-suggestion')[index] as HTMLElement
        ).click();
    };

    renderSuggestion = (
        index: number,
        children: React.ReactNode,
        suggestionProps: ButtonHtmlProps = {},
    ) => {
        const {autosuggestStore: store} = this.props;
        return (
            <Button
                udStyle="link"
                typography="ud-text-md"
                className={classNames('ud-autosuggest-suggestion', {
                    [styles['suggestion-focus']]: index === store.selectedSuggestionIndex,
                })}
                {...suggestionProps}
                data-index={index}
                onClick={this.onClickSuggestion}
            >
                {children}
            </Button>
        );
    };

    @computed get menuContent() {
        const {autosuggestStore: store, noResultsContent, renderSuggestions} = this.props;
        if (store.isMenuOpen) {
            if (
                store.query.length >= store.minInputLength &&
                store.loadingState === AUTOSUGGEST_LOADING_STATE.LOADING
            ) {
                return (
                    <Loader block={true} size="medium" className={styles['loading-container']} />
                );
            }
            if (
                store.query.length >= store.minInputLength &&
                store.loadingState === AUTOSUGGEST_LOADING_STATE.LOADED &&
                store.suggestions.length === 0 &&
                noResultsContent !== null
            ) {
                // Define as a component to use the i18n hook
                const NoResults = () => {
                    const {gettext} = useI18n();

                    return <>{noResultsContent ?? gettext('No results')}</>;
                };

                /* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
                return (
                    <div className={classNames('ud-heading-sm', styles['no-results'])}>
                        <NoResults />
                    </div>
                );
                /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
            }
            if (store.suggestions.length > 0) {
                return renderSuggestions(store.suggestions, this.renderSuggestion);
            }
        }
        return null;
    }

    getIconSize(size: ButtonSizeType) {
        if (size === 'xsmall') return 'small';
        if (size === 'small') return 'medium';
        return 'large';
    }

    render() {
        const {
            className,
            autosuggestStore,
            renderSuggestions,
            onClearInput,
            onSuggestionSelected,
            showClearInputButton,
            icon,
            noResultsContent,
            onFocus,
            ...inputProps
        } = this.props;
        const withCustomIcon = !!icon;

        const CloseIconWithI18n = () => {
            const {gettext} = useI18n();

            return <CloseIcon color="neutral" label={gettext('Clear input')} />;
        };

        return (
            <RootCloseWrapper onRootClose={this.onRootClose}>
                <div
                    className={classNames(className, styles['autosuggest-container'], {
                        [styles['with-clear-button']]: showClearInputButton,
                        [styles['with-custom-icon']]: withCustomIcon,
                    })}
                    onKeyDown={this.onKeyDown}
                    ref={this.ref}
                >
                    {icon}
                    <TextInput
                        value={autosuggestStore.inputValue}
                        {...inputProps}
                        autoComplete="off"
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        className={styles['autosuggest-input']}
                    />
                    {showClearInputButton && (
                        <IconButton
                            onClick={onClearInput}
                            udStyle="ghost"
                            size={this.getIconSize(
                                (inputProps as TextInputProps).size as ButtonSizeType,
                            )}
                            className={styles['clear-button']}
                        >
                            <CloseIconWithI18n />
                        </IconButton>
                    )}
                    <div className={classNames({'ud-sr-only': !this.menuContent}, styles.menu)}>
                        {this.menuContent as React.ReactNode}
                    </div>
                </div>
            </RootCloseWrapper>
        );
    }
}
