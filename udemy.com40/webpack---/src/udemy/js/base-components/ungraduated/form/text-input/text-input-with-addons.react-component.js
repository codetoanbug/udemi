// TODO: Promote to base-component.
import {TextInputContainer} from '@udemy/react-form-components';
import PropTypes from 'prop-types';
import React from 'react';

import './text-input-with-addons.less';

export default class TextInputWithAddons extends React.Component {
    render() {
        return (
            <div styleName="with-addons">
                <TextInputContainer {...this.props} />
            </div>
        );
    }
}

const Addon = ({componentClass: AddonComponent, ...restProps}) => {
    return <AddonComponent {...restProps} className={restProps.className} styleName="addon" />;
};

Addon.propTypes = {
    componentClass: PropTypes.elementType,
};

Addon.defaultProps = {
    componentClass: 'div',
};

TextInputWithAddons.Addon = Addon;
