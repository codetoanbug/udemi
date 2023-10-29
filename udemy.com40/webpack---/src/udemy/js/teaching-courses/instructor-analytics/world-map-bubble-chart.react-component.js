import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';

import instructorTokens from 'instructor/variables';
import {formatNumber} from 'utils/numeral';

import Datamap from './datamaps.react-component';
import './world-map-bubble-chart.less';

export default class WorldMapBubbleChart extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                centered: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                fillKey: PropTypes.string.isRequired,
                num_students: PropTypes.number.isRequired,
                radius: PropTypes.number.isRequired,
            }),
        ).isRequired,
    };

    tooltipHTML(countryName, numStudents) {
        return ReactDOMServer.renderToStaticMarkup(
            <div styleName="chart-tooltip">
                {`${countryName}: ${ninterpolate(
                    '%(count)s student',
                    '%(count)s students',
                    numStudents,
                    {count: formatNumber(numStudents)},
                )}`}
            </div>,
        );
    }

    render() {
        return (
            <Datamap
                styleName="map-chart"
                responsive={true}
                geographyConfig={{
                    popupOnHover: false,
                    highlightOnHover: false,
                    borderColor: instructorTokens['color-data-student-map-country-border-color'],
                    borderWidth: 0.3,
                }}
                fills={{
                    defaultFill: instructorTokens['color-data-student-map-country-fill-color'],
                    bubbleFill: instructorTokens['color-data-student-map-bubble-color'],
                }}
                bubbles={this.props.data}
                bubbleOptions={{
                    popupTemplate: (geo, data) => this.tooltipHTML(data.name, data.num_students),
                    borderWidth: 1,
                    highlightBorderWidth: 2,
                    borderColor: instructorTokens['color-data-student-map-bubble-color'],
                    highlightBorderColor: instructorTokens['color-data-student-map-bubble-color'],
                    highlightFillColor: instructorTokens['color-data-student-map-bubble-color'],
                }}
            />
        );
    }
}
