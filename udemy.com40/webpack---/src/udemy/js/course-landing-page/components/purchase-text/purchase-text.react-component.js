import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';
import getPriceTextData from 'course-landing-page/components/price-text/helpers';

import './styles.less';

export function PurchaseTextDisplay({purchaseDate}) {
    return (
        <div styleName="purchase-info">
            <InfoIcon label={false} size="medium" color="info" />
            <b>{purchaseDate}</b>
        </div>
    );
}

PurchaseTextDisplay.propTypes = {purchaseDate: PropTypes.string.isRequired};

@injectCourseLandingPageData('purchase')
@observer
export default class PurchaseText extends React.Component {
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

        const context = (componentContext && componentContext.data) || this.props;
        const {isValidStudent, purchaseDate} = getPriceTextData(context);

        if (!(isValidStudent && purchaseDate)) {
            return null;
        }
        return <PurchaseTextDisplay purchaseDate={purchaseDate} />;
    }
}
