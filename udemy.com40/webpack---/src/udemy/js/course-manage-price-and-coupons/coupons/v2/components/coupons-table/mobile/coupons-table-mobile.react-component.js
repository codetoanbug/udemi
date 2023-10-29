import {Button} from '@udemy/react-core-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Accordion} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {couponTableFields, noResultFoundText} from 'course-manage-price-and-coupons/constants';
import formatCurrency from 'utils/currency-formatter';
import {noop} from 'utils/noop';

import CouponCodeLink from '../coupon-code-link.react-component';
import SearchCoupons from '../search-coupons.react-component';
import './coupons-mobile.less';

@inject('couponsStore')
@observer
export default class CouponsTableMobile extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        valid: PropTypes.bool.isRequired,
        collapsible: PropTypes.bool,
        expanded: PropTypes.bool,
        toggleOpen: PropTypes.func,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
        collapsible: false,
        expanded: false,
        toggleOpen: noop,
        isLoading: false,
    };

    @computed
    get items() {
        if (this.props.valid) {
            return this.props.couponsStore.validCoupons;
        }
        return this.props.couponsStore.filteredInvalidCoupons;
    }

    @computed
    get fields() {
        return [
            {
                name: couponTableFields.CODE.name,
                label: couponTableFields.CODE.label,
                value: (coupon) => coupon.code,
            },
            {
                name: couponTableFields.DISCOUNT.name,
                label: couponTableFields.DISCOUNT.label,
                value: (coupon) =>
                    formatCurrency(coupon.discount_value, coupon.discount_currency_format),
            },
            {
                name: couponTableFields.USES.name,
                label: couponTableFields.USES.mobile.label,
                value: (coupon) => coupon.remainingRedemptionsText,
            },
            {
                name: couponTableFields.CREATED.name,
                label: couponTableFields.CREATED.label,
                value: (coupon) => coupon.startTimeTextInPst({tzOffset: false}),
            },
            {
                name: couponTableFields.ENDTIME.name,
                label: couponTableFields.ENDTIME.mobile.label,
                value: (coupon) => coupon.endTimeTextInPst({tzOffset: false}),
            },
            ...(this.props.valid ? this.validFields : []),
        ];
    }

    @computed
    get validFields() {
        return [
            {
                name: couponTableFields.LINK.name,
                label: couponTableFields.LINK.mobile.label,
                value: this.renderLinkButton,
            },
        ];
    }

    @autobind
    renderLinkButton(coupon) {
        return (
            <CouponCodeLink
                coupon={coupon}
                courseUrl={this.props.couponsStore.course.url}
                styleName="coupon-link"
                udStyle="secondary"
                size="medium"
                label={gettext('Copy link to coupon')}
            />
        );
    }

    @autobind
    renderCoupons() {
        if (this.items.length === 0) {
            return <p styleName="no-results">{noResultFoundText}</p>;
        }

        return (
            <div styleName={classNames({loading: this.props.isLoading})}>
                {this.items.map((item, index) => (
                    <div key={index} styleName="coupon" data-purpose="coupon">
                        {this.fields.map((field, i) => (
                            <div key={i} data-purpose="coupon-field">
                                {field.label && (
                                    <span className="ud-text-bold">{`${field.label}: `}</span>
                                )}
                                {field.value(item)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const {valid, collapsible, couponsStore, title, toggleOpen, expanded} = this.props;

        const panel = (
            <div>
                {valid ? (
                    <Button
                        udStyle="link"
                        styleName="create-multiple-coupons"
                        typography="ud-text-md ud-link-underline"
                        componentClass="a"
                        href="/instructor/multiple-coupons-creation/"
                    >
                        {gettext('Create multiple coupons')}
                    </Button>
                ) : (
                    <div styleName="search-coupons" data-purpose="coupons-search">
                        <SearchCoupons />
                    </div>
                )}
                {this.renderCoupons()}
                {!valid && (
                    <Pagination
                        data-purpose="coupons-table-pagination"
                        styleName="pagination"
                        onPageChange={couponsStore.setPage}
                        activePage={couponsStore.page}
                        pageCount={couponsStore.numPages}
                    />
                )}
            </div>
        );

        if (collapsible) {
            return (
                <Accordion styleName="container">
                    <Accordion.Panel
                        styleName="accordion-panel"
                        title={title}
                        expanded={expanded}
                        onToggle={toggleOpen}
                    >
                        {panel}
                    </Accordion.Panel>
                </Accordion>
            );
        }

        return (
            <div styleName="container">
                <div styleName="title">
                    <h3 className="ud-heading-lg">{title}</h3>
                </div>
                {panel}
            </div>
        );
    }
}
