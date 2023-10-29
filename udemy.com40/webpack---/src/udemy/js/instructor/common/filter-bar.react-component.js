import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './filter-bar.less';

export default class FilterBar extends Component {
    static propTypes = {
        leftItems: PropTypes.array.isRequired,
        rightCTA: PropTypes.node,
    };

    static defaultProps = {
        rightCTA: null,
    };

    render() {
        const {leftItems, rightCTA} = this.props;
        const showFilters = leftItems.length > 0;
        if (!showFilters && !rightCTA) {
            return null;
        }

        return (
            <div styleName="filters-container">
                {showFilters && (
                    <div styleName="left-options">
                        {leftItems.map((item, index) => {
                            return <React.Fragment key={index}>{item}</React.Fragment>;
                        })}
                    </div>
                )}
                {rightCTA}
            </div>
        );
    }
}
