import {getDisplayName} from '@udemy/shared-utils';
import hoistStatics from 'hoist-non-react-statics';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

/**
 * @param defaultExperimentMap<any> Default experiment map
 * @returns {ComponentType<any>} Wrapped component
 */
export default function withExperiment(defaultExperimentMap = {}) {
    return function wrapWithExperiment(WrappedComponent) {
        const displayName = `WithExperiment(${getDisplayName(WrappedComponent)})`;

        @inject(({experimentValuesStore = {}}) => ({experimentValuesStore}))
        class WithExperiment extends Component {
            static displayName = displayName;

            static propTypes = {
                experimentValuesStore: PropTypes.object.isRequired,
            };

            render() {
                const {experimentValuesStore, ...passThroughProps} = this.props;

                const overriddenDefaultExperimentMap = {};

                for (const key in defaultExperimentMap) {
                    overriddenDefaultExperimentMap[key] =
                        experimentValuesStore[key] !== undefined
                            ? experimentValuesStore[key]
                            : defaultExperimentMap[key];
                }

                return (
                    <WrappedComponent
                        experiment={overriddenDefaultExperimentMap}
                        {...passThroughProps}
                    />
                );
            }
        }

        function ExperimentOverride(props) {
            const {experiment, ...passThroughProps} = props;

            if (experiment) {
                return <WrappedComponent experiment={experiment} {...passThroughProps} />;
            }

            return <WithExperiment {...passThroughProps} />;
        }

        ExperimentOverride.propTypes = {experiment: PropTypes.object};
        ExperimentOverride.defaultProps = {experiment: undefined};
        ExperimentOverride.withoutExperiment = WrappedComponent;

        return hoistStatics(ExperimentOverride, WrappedComponent);
    };
}
