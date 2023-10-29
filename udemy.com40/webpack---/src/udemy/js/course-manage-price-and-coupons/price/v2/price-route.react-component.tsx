import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';

import Loader from '../../../course-manage-v2/loader.react-component';
import {loadingState} from '../../constants';
import Course from '../../course.mobx-model';
import {PriceStore} from '../price.mobx-store';
import {CoursePricing} from './course-pricing.react-component';

export interface PriceRouteV2Props {
    isOwnerOptedIntoDeals: boolean;
    course: Course;
    priceStore: PriceStore;
}

@inject('priceStore')
@observer
export class PriceRouteV2 extends Component<PriceRouteV2Props> {
    componentDidMount() {
        this.props.course.load();
        this.props.priceStore.course.load().then(() => {
            this.props.priceStore.loadPriceRange();
            this.props.priceStore.form.reset();
        });
        this.props.priceStore.loadPriceTiers();
    }

    render() {
        if (
            this.props.course.loadingState !== loadingState.loaded ||
            this.props.priceStore.priceTiersLoadingState !== loadingState.loaded ||
            this.props.priceStore.priceRangeLoadingState !== loadingState.loaded
        ) {
            return <Loader />;
        }
        const isOwnerKey = 'is_owner' as keyof typeof this.props.course;
        const isOwner = Boolean(this.props.course[isOwnerKey]);
        const isOwnerPremiumInstructorKey = 'owner_is_premium_instructor' as keyof typeof this.props.course;
        const isOwnerPremiumInstructor = Boolean(this.props.course[isOwnerPremiumInstructorKey]);

        return (
            <div data-purpose="price-route-v2">
                <CoursePricing
                    isOwnerOptedIntoDeals={this.props.isOwnerOptedIntoDeals}
                    isOwner={isOwner}
                    isOwnerPremiumInstructor={isOwnerPremiumInstructor}
                    priceStore={this.props.priceStore}
                />
            </div>
        );
    }
}
