import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {PriceStore} from '../price.mobx-store';
import {
    PRICE_SELECT_BODY_TEXT_COMMON,
    PRICE_SELECT_OPTED_OUT_HEADING_TEXT,
    PRICE_SELECT_OPTED_OUT_BODY_TEXT,
} from './messages';
import {PriceSelect} from './price-select.react-component';

import './price.less';

export interface OptedInPriceSelectionProps {
    priceStore: PriceStore;
}
@observer
export class OptedOutPriceSelection extends Component<OptedInPriceSelectionProps> {
    render() {
        return (
            <div styleName="course-pricing-selection" data-purpose="course-pricing-selection">
                <div className="ud-heading-md">{PRICE_SELECT_OPTED_OUT_HEADING_TEXT}</div>
                <p>{PRICE_SELECT_OPTED_OUT_BODY_TEXT}</p>
                <p>{PRICE_SELECT_BODY_TEXT_COMMON}</p>
                <PriceSelect
                    priceStore={this.props.priceStore}
                    instructorIsOptedIntoDeals={false}
                ></PriceSelect>
            </div>
        );
    }
}
