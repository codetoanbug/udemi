import {Badge} from '@udemy/react-messaging-components';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import {loadingState} from '../constants';
import Course from '../course.mobx-model';
import PriceRoute from './price-route.react-component';
import {PriceStore} from './price.mobx-store';
// eslint-disable-next-line import/no-unresolved
import {PriceRouteV2} from './v2/price-route.react-component';

import './beta-badge.less';

@withRouter
@observer
export default class Price extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        pageStore: PropTypes.object.isRequired,
        onSaveComplete: PropTypes.func,
    };

    static defaultProps = {
        onSaveComplete: () => true,
    };

    constructor(props) {
        super(props);
        props = {course: new Course(props.courseId), ...props};
        this.priceStore = new PriceStore(props);
        this.priceStore.loadPricePageVersion();
    }

    componentDidMount() {
        const {pageStore} = this.props;
        pageStore.getContentLengthVideo();
    }

    render() {
        if (this.priceStore.pricePageVersionLoadingState !== loadingState.loaded) {
            return <></>;
        }
        const {courseId, ...routerProps} = this.props;
        if (this.priceStore.instructorPageVersion == 'v2') {
            return (
                <Provider priceStore={this.priceStore}>
                    <div>
                        <SubHeader title={gettext('Pricing')}>
                            <Badge styleName="beta-badge">{gettext('Beta')}</Badge>
                        </SubHeader>
                        <MainContent>
                            <PriceRouteV2
                                isOwnerOptedIntoDeals={this.priceStore.isOwnerOptedIntoDeals}
                                course={this.priceStore.course}
                            />
                        </MainContent>
                    </div>
                </Provider>
            );
        }
        return (
            <Provider priceStore={this.priceStore}>
                <div>
                    <SubHeader title={gettext('Pricing')} />
                    <MainContent>
                        <PriceRoute {...routerProps} />
                    </MainContent>
                </div>
            </Provider>
        );
    }
}
