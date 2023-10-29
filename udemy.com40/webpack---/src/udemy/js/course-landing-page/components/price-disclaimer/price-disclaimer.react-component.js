import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import injectCourseLandingPageContext from 'course-landing-page/components/inject-course-landing-component-context';
import getConfigData from 'utils/get-config-data';

import './price-disclaimer.less';

@injectCourseLandingPageContext('purchase')
@observer
export default class PriceDisclaimer extends React.Component {
    static propTypes = {
        componentContext: PropTypes.shape({
            data: PropTypes.object.isRequired,
        }),
    };

    static defaultProps = {
        componentContext: undefined,
    };

    render() {
        const {componentContext} = this.props;
        if (!componentContext) {
            return null;
        }

        const discount = componentContext.data.pricing_result;

        if (
            discount &&
            discount.discount_percent !== discount.discount_percent_for_display &&
            !getConfigData().brand.has_organization &&
            !discount.is_valid_student
        ) {
            return (
                <div
                    data-purpose="price-disclaimer"
                    className="ud-text-sm"
                    styleName="price-disclaimer"
                >
                    {'*'}{' '}
                    {gettext(
                        'Please note discounts may be slightly higher than advertised amount due to rounding and currency conversion.',
                    )}
                </div>
            );
        }
        return null;
    }
}
