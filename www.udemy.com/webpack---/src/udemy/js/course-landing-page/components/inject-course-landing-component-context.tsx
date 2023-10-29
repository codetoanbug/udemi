import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {AnyObject} from 'utils/types';

export function injectCourseLandingPageContext(componentName: string, isIsomorphic = false) {
    /**
     * This default exported method is a wrapper around CourseLandingPageComponent.
     * It will instantiate this High Order Component for all Dynamic CLP components
     * by passing their class and name in its props. The CourseLandingPage Component will
     * then render the component by passing the store data for this component, null data
     * meaning this component is disabled.
     *
     * Note: Do not call directly CourseLandingPage Component.
     *
     * Dynamic CLP element example:
     *    import injectCourseLandingComponentContext from 'course-landing-page.react-component';
     *
     *    @injectCourseLandingComponentContext('purchase')
     *    @observer
     *    export default class PurchaseComponent extends React.Component {
     *        (...)
     *    }
     */
    return <TProps,>(componentClass: React.ComponentType<TProps>) => {
        function wrapped(props: TProps) {
            return (
                <CourseLandingPageComponent
                    {...{
                        componentName,
                        componentClass,
                        isIsomorphic,
                        ...props,
                    }}
                />
            );
        }
        wrapped.wrappedComponent = componentClass;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return wrapped as any;
    };
}

// TODO: remove this and update imports in another PR
// eslint-disable-next-line import/no-default-export
export default injectCourseLandingPageContext;

export interface CourseLandingPageComponentProps {
    componentName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentClass: React.ComponentType<any>;
    datadogTags?: AnyObject;
    isIsomorphic?: boolean;
    store?: CourseLandingComponentsStore;
}

@observer
export class CourseLandingPageComponent extends Component<CourseLandingPageComponentProps> {
    static propTypes = {
        componentName: PropTypes.string.isRequired,
        componentClass: PropTypes.elementType.isRequired,
        datadogTags: PropTypes.object,
        isIsomorphic: PropTypes.bool,
        store: PropTypes.object,
    };

    static defaultProps = {
        datadogTags: undefined,
        isIsomorphic: false,
        store: undefined,
    };

    render() {
        const {
            componentName,
            componentClass,
            datadogTags,
            isIsomorphic,
            store,
            ...props
        } = this.props;
        const componentProps = {
            datadogTags,
            store,
            ...props,
        };

        const componentContext = store?.contexts.get(componentName);

        if (isIsomorphic) {
            Object.assign(componentProps, {...componentContext});
        } else {
            Object.assign(componentProps, {componentContext});
        }

        return React.createElement(componentClass, componentProps, null);
    }
}
