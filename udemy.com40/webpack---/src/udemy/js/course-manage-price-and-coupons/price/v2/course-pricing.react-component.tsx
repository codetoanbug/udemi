import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {PriceStore} from '../price.mobx-store';
import {FreePricesInstructor} from './free-prices-instructor.react-component';
import {OptedInDeals} from './opted-in-deals.react-component';
import {OptedInPriceSelection} from './opted-in-selection.react-component';
import {OptedOutDeals} from './opted-out-deals.react-component';
import {OptedOutPriceSelection} from './opted-out-selection.react-component';
import {PremiumApplicationWarning} from './premium-application-warning.react-component';

import './price.less';

export interface CoursePricingProps {
    isOwnerOptedIntoDeals: boolean;
    isOwner: boolean;
    isOwnerPremiumInstructor: boolean;
    priceStore: PriceStore;
}
@observer
export class CoursePricing extends Component<CoursePricingProps> {
    renderFreePricesOnlyContainer() {
        return (
            <>
                <div styleName="course-pricing-free-prices-only-container">
                    <PremiumApplicationWarning isOwner={this.props.isOwner} />
                    <FreePricesInstructor priceStore={this.props.priceStore} />
                </div>
            </>
        );
    }

    renderOptedInContainer() {
        return (
            <>
                <div styleName="course-pricing-opted-in-container">
                    <OptedInPriceSelection priceStore={this.props.priceStore} />
                    <OptedInDeals priceStore={this.props.priceStore} />
                </div>
            </>
        );
    }

    renderOptedOutContainer() {
        return (
            <>
                <div styleName="course-pricing-opted-out-container">
                    <OptedOutPriceSelection priceStore={this.props.priceStore} />
                    <OptedOutDeals />
                </div>
            </>
        );
    }

    render() {
        return (
            <>
                {(!this.props.isOwnerPremiumInstructor && this.renderFreePricesOnlyContainer()) ||
                    (this.props.isOwnerPremiumInstructor &&
                        this.props.isOwnerOptedIntoDeals &&
                        this.renderOptedInContainer()) ||
                    this.renderOptedOutContainer()}
            </>
        );
    }
}
