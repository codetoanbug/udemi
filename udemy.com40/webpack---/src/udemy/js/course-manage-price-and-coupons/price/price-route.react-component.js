import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';

import {loadingState} from '../constants';
import PriceForm from './price-form/price-form.react-component';

@inject('priceStore')
@observer
export default class PriceRoute extends Component {
    static propTypes = {
        priceStore: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        onSaveComplete: () => true,
    };

    componentDidMount() {
        this.props.priceStore.course.load().then(() => {
            this.props.priceStore.form.reset();
        });
        this.props.priceStore.loadPriceTiers();
    }

    render() {
        if (this.props.priceStore.course.loadingState !== loadingState.loaded) {
            return <Loader />;
        }
        return (
            <div data-purpose="price-route">
                <PriceForm onSaveComplete={this.props.onSaveComplete} />
            </div>
        );
    }
}
