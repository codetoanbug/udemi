import {Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import Course from '../course.mobx-model';
import PercentCouponsRoute from './v2/percent-coupons-route.react-component';
import PercentCouponsStore from './v2/percent-coupons.mobx-store';

@withRouter
export default class Coupons extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        onSaveComplete: () => true,
    };

    constructor(props) {
        super(props);
        props = {course: new Course(props.courseId), ...props};
        this.couponsStore = new PercentCouponsStore(props);
    }

    render() {
        const {courseId, ...routerProps} = this.props;
        return (
            <Provider couponsStore={this.couponsStore}>
                <div>
                    <SubHeader title={gettext('Promotions')} />
                    <MainContent>
                        <PercentCouponsRoute {...routerProps} />
                    </MainContent>
                </div>
            </Provider>
        );
    }
}
