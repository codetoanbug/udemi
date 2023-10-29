import invariant from 'invariant';
import {Provider as MobxProvider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component, Children} from 'react';

import {getExperimentData, getVariants} from 'utils/get-experiment-data';
import Raven from 'utils/ud-raven';

export default class ExperimentProvider extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        experimentSet: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
            .isRequired,
    };

    constructor(props) {
        super(props);
        const udExperiment = getExperimentData();

        let experimentSets = this.props.experimentSet;
        if (typeof this.props.experimentSet === 'string') {
            experimentSets = [this.props.experimentSet];
        }

        experimentSets = experimentSets.join(',').replace(/\s/g, '').split(',');
        experimentSets = Array.from(new Set(experimentSets));

        this.experimentValuesStore = experimentSets
            .filter((experimentSet) => !!udExperiment[experimentSet]) // Filter UD.experiment[experimentSet] for valid object
            .map((experimentSet) => getVariants(experimentSet)) // Create an array of objects containing experiment variant kv pairs
            .reduce(this.checkDuplicateVariantKeys, {}); // Generate the experimentValuesStore
    }

    /**
     * Check if a variant key in experimentSet exists in the current experimentValuesStore.
     * If the key exists, log an error to Sentry, and show a warning to the user.
     * Return a new object created from experimentValuesStore and experimentSet with the violating key removed.
     *
     * @param {Object} experimentValuesStore
     * @param {Object} experimentSet
     */
    checkDuplicateVariantKeys(experimentValuesStore, experimentSet) {
        Object.keys(experimentSet).forEach((key) => {
            try {
                invariant(
                    !experimentValuesStore[key],
                    `The experiment variant key '${key}' exists in multiple experiments. Please use a unique key instead.`,
                );
            } catch (e) {
                if (e.name === 'Invariant Violation') {
                    Raven.captureException(e);
                } else {
                    throw e;
                }
            }
        });
        return {...experimentValuesStore, ...experimentSet};
    }

    render() {
        return (
            <MobxProvider experimentValuesStore={this.experimentValuesStore}>
                {Children.only(this.props.children)}
            </MobxProvider>
        );
    }
}
