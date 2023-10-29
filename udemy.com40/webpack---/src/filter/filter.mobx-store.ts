import {observable, action, get} from 'mobx';

import {FilterAggregation, FilterAggregationOption} from '../types';

export class LanguageFilterStore {
    @observable checkedOptions: FilterAggregationOption[] = [];
    title: string;
    options: FilterAggregationOption[];
    paramPrefix: string;

    constructor(
        filterAggregation: FilterAggregation,
        paramPrefix: string,
        initialSelectedOptions: string[],
    ) {
        this.title = filterAggregation.title;
        this.options = filterAggregation.options;
        this.paramPrefix = paramPrefix;
        this.setCheckedOptions(initialSelectedOptions);
    }

    @action
    toggleCheckedOptions = (key: string) => {
        for (const filterOption of this.options) {
            if (filterOption.key === key) {
                const checkedOption = this.checkedOptions.find((option) => option.key === key);
                if (checkedOption === undefined) {
                    this.checkedOptions = this.checkedOptions.concat([filterOption]);
                } else {
                    this.checkedOptions = this.checkedOptions.filter(
                        (option) => option.key !== key,
                    );
                }
            }
        }
    };

    @get getOptions() {
        return this.options;
    }

    @get getCheckedOptions() {
        return this.checkedOptions;
    }

    @action
    setCheckedOptions = (targetOptions: string[]) => {
        for (const option of this.options) {
            if (targetOptions.includes(option.key)) {
                this.checkedOptions.push(option);
            }
        }
    };

    @get getParams() {
        if (this.checkedOptions.length === 0) {
            return '';
        }
        return `${this.paramPrefix}=` + this.checkedOptions.map((option) => option.key).join(',');
    }

    @get isChecked(option: FilterAggregationOption) {
        for (const checkedOption of this.checkedOptions) {
            if (checkedOption.key === option.key) {
                return true;
            }
        }
        return false;
    }
}

export class DomainFilterStore {
    @observable checkedOptions: FilterAggregationOption[] = [];
    title: string;
    options: FilterAggregationOption[];
    paramPrefix: string;

    constructor(
        filterAggregation: FilterAggregation,
        paramPrefix: string,
        initialSelectedOptions: string[],
    ) {
        this.title = filterAggregation.title;
        this.options = filterAggregation.options;
        this.paramPrefix = paramPrefix;
        this.setCheckedOptions(initialSelectedOptions);
    }

    @action
    toggleCheckedOptions = (key: string) => {
        for (const filterOption of this.options) {
            if (filterOption.key === key) {
                const checkedOption = this.checkedOptions.find((option) => option.key === key);
                if (checkedOption === undefined) {
                    this.checkedOptions = this.checkedOptions.concat([filterOption]);
                } else {
                    this.checkedOptions = this.checkedOptions.filter(
                        (option) => option.key !== key,
                    );
                }
            }
        }
    };

    @get getOptions() {
        return this.options;
    }

    @get getCheckedOptions() {
        return this.checkedOptions;
    }

    @action
    setCheckedOptions = (targetOptions: string[]) => {
        for (const option of this.options) {
            if (targetOptions.includes(option.key)) {
                this.checkedOptions.push(option);
            }
        }
    };

    @get getParams() {
        if (this.checkedOptions.length === 0) {
            return '';
        }
        return `${this.paramPrefix}=` + this.checkedOptions.map((option) => option.key).join(',');
    }

    @get isChecked(option: FilterAggregationOption) {
        for (const checkedOption of this.checkedOptions) {
            if (checkedOption.key === option.key) {
                return true;
            }
        }
        return false;
    }
}
