import {GenericAddToCart} from '@udemy/cart';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, PropTypes as mobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AjaxModal from 'base-components/dialog/ajax-modal.react-component';
import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';
import getPriceTextData from 'course-landing-page/components/price-text/helpers';
import ShoppingClient from 'shopping-client/shopping-client.mobx-store';
import {isomorphic} from 'utils/isomorphic-rendering';

import {CacheableBuyButton} from './../buy-button/buy-button.react-isocomponent';
import styles from './add-to-cart.less';

@observer
class BaseAddToCart extends Component {
    static propTypes = {
        componentContext: PropTypes.shape({
            data: PropTypes.object.isRequired,
        }),
        buyables: PropTypes.oneOfType([
            PropTypes.arrayOf(
                PropTypes.shape({
                    buyable_object_type: PropTypes.string.isRequired,
                    id: PropTypes.number.isRequired,
                }),
            ),
            mobxPropTypes.arrayOrObservableArrayOf(
                PropTypes.shape({
                    buyable_object_type: PropTypes.string.isRequired,
                    id: PropTypes.number.isRequired,
                }),
            ),
        ]),
        cartButtonTextAdd: PropTypes.string,
        onAddRedirectUrl: PropTypes.string,
        eventTrackingContext: PropTypes.object,
        className: PropTypes.string,
        udStyle: PropTypes.string,
        size: PropTypes.oneOf(['medium', 'large']),
        addToCartContext: PropTypes.shape({
            fbt_add_to_cart: PropTypes.bool,
        }),
        allowAddToCartSuccessModal: PropTypes.bool,
        forceGoToCart: PropTypes.bool,
        cartButtonTextGoToCart: PropTypes.string,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        componentContext: undefined,
        buyables: [],
        cartButtonTextAdd: undefined,
        onAddRedirectUrl: undefined,
        eventTrackingContext: {},
        className: '',
        udStyle: 'brand',
        size: 'large',
        addToCartContext: undefined,
        allowAddToCartSuccessModal: true,
        forceGoToCart: false,
        cartButtonTextGoToCart: undefined,
    };

    componentDidMount() {
        this.setIsMounted();
    }

    @observable isMounted = false;
    @observable isModalOpen = false;

    @autobind
    @action
    showCartSuccessModal() {
        this.isModalOpen = true;
    }

    @autobind
    @action
    hideCartSuccessModal() {
        this.isModalOpen = false;
    }

    @action
    setIsMounted() {
        this.isMounted = true;
    }

    attachCourseTrackingIdToBuyables(buyables) {
        // set the tracking ID from course tracking context for when we are top-level rendered
        // by app.js
        buyables.forEach((buyable) => {
            if (!buyable.frontendTrackingId) {
                buyable.frontendTrackingId = this.props.eventTrackingContext.courseTrackingId;
            }
        });
    }

    createBuyableUrl() {
        const buyable = this.props.buyables[0];
        return `/cart/added-popup/${buyable.buyable_object_type}/${buyable.id}/`;
    }

    render() {
        const {
            buyables,
            cartButtonTextAdd = this.props.gettext('Add to cart'),
            componentContext,
            onAddRedirectUrl,
            eventTrackingContext,
        } = this.props;

        if (eventTrackingContext.courseTrackingId) {
            this.attachCourseTrackingIdToBuyables(buyables);
        }

        const modal = (
            <AjaxModal
                labelledById="cart-success-title"
                url={this.createBuyableUrl()}
                isOpen={this.isModalOpen}
                onClose={this.hideCartSuccessModal}
            />
        );

        const context = (componentContext && componentContext.data) || this.props;
        if (componentContext && componentContext.data) {
            // If the user is actually a student of this course, we want to show the `Go To Course` CTA
            const {isValidStudent} = getPriceTextData(context);
            if (isValidStudent) {
                return <CacheableBuyButton {...this.props} />;
            }
        }

        return (
            <GenericAddToCart
                buttonClass={Button}
                buyables={buyables.slice()}
                cartButtonTextAdd={cartButtonTextAdd}
                cartButtonClassesAdd={this.props.className}
                cartButtonClassesGoToCart={this.props.className}
                disabled={!this.isMounted}
                loader={<Loader color="inherit" size="medium" />}
                notificationStyle={styles['add-to-cart__notification']}
                onAddRedirectUrl={onAddRedirectUrl}
                shoppingClient={ShoppingClient}
                addToCartSuccessModal={modal}
                addToCartContext={this.props.addToCartContext}
                showCartSuccessModal={this.showCartSuccessModal}
                buttonStyleProps={{
                    udStyle: this.props.udStyle || 'brand',
                    size: this.props.size,
                }}
                allowAddToCartSuccessModal={this.props.allowAddToCartSuccessModal}
                forceGoToCart={this.props.forceGoToCart}
                cartButtonTextGoToCart={this.props.cartButtonTextGoToCart}
            />
        );
    }
}

export const AddToCartCacheableComponent = injectCourseLandingPageData('purchase')(BaseAddToCart);

const AddToCart = isomorphic(withI18n(BaseAddToCart));
export default AddToCart;
