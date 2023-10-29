import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {showSuccessToast} from 'instructor/toasts';
import {noop} from 'utils/noop';

import FreePaidWarning from './free-paid-warning.react-component';
import OwnerOptIn from './owner-opt-in.react-component';
import PremiumInstructorWarning from './premium-instructor-warning.react-component';
import PriceSelect from './price-select.react-component';
import '../price.less';

@inject('priceStore')
@observer
export default class PriceForm extends Component {
    static propTypes = {
        priceStore: PropTypes.object.isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        onSaveComplete: () => true,
    };

    @autobind
    onAmountChange(option) {
        this.props.priceStore.form.setData({amount: option.props.value});
    }

    @autobind
    onCurrencyChange(option) {
        const toCurrency = option.props.value;
        const form = this.props.priceStore.form;
        this.props.priceStore.loadPriceTiers().then(() => {
            const exchangedAmount = this.props.priceStore.exchangePriceTierAmount(
                form.data.amount,
                form.data.currency,
                toCurrency,
            );
            form.setData({amount: exchangedAmount, currency: toCurrency});
        });
    }

    @autobind
    onSubmit(event) {
        event.preventDefault();
        this.props.priceStore.form
            .submit()
            .then(() => {
                this.props.onSaveComplete();
                showSuccessToast(gettext('Your changes have been successfully saved.'));
            })
            .catch(noop);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <PremiumInstructorWarning />
                <FreePaidWarning />
                <OwnerOptIn
                    isOwnerOptedIntoDeals={this.props.priceStore.isOwnerOptedIntoDeals}
                    isPracticeTestCourse={this.props.priceStore.course.is_practice_test_course}
                    publishedPracticeTestCount={
                        this.props.priceStore.course.num_published_practice_tests
                    }
                />
                <PriceSelect
                    onAmountChange={this.onAmountChange}
                    onCurrencyChange={this.onCurrencyChange}
                />
            </form>
        );
    }
}
