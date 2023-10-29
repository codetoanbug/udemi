import {LocalizedHtml} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import udLink from '../../../utils/ud-link';
import {PRICE_TIER_MATRIX_URL} from './links';
import {PRICE_POPOVER_OPTED_INTO_DEALS_TEXT, PRICE_POPOVER_OPTED_OUT_DEALS_TEXT} from './messages';

import './price.less';

export interface PricePopoverProps {
    instructorIsOptedIntoDeals: boolean;
}

@observer
export class PricePopover extends Component<PricePopoverProps> {
    readonly popoverText = this.props.instructorIsOptedIntoDeals
        ? PRICE_POPOVER_OPTED_INTO_DEALS_TEXT
        : PRICE_POPOVER_OPTED_OUT_DEALS_TEXT;

    localizedMatrixUrl() {
        return udLink.toStorageStaticAsset(PRICE_TIER_MATRIX_URL);
    }

    render() {
        return (
            <Popover
                a11yRole="description"
                canToggleOnHover={true}
                detachFromTarget={true}
                withPadding={true}
                withArrow={false}
                placement="right-end"
                styleName="info-price-popover"
                trigger={<InfoOutlineIcon label={false} size="small" />}
            >
                <LocalizedHtml
                    className="ud-text-with-links"
                    html={this.popoverText}
                    interpolate={{
                        priceTierMatrixUrl: (
                            <a
                                href={this.localizedMatrixUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        ),
                    }}
                />
            </Popover>
        );
    }
}
