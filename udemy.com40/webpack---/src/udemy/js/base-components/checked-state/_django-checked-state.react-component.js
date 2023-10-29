import {CheckedState} from '@udemy/react-checked-state-components';
import {when} from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';

import {injectIsIsomorphicallyRendered} from 'utils/isomorphic-rendering';

// When rendered in an isomorphic component, CheckedState's [data-checked]
// attribute may change before React initializes. This component wraps
// CheckedState with logic to synchronize its React component state with the
// underlying DOM.
@injectIsIsomorphicallyRendered
export default class DjangoCheckedState extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        'data-checked': PropTypes.oneOf(['', 'checked']).isRequired,
        onChange: PropTypes.func.isRequired,
        onEscape: PropTypes.func,
        getIsRootComponentMounted: PropTypes.func,
        isIsomorphicallyRendered: PropTypes.bool,
    };

    static defaultProps = {
        onEscape: null,
        getIsRootComponentMounted: null,
        isIsomorphicallyRendered: false,
    };

    constructor(props) {
        super(props);

        this.forcedProps = {};
        if (props.isIsomorphicallyRendered && !props.getIsRootComponentMounted()) {
            const input = typeof document !== 'undefined' && document.getElementById(props.id);
            if (input && input.dataset.checked !== props['data-checked']) {
                // For the initial render, force React to match the DOM.
                // This avoids content mismatch warnings from `ReactDOM.hydrate`.
                this.forcedProps['data-checked'] = input.dataset.checked;
                // Trigger `onChange` to sync React and the DOM for subsequent renders.
                // Note that we wait for the root isomorphic component to mount so that parent
                // components can set up `ref`s. This matters for e.g. FocusTrappingDialog.
                when(props.getIsRootComponentMounted, () => {
                    const target = {id: this.props.id, dataset: {checked: props['data-checked']}};
                    props.onChange({target});
                });
            }
        }
    }

    componentDidMount() {
        // forcedProps were set during initial render to sync React with the DOM.
        // Ignore them after mount.
        this.forcedProps = {};
    }

    render() {
        const {getIsRootComponentMounted, isIsomorphicallyRendered, ...props} = this.props;
        return <CheckedState {...props} {...this.forcedProps} />;
    }
}
