import {inject, Provider} from 'mobx-react';
import React from 'react';

// A page might have content that is above the fold for most screen sizes.
// Wrap such content in <AboveTheFoldProvider />.
// Child components @injectIsAboveTheFold to optimize their rendering.
// For example, Image by default lazy-loads for below-the-fold content.
export const AboveTheFoldProvider = (props) => {
    return <Provider {...props} isAboveTheFold={true} />;
};

export function injectIsAboveTheFold(Component) {
    return inject(({isAboveTheFold} = {}) => ({isAboveTheFold}))(Component);
}
