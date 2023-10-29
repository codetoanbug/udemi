import {getUniqueId} from '@udemy/design-system-utils';
import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {
    DatePicker,
    FormGroup,
    ToggleInputBlockFormGroup,
    TextInput,
    TimePicker,
    RadioBlock,
} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Tooltip} from '@udemy/react-popup-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import FormattedCurrency from 'base-components/price-text/formatted-currency.react-component';
import TextInputWithAddons from 'base-components/ungraduated/form/text-input/text-input-with-addons.react-component';

import {couponCreationTypes, couponCodeCreationModalValidStates} from '../../../constants';
import {formatDateInCouponCreationModal} from '../../date';
import CopyButton from './copy-button.react-component';
import './coupon-creation-modal.less';

@inject('couponsStore')
@observer
export default class CouponCreationModal extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.couponCodeInputId = getUniqueId('coupon-code-input');
        this.couponLinkInputId = getUniqueId('coupon-link-input');
    }

    @autobind
    updateCouponCreationInfo({currentTarget}) {
        this.props.couponsStore.initializeCouponInfo(currentTarget.value);
    }

    @autobind
    updateCouponCode({target}) {
        this.props.couponsStore.setCouponCode(target.value.toUpperCase());
        this.props.couponsStore.checkInvalidChars();
    }

    @autobind
    updateCouponPrice({target}) {
        this.props.couponsStore.setCouponPrice(parseFloat(target.value));
    }

    @autobind
    updateCouponStartDate(couponStartDate) {
        this.props.couponsStore.setCouponStartDate(couponStartDate);
    }

    @autobind
    updateCouponStartTime({target}) {
        this.props.couponsStore.setCouponStartTime(target.value);
    }

    renderTooltipIcon(text) {
        const icon = <InfoIcon label={gettext('Get info')} />;
        return (
            <Tooltip placement="bottom" trigger={icon} styleName="tooltip-icon">
                {text}
            </Tooltip>
        );
    }

    renderCouponDetailBody() {
        const urgencyDiscount = couponCreationTypes.urgency_discount;
        const longDiscount = couponCreationTypes.long_discount;
        const urgencyFree = couponCreationTypes.urgency_free;
        const scarcityFree = couponCreationTypes.scarcity_free;

        const couponsStore = this.props.couponsStore;
        const currentState = couponsStore.couponCreationModalCurrentState;
        const currencyFormat = this.props.couponsStore.currencyFormat;

        return (
            <>
                <ToggleInputBlockFormGroup label={gettext('Pick a coupon type')}>
                    {couponsStore.disablePaidCoupons && (
                        <AlertBanner
                            showCta={false}
                            styleName="alert-banner"
                            title={gettext("Coupon prices can't be higher than list price")}
                        />
                    )}
                    <div styleName="coupon-options">
                        <div styleName="coupon-option">
                            <RadioBlock
                                name="coupon-type"
                                value={urgencyDiscount.name}
                                checked={couponsStore.couponTypeSelection === urgencyDiscount.name}
                                onChange={this.updateCouponCreationInfo}
                                disabled={couponsStore.disablePaidCoupons}
                            >
                                <span styleName="block text-with-tooltip-icon">
                                    <span>{urgencyDiscount.label}</span>
                                    {this.renderTooltipIcon(urgencyDiscount.tooltip)}
                                </span>
                                <span className="ud-text-sm" styleName="block mt-xxs">
                                    <FormattedCurrency
                                        value={couponsStore.couponDiscountUrgencyMinPrice}
                                        {...currencyFormat}
                                    />
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {urgencyDiscount.redemption_info}
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {ninterpolate(
                                        'Expires in %s day',
                                        'Expires in %s days',
                                        couponsStore.couponDiscountUrgencyDuration,
                                    )}
                                </span>
                            </RadioBlock>
                        </div>
                        <div styleName="coupon-option">
                            <RadioBlock
                                name="coupon-type"
                                value={longDiscount.name}
                                checked={couponsStore.couponTypeSelection === longDiscount.name}
                                onChange={this.updateCouponCreationInfo}
                                disabled={couponsStore.disablePaidCoupons}
                            >
                                <span styleName="block text-with-tooltip-icon">
                                    <span>{longDiscount.label}</span>
                                    {this.renderTooltipIcon(longDiscount.tooltip)}
                                </span>
                                <span className="ud-text-sm" styleName="block mt-xxs">
                                    {interpolate(gettext('Between %s and %s'), [
                                        couponsStore.formattedCouponDiscountLongPlaceholderPrice,
                                        couponsStore.formattedCouponDiscountLongMaxPrice,
                                    ])}
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {longDiscount.redemption_info}
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {ninterpolate(
                                        'Expires in %s day',
                                        'Expires in %s days',
                                        couponsStore.couponDiscountLongDuration,
                                    )}
                                </span>
                            </RadioBlock>
                        </div>
                        <div styleName="coupon-option">
                            <RadioBlock
                                name="coupon-type"
                                value={urgencyFree.name}
                                checked={couponsStore.couponTypeSelection === urgencyFree.name}
                                onChange={this.updateCouponCreationInfo}
                            >
                                <span styleName="block">
                                    {interpolate(urgencyFree.label, [
                                        couponsStore.couponFreeUrgencyDuration,
                                    ])}
                                </span>
                                <span className="ud-text-sm" styleName="block mt-sm">
                                    {ninterpolate(
                                        '%s redemption',
                                        '%s redemptions',
                                        couponsStore.couponFreeUrgencyMaximumUses,
                                    )}
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {ninterpolate(
                                        'Expires in %s day',
                                        'Expires in %s days',
                                        couponsStore.couponFreeUrgencyDuration,
                                    )}
                                </span>
                            </RadioBlock>
                        </div>
                        <div styleName="coupon-option">
                            <RadioBlock
                                name="coupon-type"
                                value={scarcityFree.name}
                                checked={couponsStore.couponTypeSelection === scarcityFree.name}
                                onChange={this.updateCouponCreationInfo}
                            >
                                <span styleName="block">
                                    {interpolate(scarcityFree.label, [
                                        couponsStore.couponFreeScarcityDuration,
                                    ])}
                                </span>
                                <span className="ud-text-sm" styleName="block mt-sm">
                                    {ninterpolate(
                                        '%s redemption',
                                        '%s redemptions',
                                        couponsStore.couponFreeScarcityMaximumUses,
                                    )}
                                </span>
                                <span className="ud-text-sm" styleName="block">
                                    {ninterpolate(
                                        'Expires in %s day',
                                        'Expires in %s days',
                                        couponsStore.couponFreeScarcityDuration,
                                    )}
                                </span>
                            </RadioBlock>
                        </div>
                    </div>
                </ToggleInputBlockFormGroup>
                {currentState === couponCodeCreationModalValidStates.coupon_details && (
                    <>
                        {urgencyDiscount.name === couponsStore.couponTypeSelection && (
                            <React.Fragment key={urgencyDiscount.name}>
                                <div className="ud-heading-lg" styleName="mt-sm">
                                    {gettext('Price')}
                                </div>
                                <div className="ud-heading-lg" styleName="mt-xs">
                                    <FormattedCurrency
                                        value={couponsStore.couponPrice}
                                        {...currencyFormat}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                        {longDiscount.name === couponsStore.couponTypeSelection && (
                            <React.Fragment key={longDiscount.name}>
                                <FormGroup
                                    styleName="mt-sm"
                                    label={gettext('Set your price')}
                                    labelProps={{typography: 'ud-heading-lg'}}
                                    validationState={couponsStore.couponPriceValidationState}
                                    note={
                                        couponsStore.couponPriceErrorMessage ||
                                        interpolate(gettext('Set a price between %s and %s'), [
                                            couponsStore.formattedCouponDiscountLongPlaceholderPrice,
                                            couponsStore.formattedCouponDiscountLongMaxPrice,
                                        ])
                                    }
                                >
                                    <TextInput
                                        type="number"
                                        placeholder={
                                            couponsStore.couponDiscountLongPlaceholderPrice
                                        }
                                        onChange={this.updateCouponPrice}
                                    />
                                </FormGroup>
                            </React.Fragment>
                        )}
                        <FormGroup
                            styleName="mt-sm"
                            udStyle="fieldset"
                            label={
                                <span styleName="text-with-tooltip-icon">
                                    <span>{gettext('Start date')}</span>
                                    {this.renderTooltipIcon(
                                        gettext(
                                            'Time and hour is in Pacific Standard Time (PST). Start date can be selected only within the current month.',
                                        ),
                                    )}
                                </span>
                            }
                            labelProps={{typography: 'ud-heading-md'}}
                            validationState={couponsStore.couponStartDateValidationState}
                            note={couponsStore.couponStartDateErrorMessage}
                        >
                            <div styleName="datetime-inputs">
                                <FormGroup
                                    label={gettext('Date')}
                                    labelProps={{className: 'ud-sr-only'}}
                                >
                                    <DatePicker
                                        min={couponsStore.today}
                                        max={couponsStore.currentMonthEndDate}
                                        value={couponsStore.couponStartDate}
                                        onChange={this.updateCouponStartDate}
                                        size="medium"
                                        popoverPlacement="top-start"
                                        data-purpose="coupon-start-date"
                                    />
                                </FormGroup>
                                <FormGroup
                                    label={gettext('Time')}
                                    labelProps={{className: 'ud-sr-only'}}
                                >
                                    <TimePicker
                                        value={couponsStore.couponStartTime}
                                        onChange={this.updateCouponStartTime}
                                        size="medium"
                                        data-purpose="coupon-start-time"
                                    />
                                </FormGroup>
                            </div>
                        </FormGroup>
                        <div className="ud-heading-md" styleName="mt-sm">
                            {gettext('End date')}
                        </div>
                        <div styleName="mt-xs">
                            {formatDateInCouponCreationModal(couponsStore.couponEndDate)}
                        </div>
                        <FormGroup
                            styleName="mt-sm"
                            label={gettext('Edit your coupon code')}
                            labelProps={{
                                tag: gettext('Optional'),
                                typography: 'ud-heading-md',
                            }}
                            validationState={couponsStore.couponCodeValidationState}
                            note={
                                couponsStore.couponCodeErrorMessage ||
                                gettext(
                                    'Your coupon code must be between 6 and 20 characters. It can only contain alphanumeric characters (A-Z, 0-9), periods ("."), dashes ("-") or underscores ("_")',
                                )
                            }
                        >
                            <TextInput
                                value={couponsStore.couponCode}
                                onChange={this.updateCouponCode}
                            />
                        </FormGroup>
                        <FooterButtons>
                            <Button
                                disabled={
                                    currentState === couponCodeCreationModalValidStates.coupon_type
                                }
                                onClick={couponsStore.submitCouponForReview}
                            >
                                {gettext('Review coupon')}
                            </Button>
                        </FooterButtons>
                    </>
                )}
            </>
        );
    }

    renderCouponReviewBody() {
        const urgencyDiscount = couponCreationTypes.urgency_discount;
        const longDiscount = couponCreationTypes.long_discount;
        const urgencyFree = couponCreationTypes.urgency_free;
        const scarcityFree = couponCreationTypes.scarcity_free;

        const couponsStore = this.props.couponsStore;
        const paidCouponTypes = this.props.couponsStore.paidCouponTypes;
        const freeCouponTypes = this.props.couponsStore.freeCouponTypes;
        const currencyFormat = this.props.couponsStore.currencyFormat;
        return (
            <>
                <div className="ud-heading-md">{gettext('Coupon code')}</div>
                <div className="ud-text-sm" styleName="mt-xs">
                    {couponsStore.couponCode}
                </div>
                {urgencyDiscount.name === couponsStore.couponTypeSelection && (
                    <React.Fragment key={urgencyDiscount.name}>
                        <div className="ud-heading-md" styleName="mt-sm">
                            {gettext('Details')}
                        </div>
                        <div className="ud-text-sm ud-text-bold" styleName="mt-xs">
                            {`${urgencyDiscount.label}: `}
                            <FormattedCurrency
                                value={couponsStore.couponPrice}
                                {...currencyFormat}
                            />
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {urgencyDiscount.redemption_info}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                'Expires in %s day',
                                'Expires in %s days',
                                paidCouponTypes[urgencyDiscount.version].duration,
                            )}
                        </div>
                    </React.Fragment>
                )}
                {longDiscount.name === couponsStore.couponTypeSelection && (
                    <React.Fragment key={longDiscount.name}>
                        <div className="ud-heading-md" styleName="mt-sm">
                            {gettext('Details')}
                        </div>
                        <div className="ud-text-sm ud-text-bold" styleName="mt-xs">
                            {`${longDiscount.label}: `}
                            <FormattedCurrency
                                value={couponsStore.couponPrice}
                                {...currencyFormat}
                            />
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {longDiscount.redemption_info}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                'Expires in %s day',
                                'Expires in %s days',
                                paidCouponTypes[longDiscount.version].duration,
                            )}
                        </div>
                    </React.Fragment>
                )}
                {urgencyFree.name === couponsStore.couponTypeSelection && (
                    <React.Fragment key={urgencyFree.name}>
                        <div className="ud-heading-md" styleName="mt-sm">
                            {gettext('Details')}
                        </div>
                        <div className="ud-text-sm ud-text-bold" styleName="mt-xs">
                            {urgencyFree.label}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                '%s redemption',
                                '%s redemptions',
                                couponsStore.couponFreeUrgencyMaximumUses,
                            )}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                'Expires in %s day',
                                'Expires in %s days',
                                freeCouponTypes[urgencyFree.version].duration,
                            )}
                        </div>
                    </React.Fragment>
                )}
                {scarcityFree.name === couponsStore.couponTypeSelection && (
                    <React.Fragment key={scarcityFree.name}>
                        <div className="ud-heading-md" styleName="mt-sm">
                            {gettext('Details')}
                        </div>
                        <div className="ud-text-sm ud-text-bold" styleName="mt-xs">
                            {scarcityFree.label}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                '%s redemption',
                                '%s redemptions',
                                couponsStore.couponFreeScarcityMaximumUses,
                            )}
                        </div>
                        <div className="ud-text-sm" styleName="mt-xxs">
                            {ninterpolate(
                                'Expires in %s day',
                                'Expires in %s days',
                                freeCouponTypes[scarcityFree.version].duration,
                            )}
                        </div>
                    </React.Fragment>
                )}
                <div className="ud-heading-md" styleName="mt-sm">
                    {gettext('Start date')}
                </div>
                <div className="ud-text-sm" styleName="mt-xs">
                    {formatDateInCouponCreationModal(couponsStore.couponStartDate)}
                </div>
                <div className="ud-heading-md" styleName="mt-sm">
                    {gettext('End date')}
                </div>
                <div className="ud-text-sm" styleName="mt-xs">
                    {formatDateInCouponCreationModal(couponsStore.couponEndDate)}
                </div>
                <FooterButtons>
                    <div styleName="left-right-buttons">
                        <Button onClick={couponsStore.editCoupon} udStyle="secondary">
                            {gettext('Edit coupon')}
                        </Button>
                        <Button onClick={couponsStore.createCoupon}>
                            {gettext('Create coupon')}
                        </Button>
                    </div>
                </FooterButtons>
            </>
        );
    }

    renderCouponSuccessBody() {
        return (
            <>
                <div className="ud-heading-lg" styleName="text-center">
                    {gettext('Your coupon is now scheduled')}
                </div>
                <div className="ud-text-sm" styleName="mt-xs text-center">
                    {gettext('Share your coupons with the following links')}
                </div>
                <FormGroup
                    styleName="mt-sm"
                    label={gettext('Code')}
                    formControlId={this.couponCodeInputId}
                >
                    <TextInputWithAddons>
                        <TextInput
                            readOnly={true}
                            value={this.props.couponsStore.finalCoupon}
                            data-purpose="coupon-code-input"
                        />
                        <TextInputWithAddons.Addon
                            componentClass={CopyButton}
                            udStyle="secondary"
                            data-clipboard-target={`#${this.couponCodeInputId}`}
                        >
                            {gettext('Copy')}
                        </TextInputWithAddons.Addon>
                    </TextInputWithAddons>
                </FormGroup>
                <FormGroup
                    styleName="mt-sm"
                    label={gettext('Link')}
                    formControlId={this.couponLinkInputId}
                >
                    <TextInputWithAddons>
                        <TextInput
                            readOnly={true}
                            value={this.props.couponsStore.couponUrl}
                            data-purpose="coupon-link-input"
                        />
                        <TextInputWithAddons.Addon
                            componentClass={CopyButton}
                            data-clipboard-target={`#${this.couponLinkInputId}`}
                            udStyle="secondary"
                        >
                            {gettext('Copy')}
                        </TextInputWithAddons.Addon>
                    </TextInputWithAddons>
                </FormGroup>
            </>
        );
    }

    render() {
        const currentState = this.props.couponsStore.couponCreationModalCurrentState;
        const remainingCouponCount = this.props.couponsStore.couponMetadata.remaining_coupon_count;

        let title, body;
        if (currentState === couponCodeCreationModalValidStates.loading) {
            title = <span className="ud-sr-only">{gettext('Loading')}</span>;
            body = <MainContentLoader styleName="loader" />;
        } else if (
            currentState === couponCodeCreationModalValidStates.coupon_type ||
            currentState === couponCodeCreationModalValidStates.coupon_details
        ) {
            title = (
                <>
                    {gettext('Create a new coupon')}
                    <span className="ud-text-md" styleName="block mt-xs">
                        {ninterpolate(
                            'You can create %(couponCount)s new coupon until the end of %(month)s',
                            'You can create %(couponCount)s more coupons until the end of %(month)s',
                            remainingCouponCount,
                            {
                                couponCount: remainingCouponCount,
                                month: this.props.couponsStore.currentMonth,
                            },
                        )}
                    </span>
                </>
            );
            body = this.renderCouponDetailBody();
        } else if (currentState === couponCodeCreationModalValidStates.review_coupon) {
            title = (
                <>
                    {gettext('Review your coupon details')}
                    <span className="ud-text-md" styleName="block mt-xs">
                        {gettext("You won't be able to make changes once you create the coupon")}
                    </span>
                </>
            );
            body = this.renderCouponReviewBody();
        } else if (currentState === couponCodeCreationModalValidStates.creation_success) {
            title = gettext('Congratulations!');
            body = this.renderCouponSuccessBody();
        }

        return (
            <Modal
                isOpen={this.props.couponsStore.isCouponCreationModalOpen}
                onClose={this.props.couponsStore.closeCouponCreationModal}
                title={title}
            >
                {body}
            </Modal>
        );
    }
}
