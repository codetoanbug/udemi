import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import NextIcon from '@udemy/icons/dist/next.ud-icon';
import {Dropdown} from '@udemy/react-menu-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import './language-selector.less';

@inject('store')
@withRouter
@observer
export default class LanguageSelector extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.shape({
            push: PropTypes.func.isRequired,
        }),
    };

    static defaultProps = {
        history: undefined,
    };

    @observable isAllLanguages = false;

    @autobind
    @action
    setAddLanguagePane() {
        this.isAllLanguages = false;
    }

    @autobind
    @action
    setLanguageSelectorPane() {
        this.isAllLanguages = true;
        return false; // Don't close the menu.
    }

    @autobind
    setLanguage(localeId) {
        return action(() => {
            const {history, store} = this.props;
            this.isAllLanguages = false;
            store.setLocale(localeId);
            history.push(`${store.relativePath}/${localeId}/`);
        });
    }

    @autobind
    addLanguage(localeId) {
        return () => {
            this.props.store.addNewLocale(localeId).then(() => {
                this.setLanguage(localeId)();
            });
        };
    }

    @autobind
    defaultDropdown() {
        const {captionedLocaleList, localeTitles} = this.props.store;
        return [
            <Dropdown.Menu key="captioned-locales">
                {captionedLocaleList.map((localeId) => (
                    <Dropdown.MenuItem key={localeId} onClick={this.setLanguage(localeId)}>
                        {localeTitles[localeId]}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>,
            <Dropdown.Menu key="add-new-language">
                <Dropdown.MenuItem onClick={this.setLanguageSelectorPane}>
                    <span styleName="add-new-language-text">
                        {gettext('Add new language')}
                        <NextIcon label={false} />
                    </span>
                </Dropdown.MenuItem>
            </Dropdown.Menu>,
        ];
    }

    @autobind
    allDropdown() {
        const {filteredLocaleList, localeTitles} = this.props.store;
        // These menu items are loaded on the fly destroying the previous ones, for this reason the
        // focus is lost. I set the focus in the cancel button that is the first in the list and
        // the natural position for the focus after this list is render.
        // using - ref={(span) => { span && span.parentNode.parentNode.focus(); }}
        return [
            <Dropdown.Menu key="cancel">
                <Dropdown.MenuItem onClick={this.setAddLanguagePane}>
                    <span
                        className="ud-heading-md ud-link-neutral"
                        styleName="cancel-text"
                        ref={(span) => {
                            span && span.parentNode.parentNode.focus();
                        }}
                    >
                        {gettext('Cancel')}
                        <CloseIcon label={false} />
                    </span>
                </Dropdown.MenuItem>
            </Dropdown.Menu>,
            <Dropdown.Menu key="filtered-locales">
                {filteredLocaleList.map((locale) => (
                    <Dropdown.MenuItem
                        key={locale.locale}
                        componentClass="button"
                        onClick={this.addLanguage(locale.locale)}
                    >
                        {localeTitles[locale.locale]}
                    </Dropdown.MenuItem>
                ))}
            </Dropdown.Menu>,
        ];
    }

    render() {
        return (
            <Dropdown
                placement="bottom-start"
                menuWidth="large"
                menuMaxHeight={`${pxToRem(600)}rem`}
                trigger={
                    <Dropdown.Button>
                        <span styleName="trigger-text">{this.props.store.currentLocaleTitle}</span>
                    </Dropdown.Button>
                }
            >
                <div styleName="menus">
                    {this.isAllLanguages ? this.allDropdown() : this.defaultDropdown()}
                </div>
            </Dropdown>
        );
    }
}
