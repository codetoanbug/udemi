import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, Select} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {when} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import udMe from 'utils/ud-me';

import {LearningLanguageSelectorStore} from './learning-language-selector.mobx-store';
import './learning-language-selector.less';

interface LearningLanguageAlertProps {
    store: LearningLanguageSelectorStore;
    primaryLanguageTitle: string;
    secondaryLanguageTitle?: string;
}

export const LearningLanguageAlert = ({
    store,
    primaryLanguageTitle,
    secondaryLanguageTitle,
}: LearningLanguageAlertProps) => {
    const title = !secondaryLanguageTitle
        ? interpolate(
              gettext('Your learning language is set to %(primaryLanguageTitle)s.'),
              {primaryLanguageTitle},
              true,
          )
        : interpolate(
              gettext(
                  'Your learning languages are set to %(primaryLanguageTitle)s and %(secondaryLanguageTitle)s.',
              ),
              {primaryLanguageTitle, secondaryLanguageTitle},
              true,
          );

    return <AlertBanner title={title} ctaText={gettext('Edit settings')} onAction={store.open} />;
};

@observer
export class LearningLanguageSelector extends Component {
    async componentDidMount() {
        this.store.getLocaleList();
        await when(() => !udMe.isLoading);
        this.store.defaultLearningLanguages = udMe.learning_languages || [];
        this.store.initLearningLanguages();
    }

    store = new LearningLanguageSelectorStore();

    @autobind onSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.store.save();
    }

    render() {
        if (udMe.isLoading) {
            return null;
        }

        const props = {
            store: this.store,
            primaryLanguageTitle: this.store.localeTitles[this.store.primaryLanguage],
            secondaryLanguageTitle: this.store.localeTitles[this.store.secondaryLanguage],
        };

        return (
            <>
                {props.primaryLanguageTitle && <LearningLanguageAlert {...props} />}
                <Modal
                    data-purpose="learning-lang-modal"
                    isOpen={this.store.showModal}
                    onClose={this.store.close}
                    title={gettext('What languages do you prefer to learn in?')}
                >
                    <form onSubmit={this.onSubmit} styleName="modal-container">
                        <h2>
                            {gettext(
                                'This will help us show you courses in your preferred languages.',
                            )}
                        </h2>
                        <FormGroup label={gettext('Primary')} data-purpose="primary-lang-selector">
                            <Select
                                onChange={this.store.updatePrimaryLanguage}
                                value={this.store.primaryLanguage}
                            >
                                {Object.entries(this.store.localeTitles).map((locale, i) => {
                                    return (
                                        <option value={locale[0]} key={i}>
                                            {locale[1]}
                                        </option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                        {props.secondaryLanguageTitle && (
                            <Button
                                size="medium"
                                udStyle="ghost"
                                data-purpose="switch-icon"
                                onClick={this.store.changeOrder}
                            >
                                {String.fromCharCode(0x21c5)}
                            </Button>
                        )}
                        <FormGroup
                            label={gettext('Secondary')}
                            data-purpose="secondary-lang-selector"
                        >
                            <Select
                                onChange={this.store.updateSecondaryLanguage}
                                value={this.store.secondaryLanguage || gettext('None')}
                            >
                                <option value="None" key="none">
                                    {gettext('None')}
                                </option>
                                {Object.entries(this.store.localeTitles).map((locale, i) => {
                                    return (
                                        <option value={locale[0]} key={i}>
                                            {locale[1]}
                                        </option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                        <FooterButtons>
                            <Button
                                udStyle="ghost"
                                onClick={this.store.close}
                                data-purpose="cancel-button"
                            >
                                {gettext('Cancel')}
                            </Button>
                            <Button type="submit" data-purpose="save-button">
                                {gettext('Save')}
                            </Button>
                        </FooterButtons>
                    </form>
                </Modal>
            </>
        );
    }
}
