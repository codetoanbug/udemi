import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CouponsTableDesktop from './desktop/coupons-table-desktop.react-component';
import CouponsTableMobile from './mobile/coupons-table-mobile.react-component';

@inject('couponsStore')
@observer
export default class CouponsTable extends Component {
    static propTypes = {
        couponsStore: PropTypes.object.isRequired,
        isMobileMax: PropTypes.bool.isRequired,
    };

    render() {
        const Component = this.props.isMobileMax ? CouponsTableMobile : CouponsTableDesktop;
        const {couponsStore} = this.props;
        return (
            <>
                <Component
                    valid={true}
                    title={gettext('Active/Scheduled coupons')}
                    isLoading={couponsStore.validCouponsLoading}
                />
                <Component
                    valid={false}
                    title={gettext('Expired coupons')}
                    collapsible={true}
                    expanded={couponsStore.invalidCouponsExpanded}
                    toggleOpen={couponsStore.toggleOpenForInvalidCoupons}
                    isLoading={couponsStore.invalidCouponsLoading}
                />
            </>
        );
    }
}
