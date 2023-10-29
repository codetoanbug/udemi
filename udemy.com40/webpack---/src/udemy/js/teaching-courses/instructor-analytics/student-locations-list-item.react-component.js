import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {formatNumber} from 'utils/numeral';

import {formatPercent} from './helpers';
import './list-panel.less';

export default class StudentLocationsListItem extends Component {
    static propTypes = {
        itemData: PropTypes.object.isRequired,
    };

    render() {
        const {itemData} = this.props;
        const name = itemData.country ? itemData.country.title : itemData.language;
        return (
            <div styleName="item">
                <div styleName="flex item-details">
                    <div styleName="ellipsis" title={name}>
                        {name}
                    </div>
                </div>
                <div styleName="ellipsis">
                    {formatPercent(itemData.percentage * 100, 1)}
                    <span className="ud-heading-xs" styleName="secondary-label">
                        {`(${formatNumber(itemData.num_students)})`}
                    </span>
                </div>
            </div>
        );
    }
}
