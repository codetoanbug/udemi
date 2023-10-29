import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RadioButton from 'survey/radio-button.react-component';
import escapeHtml from 'utils/escape/escape-html';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import {langDict} from './constants';
import {STATE, RESPONSE_TYPE} from './insights.mobx-store';
import {MetricsTooltip} from './metrics-tooltip.react-component';
import {trackClick} from './tracking';
import WidePanel from './wide-panel.react-component';
/* eslint-disable no-unused-vars,import/order */
import baseStyles from './insights.less';
import styles from './insights-input-panel.less';
/* eslint-enable no-unused-vars,import/order */

@observer
export default class InsightsInputPanel extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    formRef = React.createRef();

    focus(selector) {
        const form = this.formRef.current;
        const focusable = form && form.querySelector(selector);
        focusable && focusable.focus();
    }

    @autobind
    onDeselectQuery() {
        this.props.store.hideSearchedQueryLabel();
        setTimeout(() => this.focus('input'), 0);
    }

    @autobind
    search(event) {
        event.preventDefault();
        const query = this.props.store.autosuggestStore.query;
        if (query !== this.props.store.urlQuery.q) {
            this.props.store.setUrlQuery({
                q: query,
                lang: this.props.store.urlQuery.lang,
            });
        } else {
            // Perhaps the request failed, so the user is retrying.
            this.props.store.search();
        }
        setTimeout(() => this.focus('.js-selected-query'), 0);
    }

    @autobind
    updateLanguage(event) {
        this.props.store.setUrlQuery({
            q: this.props.store.urlQuery.q,
            lang: event.currentTarget.dataset.lang,
            ref: this.props.store.urlQuery.ref,
        });
        trackClick({
            action: 'select',
            category: 'topic_results',
            objectType: 'language',
            objectId: event.currentTarget.dataset.lang,
            actionType: 'update_language',
        })();
    }

    @autobind
    onSuggestionSelected(suggestion) {
        this.props.store.setUrlQuery({
            q: suggestion.display_name,
            lang: this.props.store.urlQuery.lang,
        });
        setTimeout(() => this.focus('.js-selected-query'), 0);
    }

    @autobind
    renderSuggestions(suggestions, renderSuggestion) {
        return (
            <ul className="ud-unstyled-list" styleName="styles.suggestions">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {renderSuggestion(
                            index,
                            <span styleName="styles.ellipsis">{suggestion.display_name}</span>,
                            {
                                round: true,
                                udStyle: 'secondary',
                                size: 'small',
                                typography: 'ud-heading-sm',
                            },
                        )}
                    </li>
                ))}
            </ul>
        );
    }

    renderQueryInput() {
        const {store} = this.props;
        return (
            <form ref={this.formRef} onSubmit={this.search} styleName="styles.row">
                <FormGroup label={gettext('Udemy topic')} labelProps={{className: 'ud-sr-only'}}>
                    <Autosuggest
                        autosuggestStore={store.autosuggestStore}
                        renderSuggestions={this.renderSuggestions}
                        noResultsContent={null}
                        onSuggestionSelected={this.onSuggestionSelected}
                        disabled={store.showSearchedQueryAsLabel}
                        placeholder={gettext('e.g. Photography, Travel Photography, JavaScript')}
                        autoFocus={!store.showSearchedQueryAsLabel}
                    />
                    {store.showSearchedQueryAsLabel && (
                        <div styleName="styles.selected-query-box">
                            <Button
                                className="js-selected-query"
                                size="small"
                                round={true}
                                onClick={this.onDeselectQuery}
                            >
                                <span styleName="styles.ellipsis">{store.urlQuery.q}</span>
                                <CloseIcon label={gettext('Deselect')} />
                            </Button>
                        </div>
                    )}
                </FormGroup>
                <MetricsTooltip
                    isOpen={store.showOnboardingTooltip}
                    onToggle={store.toggleOnboardingTooltip}
                    placement="bottom"
                    styleName="styles.tooltip"
                    trigger={
                        <div styleName="styles.tooltip-icon">
                            <InfoIcon label={gettext('Get info')} />
                        </div>
                    }
                >
                    {gettext(
                        'Courses are grouped together on Udemy by Topic (e.g. "Microsoft Excel" or "Visual Design") ' +
                            'which represent the primary subject of the course. If the topic you have in mind does not appear ' +
                            'as a suggestion, try different ways of phrasing the topic or press enter to see recommended Topics ' +
                            'related to your search.',
                    )}
                </MetricsTooltip>
            </form>
        );
    }

    renderLanguageFilter() {
        const {store} = this.props;
        if (!(store.insights && store.insights.course_label_metrics)) {
            return;
        }

        const languages = store.insights.course_label_metrics.available_languages;
        return (
            <div>
                <div className="ud-heading-md" styleName="baseStyles.text-center baseStyles.rmt-lg">
                    {gettext('View topic results for courses taught in: ')}
                </div>
                <div styleName="styles.row styles.lang-box">
                    {languages.length > 1 && (
                        <div styleName="styles.lang-dropdown-box">
                            <Dropdown
                                placement="bottom-start"
                                menuWidth="small"
                                trigger={
                                    <Dropdown.Button size="small">
                                        {langDict[store.urlQuery.lang]}
                                    </Dropdown.Button>
                                }
                            >
                                <Dropdown.Menu>
                                    {languages
                                        .filter((lang) => lang !== store.urlQuery.lang)
                                        .map((lang) => (
                                            <Dropdown.MenuItem
                                                key={lang}
                                                data-lang={lang}
                                                onClick={this.updateLanguage}
                                            >
                                                {langDict[lang]}
                                            </Dropdown.MenuItem>
                                        ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    )}
                    <div styleName="styles.lang-radios-box">
                        <FormGroup
                            udStyle="fieldset"
                            label={gettext('Language')}
                            labelProps={{className: 'ud-sr-only'}}
                        >
                            <div styleName="styles.lang-radios">
                                {languages.map((lang) => (
                                    <RadioButton
                                        checked={lang === store.urlQuery.lang}
                                        onChange={this.updateLanguage}
                                        key={lang}
                                        data-lang={lang}
                                        name="course-label-metric-language"
                                    >
                                        {langDict[lang]}
                                    </RadioButton>
                                ))}
                            </div>
                        </FormGroup>
                    </div>
                    <MetricsTooltip
                        placement="bottom"
                        styleName="styles.tooltip"
                        trigger={
                            <div styleName="styles.tooltip-icon">
                                <InfoIcon label={gettext('Get info')} />
                            </div>
                        }
                    >
                        {gettext(
                            'Filter supply-and-demand data for your selected topic by language. ' +
                                'If you search for a topic and we don’t have enough data for a particular language, ' +
                                'we won’t show that language’s filter.',
                        )}
                    </MetricsTooltip>
                </div>
            </div>
        );
    }

    renderInputFeedback() {
        const {store} = this.props;
        let inputQueryFeedback = '';
        if (store.isAutocorrect) {
            const replacement =
                store.responseType === RESPONSE_TYPE.COURSE_LABEL
                    ? store.insights.course_label_metrics.course_label.display_name
                    : store.insights.query_metrics.query;
            inputQueryFeedback = interpolate(
                gettext('%s is not an existing Udemy Topic. Showing results for %s.'),
                [
                    `<strong>${escapeHtml(store.urlQuery.q)}</strong>`,
                    `<strong>${replacement}</strong>`,
                ],
            );
        } else if (
            store.searchState === STATE.NO_RESULTS ||
            store.responseType === RESPONSE_TYPE.SUGGESTIONS ||
            store.responseType === RESPONSE_TYPE.QUERY
        ) {
            inputQueryFeedback = interpolate(gettext('%s is not an existing Udemy Topic.'), [
                `<strong>${escapeHtml(store.urlQuery.q)}</strong>`,
            ]);
        }
        if (!inputQueryFeedback) {
            return;
        }
        return (
            <div
                styleName="baseStyles.text-center baseStyles.rmt-lg"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'insights-input-panel:feedback',
                    html: inputQueryFeedback,
                    dataPurpose: 'feedback',
                })}
            />
        );
    }

    render() {
        return (
            <div data-purpose="insights-input-panel" styleName="styles.panel">
                <WidePanel>
                    <h1
                        className="ud-heading-serif-xxl"
                        styleName="baseStyles.text-center styles.main-heading"
                    >
                        {gettext('What course topic are you interested in?')}
                    </h1>
                    {this.renderQueryInput()}
                    {this.renderLanguageFilter()}
                    {this.renderInputFeedback()}
                </WidePanel>
            </div>
        );
    }
}
