import DealIcon from '@udemy/icons/dist/deal.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {PriceStore} from '../price.mobx-store';
import {LEARN_MORE_URL} from './links';
import {
    LEAR_MORE_LINK_TEXT,
    OPTED_IN_DEALS_BODY_TEXT,
    OPTED_IN_DEALS_HEADING_TEXT,
} from './messages';
import {PriceRangeContainer} from './price-range.react-component';

import './price.less';

export interface PriceStoreAwareProps {
    priceStore: PriceStore;
}

@observer
export class OptedInDeals extends Component<PriceStoreAwareProps> {
    render() {
        return (
            <>
                <div styleName="course-pricing-deals" data-purpose="course-pricing-deals">
                    <div>
                        <div styleName="course-pricing-deals-panel-top">
                            <div styleName="heading">
                                <DealIcon size="xlarge" label={false} />
                                {OPTED_IN_DEALS_HEADING_TEXT}
                            </div>
                            <p>{OPTED_IN_DEALS_BODY_TEXT}</p>
                            <Button
                                data-purpose="deals-learn-more"
                                udStyle="link-underline"
                                componentClass="a"
                                size="medium"
                                href={LEARN_MORE_URL}
                            >
                                {LEAR_MORE_LINK_TEXT}
                            </Button>
                        </div>
                        <PriceRangeContainer priceStore={this.props.priceStore} />
                    </div>
                </div>
            </>
        );
    }
}
