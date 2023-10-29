import {TrackingContextProvider} from '@udemy/event-tracking';
import {FunnelLogContextStore} from '@udemy/funnel-tracking';
import {CourseCardSkeletonGroup} from '@udemy/react-reveal-components';
import {withUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {discoveryTracker} from 'browse/tracking';

import styles from './card-container.less';
import CardContainerStore from './card-container.mobx-store';
import WindowShoppingCard from './window-shopping-card.react-component';

@inject('discoveryUnitsStore', 'funnelLogContextStore')
@observer
export class InternalCardContainer extends Component {
    static propTypes = {
        unit: PropTypes.object.isRequired,
        discoveryUnitsStore: PropTypes.object.isRequired,
        className: PropTypes.string,
        funnelLogContextStore: PropTypes.instanceOf(FunnelLogContextStore).isRequired,
        cardProps: PropTypes.object,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        className: undefined,
        cardProps: undefined,
    };

    constructor(props) {
        super(props);
        const {discoveryUnitsStore, unit} = this.props;
        const {pageType} = discoveryUnitsStore;
        this.store = new CardContainerStore(pageType, unit, this.props.udData);
        this.props.funnelLogContextStore.updateContext({
            context2: 'featured',
            subcontext: this.props.unit.title,
            subcontext2: this.props.unit.id,
        });
    }

    componentDidMount() {
        if (!this.store.unit.items.length) {
            this.fetch();
        }
    }

    fetch = () => {
        return this.store.fetchUnit({pageSize: 6});
    };

    render() {
        if (!this.store.unit.items.length && this.store.loading) {
            return (
                <CourseCardSkeletonGroup
                    rowCount={3}
                    size="small"
                    cardCountPerRow={2}
                    style={{
                        width: '100%',
                        height: '150px',
                    }}
                />
            );
        }
        return (
            <div className={classNames(this.props.className, styles.container)}>
                {this.store.unit.items.map((course, i) => {
                    return (
                        <TrackingContextProvider
                            key={course.id}
                            trackingContext={{
                                trackImpressionFunc: discoveryTracker.trackDiscoveryImpression,
                                index: i,
                                backendSource: this.store.backendSource,
                            }}
                        >
                            <WindowShoppingCard
                                key={course.id}
                                course={course}
                                {...this.props.cardProps}
                            />
                        </TrackingContextProvider>
                    );
                })}
            </div>
        );
    }
}

const CardContainer = withUDData(InternalCardContainer);
export default CardContainer;
