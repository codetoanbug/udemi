import {saveEventData} from '@udemy/gtag';
import {action, ObservableMap} from 'mobx';

import udApi from 'utils/ud-api';

export default class CourseLandingComponentsStore {
    contexts = new ObservableMap();

    constructor(props) {
        this.courseId = props.courseId;
        this.window = props.window || window;
    }

    /** @type {<T>(componentNames: string[]) => T} */
    get(componentNames) {
        const matchingContext = {};
        componentNames.forEach((componentName) => {
            const componentContext = this.contexts.get(componentName);
            matchingContext[componentName] = componentContext;
        });
        return matchingContext;
    }

    /** @type {<T>(componentNames: string[], parameters?: object) => Promise<T>} */
    getOrPopulate(componentNames, parameters = undefined) {
        const unpopulatedKeys = componentNames.filter((key) => !this.contexts.has(key));
        return this.populate(unpopulatedKeys, parameters).then(() => {
            return Promise.resolve(this.get(componentNames));
        });
    }

    populate(componentNames, parameters) {
        if (componentNames.length === 0) {
            return Promise.resolve({});
        }

        return this._fetch(componentNames, parameters).then(
            (response) => {
                return this.update(componentNames, response.data);
            },
            (error) => Promise.reject(error),
        );
    }

    update(componentNames, componentContexts) {
        componentNames.forEach((componentName) => {
            this._update(componentName, componentContexts[componentName]);

            // If this is a update for component `purchase`, save marketing analytics
            if (
                componentName === 'purchase' &&
                componentContexts[componentName] &&
                componentContexts[componentName].data &&
                componentContexts[componentName].data.pricing_result &&
                componentContexts[componentName].data.pricing_result.price
            ) {
                // Extract pricing information for marketing analytics
                const pricingResult = componentContexts[componentName].data.pricing_result;
                const {amount, currency} = pricingResult.price;
                // If there is a discount, save coupon code
                if (pricingResult.discount_percent > 0) {
                    saveEventData({coupon: pricingResult.code});
                }
                saveEventData({
                    value: amount,
                    currency,
                });
            }
        });
        return Promise.resolve(this.get(componentNames));
    }

    @action
    _update(componentName, componentContext) {
        this.contexts.set(componentName, componentContext);
    }

    _fetch(components, parameters) {
        const apiUrl = `/course-landing-components/${this.courseId}/me/${this.window.location.search}`;
        return udApi.get(apiUrl, {
            params: Object.assign({components: components.join(',')}, parameters || {}),
        });
    }
}
