import autobind from 'autobind-decorator';
import Cookies from 'js-cookie';
import {observable, action, computed} from 'mobx';

import udApi from 'utils/ud-api';
import udMe from 'utils/ud-me';

interface Locale {
    locale: string;
    simple_english_title: string;
}

// Store for the Arabic market experiment to allow users to see courses in
// their language first & allow them to manually change their learning languages
export class LearningLanguageSelectorStore {
    window = window;
    defaultLearningLanguages = !udMe.isLoading ? udMe.learning_languages || [] : [];
    @observable primaryLanguage = '';
    @observable secondaryLanguage = '';
    @observable showModal = false;
    @observable localeList: Locale[] = [];

    getLocaleList() {
        const params = {
            page_size: 150,
            'fields[locale]': '@all',
        };
        return udApi.get('/locales/', {params}).then(
            action((response: {data: {results: Locale[]}}) => {
                this.localeList = response.data.results;
            }),
        );
    }

    @computed
    get localeTitles() {
        // We use the shorthand 'en' and longhand 'English' in the component so this returns
        // an object in the format {'en': 'English', 'ar': 'Arabic'}
        return this.localeList.reduce((acc, locale) => {
            acc[locale.locale.split('_')[0]] = locale.simple_english_title;
            return acc;
        }, {} as Record<string, string>);
    }

    @action
    initLearningLanguages() {
        // We are currently only interested in allowing users to select 2 learning languages
        // Secondary language should be left as empty string if only 1 default learning lang
        [this.primaryLanguage, this.secondaryLanguage] = this.defaultLearningLanguages;
    }

    @autobind
    @action
    close() {
        this.initLearningLanguages();
        this.showModal = false;
    }

    @autobind
    @action
    open() {
        this.showModal = true;
    }

    @autobind
    @action
    updatePrimaryLanguage(e: {target: {value: string}}) {
        this.primaryLanguage = e.target.value;
    }

    @autobind
    @action
    updateSecondaryLanguage(e: {target: {value: string}}) {
        this.secondaryLanguage = e.target.value;
    }

    @autobind
    @action
    changeOrder() {
        // Switches the value of primary and secondary language
        [this.primaryLanguage, this.secondaryLanguage] = [
            this.secondaryLanguage,
            this.primaryLanguage,
        ];
    }

    @autobind
    @action
    save() {
        // When users select new learning languages, save in a Cookie in the format 'ar|en'
        // Reload to get new search results
        const learningLanguages = [this.primaryLanguage, this.secondaryLanguage];
        Cookies.set('learning_languages', learningLanguages.join('|'), {
            expires: 30,
            path: '/',
        });
        this.window.location.reload();
    }
}
