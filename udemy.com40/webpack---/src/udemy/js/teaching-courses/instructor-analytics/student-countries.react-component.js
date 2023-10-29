import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import WorldMapBubbleChart from './world-map-bubble-chart.react-component';
import './instructor-analytics.less';

@inject('store')
@observer
export default class StudentCountries extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div>
                <div styleName="heading">
                    <h2 className="ud-heading-lg">{gettext('Your reach')}</h2>
                </div>
                <p>{gettext("See your students' locations and languages")}</p>
                <WorldMapBubbleChart
                    data={this.props.store.studentStore.countries.studentCountriesChartData}
                />
            </div>
        );
    }
}
