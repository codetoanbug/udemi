import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {PriceStore} from '../price.mobx-store';
import {
    PRICE_SELECT_FREE_PRICES_BODY_TEXT,
    PRICE_SELECT_FREE_PRICES_HEADING_TEXT,
} from './messages';
import {PriceSelect} from './price-select.react-component';

import './price.less';

export interface FreePricesInstructorProps {
    priceStore: PriceStore;
}
@observer
export class FreePricesInstructor extends Component<FreePricesInstructorProps> {
    render() {
        return (
            <div styleName="course-pricing-selection" data-purpose="course-pricing-selection">
                <div className="ud-heading-md">{PRICE_SELECT_FREE_PRICES_HEADING_TEXT}</div>
                <p>{PRICE_SELECT_FREE_PRICES_BODY_TEXT}</p>
                <PriceSelect
                    priceStore={this.props.priceStore}
                    instructorIsOptedIntoDeals={false}
                />
            </div>
        );
    }
}
