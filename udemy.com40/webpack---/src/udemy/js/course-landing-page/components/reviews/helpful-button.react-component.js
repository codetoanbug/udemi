import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

@observer
export default class HelpfulButton extends React.Component {
    static propTypes = {
        icon: PropTypes.func.isRequired,
        labels: PropTypes.shape({
            selected: PropTypes.string.isRequired,
            notSelected: PropTypes.string.isRequired,
        }).isRequired,
        className: PropTypes.string,
        isSelected: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    static defaultProps = {
        className: undefined,
        isSelected: false,
        value: null,
    };

    @autobind
    onButtonClick(event) {
        event.target.blur();
        this.props.onClick(this.props.value);
    }

    render() {
        const {className, isSelected, icon: Icon, labels, ...props} = this.props;

        return (
            <IconButton
                {...props}
                size="medium"
                udStyle={isSelected ? 'primary' : 'secondary'}
                round={true}
                onClick={this.onButtonClick}
                className={className}
            >
                <Icon
                    label={isSelected ? labels.selected : labels.notSelected}
                    data-purpose="icon"
                />
            </IconButton>
        );
    }
}
