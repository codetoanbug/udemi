import DealIcon from '@udemy/icons/dist/deal.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {LEARN_MORE_URL, OPT_INTO_DEAL_PROGRAM_URL} from './links';
import {
    LEAR_MORE_LINK_TEXT,
    OPTED_OUT_DEALS_CONTENT_SUB_HEADING_TEXT,
    OPTED_OUT_DEALS_CONTENT_SUB_LINE_ONE,
    OPTED_OUT_DEALS_CONTENT_SUB_LINE_THREE,
    OPTED_OUT_DEALS_CONTENT_SUB_LINE_TWO,
    OPTED_OUT_DEALS_CONTENT_TEXT,
    OPTED_OUT_DEALS_HEADING_TEXT,
    OPTED_OUT_DEALS_LINK_TEXT,
} from './messages';

import './price.less';

@observer
export class OptedOutDeals extends Component {
    render() {
        return (
            <>
                <div styleName="course-pricing-deals" data-purpose="course-pricing-deals">
                    <div styleName="course-pricing-deals-panel">
                        <div styleName="heading">
                            <DealIcon size="xlarge" label={false} />
                            <h2 data-purpose="deals-title" className="ud-heading-lg">
                                {OPTED_OUT_DEALS_HEADING_TEXT}
                            </h2>
                        </div>
                        <div styleName="content-opted-out">
                            <div>{OPTED_OUT_DEALS_CONTENT_TEXT}</div>
                            <div className="ud-heading-md">
                                {OPTED_OUT_DEALS_CONTENT_SUB_HEADING_TEXT}
                            </div>
                            <ul>
                                <li>{OPTED_OUT_DEALS_CONTENT_SUB_LINE_ONE}</li>
                                <li>{OPTED_OUT_DEALS_CONTENT_SUB_LINE_TWO}</li>
                                <li>{OPTED_OUT_DEALS_CONTENT_SUB_LINE_THREE}</li>
                            </ul>
                            <div styleName="learn-more">
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
                            <div>
                                <Button
                                    data-purpose="opt-into-deals"
                                    udStyle="secondary"
                                    size="medium"
                                    componentClass="a"
                                    href={OPT_INTO_DEAL_PROGRAM_URL}
                                >
                                    {OPTED_OUT_DEALS_LINK_TEXT}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
