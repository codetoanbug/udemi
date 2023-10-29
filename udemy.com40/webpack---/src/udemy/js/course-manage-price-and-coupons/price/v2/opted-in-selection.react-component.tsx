import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {inject, observer} from 'mobx-react';
import React from 'react';

import {PriceStore} from '../price.mobx-store';
import {
    PRICE_SELECT_BODY_TEXT_COMMON,
    PRICE_SELECT_OPTED_IN_BODY_TEXT,
    PRICE_SELECT_OPTED_IN_EXPLANATION_HEADING_TEXT,
    PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_ONE,
    PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_TWO,
    PRICE_SELECT_OPTED_IN_HEADING_TEXT,
    WHERE_PRICE_SHOWN_LINK_TEXT,
} from './messages';
import {PriceSelect} from './price-select.react-component';

import './price.less';

export interface OptedInPriceSelectionProps {
    priceStore: PriceStore;
}

export const OptedInPriceSelection = inject('priceStore')(
    observer(({priceStore}: OptedInPriceSelectionProps) => {
        return (
            <div styleName="course-pricing-selection" data-purpose="course-pricing-selection">
                <div className="ud-heading-md">{PRICE_SELECT_OPTED_IN_HEADING_TEXT}</div>
                <p>{PRICE_SELECT_OPTED_IN_BODY_TEXT}</p>
                <p>{PRICE_SELECT_BODY_TEXT_COMMON}</p>
                <Popover
                    a11yRole="description"
                    canToggleOnHover={true}
                    detachFromTarget={true}
                    withPadding={true}
                    withArrow={false}
                    placement="right-end"
                    styleName="where-price-shown"
                    trigger={
                        <Button udStyle="link-underline" styleName="font-weight-normal">
                            {WHERE_PRICE_SHOWN_LINK_TEXT}
                        </Button>
                    }
                >
                    <div>
                        <div>{PRICE_SELECT_OPTED_IN_EXPLANATION_HEADING_TEXT}</div>
                        <ul>
                            <li>{PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_ONE}</li>
                            <li>{PRICE_SELECT_OPTED_IN_EXPLANATION_LIST_LINE_TWO}</li>
                        </ul>
                    </div>
                </Popover>
                <PriceSelect
                    priceStore={priceStore}
                    instructorIsOptedIntoDeals={true}
                ></PriceSelect>
            </div>
        );
    }),
);
