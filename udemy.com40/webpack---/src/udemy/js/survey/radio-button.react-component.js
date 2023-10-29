import {getUniqueId} from '@udemy/design-system-utils';
import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {Button} from '@udemy/react-core-components';
import React, {Component} from 'react';

import './radio-button.less';

export default class RadioButton extends Component {
    id = getUniqueId('radio-button');

    render() {
        const {children, ...props} = this.props;
        return (
            <Button
                styleName="radio-button"
                udStyle="secondary"
                size="small"
                componentClass="label"
                htmlFor={this.id}
            >
                <input {...props} id={this.id} type="radio" className="ud-sr-only" />
                <span styleName="radio-label">
                    <TickIcon label={false} styleName="icon" />
                    {children}
                </span>
                <span styleName="focus-outline" />
            </Button>
        );
    }
}
