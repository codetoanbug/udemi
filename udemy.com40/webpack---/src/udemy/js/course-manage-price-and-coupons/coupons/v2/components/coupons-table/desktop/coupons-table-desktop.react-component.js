import {Button} from '@udemy/react-core-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {couponTableFields, noResultFoundText} from 'course-manage-price-and-coupons/constants';
import formatCurrency from 'utils/currency-formatter';

import CouponCodeLink from '../coupon-code-link.react-component';
import EnableCouponToggler from '../enable-coupon-toggler.react-component';
import SearchCoupons from '../search-coupons.react-component';

import './coupons-desktop.less';

@inject('couponsStore')
@observer
export default class CouponsTableDesktop extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
        valid: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool,
    };

    static defaultProps = {
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
    get columns() {
        return [
            {
                fieldName: couponTableFields.CODE.name,
                headerName: couponTableFields.CODE.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnCode,
            },
            {
                fieldName: couponTableFields.DISCOUNT.name,
                headerName: couponTableFields.DISCOUNT.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnDiscount,
            },
            ...(this.props.valid ? this.validColumns : this.invalidColumns),
        ];
    }

    @computed
    get validColumns() {
        return [
            {
                fieldName: couponTableFields.ENDTIME.name,
                headerName: couponTableFields.ENDTIME.desktop.valid.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnTimeRemaining,
            },
            {
                fieldName: couponTableFields.USES.name,
                headerName: couponTableFields.USES.desktop.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnRedemptions,
            },
            {
                fieldName: couponTableFields.LINK.name,
                headerName: couponTableFields.LINK.desktop.label,
                renderMethod: this.renderCellInColumnLink,
            },
            {
                fieldName: couponTableFields.STATUS.name,
                headerName: couponTableFields.STATUS.label,
                renderMethod: this.renderCellInColumnStatus,
                width: '1%',
            },
        ];
    }

    @computed
    get invalidColumns() {
        return [
            {
                fieldName: couponTableFields.CREATED.name,
                headerName: couponTableFields.CREATED.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnStartDate,
            },
            {
                fieldName: couponTableFields.ENDTIME.name,
                headerName: couponTableFields.ENDTIME.desktop.invalid.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnEndDate,
            },
            {
                fieldName: couponTableFields.USES.name,
                headerName: couponTableFields.USES.desktop.label,
                initialSortOrder: 'ascending',
                renderMethod: this.renderCellInColumnRedemptions,
            },
        ];
    }

    @computed
    get onSort() {
        const store = this.props.couponsStore;
        return this.props.valid ? store.setValidOrdering : store.setInvalidOrdering;
    }

    @computed
    get sortBy() {
        const store = this.props.couponsStore;
        return this.props.valid ? store.validSortBy : store.invalidSortBy;
    }

    @autobind
    renderCellInColumnCode(coupon) {
        return coupon.code;
    }

    @autobind
    renderCellInColumnTimeRemaining(coupon) {
        if (!coupon.end_time) {
            return gettext('Unlimited');
        }
        return (
            <div>
                <div>{coupon.remainingDaysText}</div>
                <div className="ud-text-sm">
                    {`${gettext('Starts')} ${coupon.startTimeTextInPst()}`}
                </div>
                <div className="ud-text-sm">
                    {`${gettext('Expires')} ${coupon.endTimeTextInPst()}`}
                </div>
            </div>
        );
    }

    @autobind
    renderCellInColumnStartDate(coupon) {
        return coupon.createdText;
    }

    @autobind
    renderCellInColumnEndDate(coupon) {
        return coupon.endTimeText;
    }

    @autobind
    renderCellInColumnLink(coupon) {
        return (
            <CouponCodeLink
                coupon={coupon}
                courseUrl={this.props.couponsStore.course.url}
                typography="ud-text-md ud-link-underline"
                udStyle="link"
                size="small"
            />
        );
    }

    @autobind
    renderCellInColumnDiscount(coupon) {
        return formatCurrency(coupon.discount_value, coupon.discount_currency_format);
    }

    @autobind
    renderCellInColumnRedemptions(coupon) {
        return coupon.remainingRedemptionsText;
    }

    @autobind
    renderCellInColumnStatus(coupon) {
        return (
            <EnableCouponToggler
                coupon={coupon}
                course={this.props.couponsStore.course}
                styleName="enable-coupon-toggler"
            />
        );
    }

    @autobind
    renderTable() {
        if (this.items.length === 0) {
            return (
                <div styleName="no-results">
                    <p>{noResultFoundText}</p>
                </div>
            );
        }

        return (
            <div styleName={classNames({loading: this.props.isLoading})}>
                <Table
                    noBackgroundColor={true}
                    caption={this.props.title}
                    columns={this.columns}
                    rows={this.items}
                    onSort={this.onSort}
                    sortBy={this.sortBy}
                />
            </div>
        );
    }

    render() {
        const {valid, couponsStore, title} = this.props;

        return (
            <div>
                <div styleName="title-container">
                    <h3 className="ud-heading-md">{title}</h3>
                    {valid ? (
                        <Button
                            udStyle="link"
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
                </div>
                {this.renderTable()}
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
    }
}
