import PropTypes from 'prop-types';
import React from 'react';

function isRequiredWrapper(validator, isRequired) {
    return function (props, propName, componentName, location, propFullName, secret) {
        if (props[propName] === undefined && isRequired) {
            propFullName = propFullName || propName;
            return new Error(
                `The ${location} \`${propFullName}\` is marked as required in \`${componentName}\`, ` +
                    'but its value is `undefined`.',
            );
        }
        return validator(props, propName, componentName, location, propFullName, secret);
    };
}

function addIsRequiredVariant(validator) {
    /*
    Adds a modifier to the passed prop type such that it will work as expected with or without
    an appended `.isRequired`.
     */
    const wrappedValidator = isRequiredWrapper(validator, false);
    wrappedValidator.isRequired = isRequiredWrapper(validator, true);
    return wrappedValidator;
}

export const domElement = addIsRequiredVariant(
    (props, propName, componentName, location, propFullName, secret) => {
        /*
        Validates that the supplied prop is a DOM Element.
        https://developer.mozilla.org/en-US/docs/Web/API/Element
         */
        return PropTypes.instanceOf(Element)(
            props,
            propName,
            componentName,
            location,
            propFullName,
            secret,
        );
    },
);

export const reactElement = addIsRequiredVariant(
    (props, propName, componentName, location, propFullName, secret) => {
        /*
        PropTypes.element checks that the supplied prop is either a React element (e.g. <div />,
        <span /> etc) OR a React (functional or class-based) component (e.g. <MyGreatComponent />)
        If you pass a `ref` to the former, you get back a DOM node. If you pass a `ref` to the
        latter, you get back a component class instance, or an error if the component is functional.
        This prop type checks that the supplied prop is strictly a React element, such that a passed
        `ref` will return a DOM node.
         */
        const elementCheck = PropTypes.element(
            props,
            propName,
            componentName,
            location,
            propFullName,
            secret,
        );
        if (elementCheck instanceof Error) {
            return elementCheck;
        }
        if (typeof props[propName].type !== 'string') {
            propFullName = propFullName || propName;
            return new Error(
                `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`, ` +
                    'expected a React element but received a React component.',
            );
        }
    },
);

export const reactClassComponent = addIsRequiredVariant(
    (props, propName, componentName, location, propFullName, secret) => {
        /*
        Validates that the supplied prop is a React element or class-based component, such that it
        may receive a ref (functional components cannot be passed refs).
         */
        const reactElementCheck = PropTypes.element(
            props,
            propName,
            componentName,
            location,
            propFullName,
            secret,
        );
        if (reactElementCheck instanceof Error) {
            return reactElementCheck;
        }

        propFullName = propFullName || propName;
        const constructor = props[propName].type;
        if (!constructor.prototype) {
            return new Error(
                `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`, ` +
                    'expected a React class-based component, but received a React element.',
            );
        }
        if (!constructor.prototype.render) {
            return new Error(
                `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`, ` +
                    'expected a React class-based component, but received a React functional ' +
                    'component.',
            );
        }
    },
);

export function isRequiredIf(conditionalPropName) {
    return (originalValidator) => {
        function validator(props, propName, componentName, location, propFullName, ...params) {
            propFullName = propFullName || propName;
            if (props[propName] === undefined) {
                if (props[conditionalPropName]) {
                    return new Error(
                        `The ${location} \`${propFullName}\` is marked as required in \`${componentName}\`
                        if the prop \`${conditionalPropName}\` is provided, but its value is \`undefined\`.`,
                    );
                }
                return null;
            }
            return originalValidator(
                props,
                propName,
                componentName,
                location,
                propFullName,
                ...params,
            );
        }
        // Adding isRequired doesn't change validator behaviour, but does let us append the function with
        // `isRequired`, avoiding the linting rules requirement for a defaultProps definition.
        validator.isRequired = validator.bind(null);
        return validator;
    };
}

export function isRequiredUnless(conditionalPropName) {
    return (originalValidator) => {
        function validator(props, propName, componentName, location, propFullName, ...params) {
            propFullName = propFullName || propName;
            if (props[propName] === undefined) {
                if (!props[conditionalPropName]) {
                    return new Error(
                        `The ${location} \`${propFullName}\` is marked as required in \`${componentName}\`
                        if the prop \`${conditionalPropName}\` is not provided, but its value is \`undefined\`.`,
                    );
                }
                return null;
            }
            return originalValidator(
                props,
                propName,
                componentName,
                location,
                propFullName,
                ...params,
            );
        }
        // Adding isRequired doesn't change validator behaviour, but does let us append the function with
        // `isRequired`, avoiding the linting rules requirement for a defaultProps definition.
        validator.isRequired = validator.bind(null);
        return validator;
    };
}

export function isMutuallyExclusiveWith(conditionalPropName) {
    return (originalValidator) => {
        function validator(props, propName, componentName, location, propFullName, ...params) {
            propFullName = propFullName || propName;
            if (props[propName] !== undefined && props[conditionalPropName] !== undefined) {
                return new Error(
                    `The ${location} \`${propFullName}\` is marked in \`${componentName}\` as mutually exclusive
                    with the prop \`${conditionalPropName}\`, but both have been provided.`,
                );
            }
            return originalValidator(
                props,
                propName,
                componentName,
                location,
                propFullName,
                ...params,
            );
        }
        return validator;
    };
}

export function instanceOfComponent(...types) {
    const _propType = (required, props, propName, componentName) => {
        const propValue = props[propName];
        const instances = propName === 'children' ? React.Children.toArray(propValue) : [propValue];
        if (required && instances.length === 0) {
            return new Error(`${componentName} requires ${types.join('|')} ${propName}`);
        }
        for (const instance of instances) {
            if (required && !instance) {
                return new Error(`${componentName} requires ${types.join('|')} ${propName}`);
            }
            if (instance && (!instance.type || types.every((t) => instance.type.$$udType !== t))) {
                return new Error(`${componentName} only accepts ${types.join('|')} ${propName}`);
            }
        }
    };
    const propType = _propType.bind(null, false);
    propType.isRequired = _propType.bind(null, true);
    return propType;
}
