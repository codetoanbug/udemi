import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FormGroup, TextInput} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import FormattedCurrency from 'base-components/price-text/formatted-currency.react-component';
import udLink from 'utils/ud-link';

import './buy-licenses-modal.less';

@observer
export default class BuyLicensesModal extends Component {
    static propTypes = {
        importedCoursesStore: PropTypes.object.isRequired,
        course: PropTypes.object.isRequired,
    };

    @observable licensesInputValue = '1';

    @computed get numLicenses() {
        return parseInt(this.licensesInputValue, 10) || 0;
    }

    getValidationProps() {
        let error = null;
        if (this.numLicenses > 100) {
            error = gettext('Please ensure this value is less than or equal to 100.');
        } else if (this.numLicenses < 1) {
            error = gettext('Please ensure this value is greater than or equal to 1.');
        }
        return {note: error, validationState: error ? 'error' : 'neutral'};
    }

    @autobind
    @action
    handleLicensesChange(e) {
        const value = !e.target.value ? '' : Math.round(parseFloat(e.target.value));
        if (value === '' || !isNaN(value)) {
            this.licensesInputValue = `${value}`;
        }
    }

    @autobind
    @action
    purchaseLicenses() {
        this.props.importedCoursesStore
            .purchaseLicenses(this.course, this.numLicenses)
            .then((response) => {
                window.location.href = udLink.to(
                    'payment',
                    `checkout/express/license/${response.data.id}`,
                );
            });
    }

    get course() {
        return this.props.course;
    }

    @computed
    get totalPrice() {
        return parseFloat(this.course.price_detail.amount) * this.numLicenses;
    }

    renderModalBody() {
        return (
            <>
                <div styleName="section">
                    {gettext('Course:')}
                    <div className="ud-text-bold" data-purpose="buy-licenses-course-title">
                        {this.course.title}
                    </div>
                </div>
                <div styleName="section">
                    {gettext('Cost per license:')}
                    <div className="ud-text-bold">
                        <FormattedCurrency value={this.course.price_detail.amount} />
                    </div>
                </div>
                <FormGroup
                    label={gettext('Number of licenses:')}
                    {...this.getValidationProps()}
                    styleName="section"
                >
                    <TextInput
                        type="number"
                        min={1}
                        max={100}
                        value={this.licensesInputValue}
                        onChange={this.handleLicensesChange}
                        styleName="num-licenses"
                    />
                </FormGroup>
                <div styleName="section">
                    {gettext('Total cost:')}
                    <div className="ud-text-bold">
                        <FormattedCurrency value={this.totalPrice} />
                    </div>
                </div>
            </>
        );
    }

    renderModalFooter() {
        return (
            <FooterButtons>
                <Button
                    onClick={this.props.importedCoursesStore.closeBuyLicensesModal}
                    udStyle="ghost"
                >
                    {gettext('Close')}
                </Button>
                <Button data-purpose="buy-licenses-submit" onClick={this.purchaseLicenses}>
                    {gettext('Confirm purchase')}
                </Button>
            </FooterButtons>
        );
    }

    render() {
        const {importedCoursesStore} = this.props;
        return (
            <Modal
                isOpen={importedCoursesStore.isBuyLicensesModalVisible}
                onClose={importedCoursesStore.closeBuyLicensesModal}
                title={gettext('Buy licenses')}
            >
                {this.renderModalBody()}
                {this.renderModalFooter()}
            </Modal>
        );
    }
}
