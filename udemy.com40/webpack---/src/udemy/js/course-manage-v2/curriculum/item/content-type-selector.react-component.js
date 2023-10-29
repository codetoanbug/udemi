import {Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './content-type-selector.less';

export const optionStyles = Object.freeze({
    assetType: 'asset',
    assessmentType: 'assessment',
    assessmentCreationType: 'assessment-creation',
});

export default class ContentTypeSelector extends Component {
    static propTypes = {
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                icon: PropTypes.elementType,
                type: PropTypes.string.isRequired,
            }),
        ).isRequired,
        optionStyle: PropTypes.oneOf(Object.values(optionStyles)).isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    renderIcon(Icon, styleName) {
        return (
            <div styleName={styleName}>
                <Icon label={false} color="inherit" size="large" />
            </div>
        );
    }

    render() {
        return (
            <ul className="ud-unstyled-list" styleName="list">
                {this.props.options.map((option) => (
                    <li key={option.type}>
                        <Button
                            data-purpose={`select-${option.type.toLowerCase()}`}
                            onClick={() => this.props.onSelect(option.type)}
                            udStyle="link"
                            styleName={this.props.optionStyle}
                        >
                            <span styleName="box">
                                {option.icon && this.renderIcon(option.icon, 'icon icon-before')}
                                {option.icon && this.renderIcon(option.icon, 'icon icon-after')}
                                <span className="ud-text-xs" styleName="label">
                                    {option.label}
                                </span>
                            </span>
                        </Button>
                    </li>
                ))}
            </ul>
        );
    }
}
