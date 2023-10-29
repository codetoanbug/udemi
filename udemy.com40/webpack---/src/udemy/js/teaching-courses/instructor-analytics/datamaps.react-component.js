// Originally imported from https://github.com/btmills/react-datamaps@0.4.1 but modified to our needs.

import autobind from 'autobind-decorator';
import Datamaps from 'datamaps/dist/datamaps.world.hires';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './world-map-bubble-chart.less';

const MAP_CLEARING_PROPS = ['height', 'scope', 'setProjection', 'width'];

const propChangeRequiresMapClear = (oldProps, newProps) => {
    return MAP_CLEARING_PROPS.some((key) => oldProps[key] !== newProps[key]);
};

// Countries supported by DataMaps in high resolution.
// 'ATA', 'MYT', 'MTQ' are supported but don't have accurate positions on the map.
export const SUPPORTED_COUNTRIES = [
    'ABW',
    'AFG',
    'AGO',
    'AIA',
    'ALA',
    'ALB',
    'AND',
    'ARE',
    'ARG',
    'ARM',
    'ASM',
    'ATF',
    'ATG',
    'AUS',
    'AUT',
    'AZE',
    'BDI',
    'BEL',
    'BEN',
    'BES',
    'BFA',
    'BGD',
    'BGR',
    'BHR',
    'BHS',
    'BIH',
    'BLM',
    'BLR',
    'BLZ',
    'BMU',
    'BOL',
    'BRA',
    'BRB',
    'BRN',
    'BTN',
    'BVT',
    'BWA',
    'CAF',
    'CAN',
    'CCK',
    'CHE',
    'CHL',
    'CHN',
    'CIV',
    'CMR',
    'COD',
    'COG',
    'COK',
    'COL',
    'COM',
    'CPV',
    'CRI',
    'CUB',
    'CUW',
    'CXR',
    'CYM',
    'CYP',
    'CZE',
    'DEU',
    'DJI',
    'DMA',
    'DNK',
    'DOM',
    'DZA',
    'ECU',
    'EGY',
    'ERI',
    'ESH',
    'ESP',
    'EST',
    'ETH',
    'FIN',
    'FJI',
    'FLK',
    'FRA',
    'FRO',
    'FSM',
    'GAB',
    'GBR',
    'GEO',
    'GGY',
    'GHA',
    'GIB',
    'GIN',
    'GLP',
    'GMB',
    'GNB',
    'GNQ',
    'GRC',
    'GRD',
    'GRL',
    'GTM',
    'GUF',
    'GUM',
    'GUY',
    'HKG',
    'HMD',
    'HND',
    'HRV',
    'HTI',
    'HUN',
    'IDN',
    'IMN',
    'IND',
    'IOT',
    'IRL',
    'IRN',
    'IRQ',
    'ISL',
    'ISR',
    'ITA',
    'JAM',
    'JEY',
    'JOR',
    'JPN',
    'KAZ',
    'KEN',
    'KGZ',
    'KHM',
    'KIR',
    'KNA',
    'KOR',
    'KWT',
    'LAO',
    'LBN',
    'LBR',
    'LBY',
    'LCA',
    'LIE',
    'LKA',
    'LSO',
    'LTU',
    'LUX',
    'LVA',
    'MAC',
    'MAF',
    'MAR',
    'MCO',
    'MDA',
    'MDG',
    'MDV',
    'MEX',
    'MHL',
    'MKD',
    'MLI',
    'MLT',
    'MMR',
    'MNE',
    'MNG',
    'MNP',
    'MOZ',
    'MRT',
    'MSR',
    'MUS',
    'MWI',
    'MYS',
    'NAM',
    'NCL',
    'NER',
    'NFK',
    'NGA',
    'NIC',
    'NIU',
    'NLD',
    'NOR',
    'NPL',
    'NRU',
    'NZL',
    'OMN',
    'PAK',
    'PAN',
    'PCN',
    'PER',
    'PHL',
    'PLW',
    'PNG',
    'POL',
    'PRI',
    'PRK',
    'PRT',
    'PRY',
    'PSE',
    'PYF',
    'QAT',
    'REU',
    'ROU',
    'RUS',
    'RWA',
    'SAU',
    'SDN',
    'SEN',
    'SGP',
    'SGS',
    'SHN',
    'SJM',
    'SLB',
    'SLE',
    'SLV',
    'SMR',
    'SOM',
    'SPM',
    'SRB',
    'SSD',
    'STP',
    'SUR',
    'SVK',
    'SVN',
    'SWE',
    'SWZ',
    'SXM',
    'SYC',
    'SYR',
    'TCA',
    'TCD',
    'TGO',
    'THA',
    'TJK',
    'TKL',
    'TKM',
    'TLS',
    'TON',
    'TTO',
    'TUN',
    'TUR',
    'TUV',
    'TWN',
    'TZA',
    'UGA',
    'UKR',
    'UMI',
    'URY',
    'USA',
    'UZB',
    'VAT',
    'VCT',
    'VEN',
    'VGB',
    'VIR',
    'VNM',
    'VUT',
    'WLF',
    'WSM',
    'YEM',
    'ZAF',
    'ZMB',
    'ZWE',
];

export default class Datamap extends React.Component {
    static propTypes = {
        arc: PropTypes.array,
        arcOptions: PropTypes.object,
        bubbleOptions: PropTypes.object,
        bubbles: PropTypes.array,
        data: PropTypes.object,
        graticule: PropTypes.bool,
        height: PropTypes.any,
        labels: PropTypes.bool,
        responsive: PropTypes.bool,
        style: PropTypes.object,
        updateChoroplethOptions: PropTypes.object,
        width: PropTypes.any,
    };

    static defaultProps = {
        arc: undefined,
        arcOptions: undefined,
        bubbleOptions: undefined,
        bubbles: undefined,
        data: undefined,
        graticule: undefined,
        height: undefined,
        labels: undefined,
        responsive: undefined,
        style: undefined,
        updateChoroplethOptions: undefined,
        width: undefined,
    };

    componentDidMount() {
        if (this.props.responsive) {
            window.addEventListener('resize', this.resizeMap);
        }
        this.drawMap();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (propChangeRequiresMapClear(this.props, newProps)) {
            this.clear();
        }
    }

    componentDidUpdate() {
        this.drawMap();
    }

    componentWillUnmount() {
        this.clear();
        if (this.props.responsive) {
            window.removeEventListener('resize', this.resizeMap);
        }
    }

    @autobind
    setRef(container) {
        this.container = container;
    }

    clear() {
        for (const child of Array.from(this.container.childNodes)) {
            this.container.removeChild(child);
        }

        delete this.map;
    }

    @autobind
    fixPosition(container) {
        const tooltip = container.querySelector('.datamaps-hoverover');
        if (tooltip) {
            let tooltipLeft = (tooltip.style.left || '').replace(/px$/, '');
            tooltipLeft = parseInt(tooltipLeft, 10) || 0;
            const containerWidth = container.offsetWidth;
            if (tooltipLeft > containerWidth / 2) {
                tooltip.classList.add(styles['chart-tooltip-right']);
                tooltip.style.right = `${containerWidth - tooltipLeft}px`;
            } else {
                tooltip.classList.remove(styles['chart-tooltip-right']);
                tooltip.style.right = null;
            }
        }
    }

    // Tooltips are always positioned with "left: _px" and they go off screen when they start at the
    // very right side of the map.
    fixBubblePopupPositionBug(bubbleOptions) {
        const originalTemplateFn = bubbleOptions && bubbleOptions.popupTemplate;
        if (!originalTemplateFn) {
            return;
        }

        bubbleOptions.popupTemplate = (geo, data) => {
            this.fixPosition(this.container);
            return originalTemplateFn(geo, data);
        };
    }

    drawMap() {
        const {
            arc,
            arcOptions,
            bubbles,
            bubbleOptions,
            data,
            graticule,
            labels,
            updateChoroplethOptions,
            ...props
        } = this.props;

        let map = this.map;

        if (!map) {
            map = this.map = new Datamaps({
                ...props,
                aspectRatio: 0.4825,
                data,
                element: this.container,
            });
        } else {
            map.updateChoropleth(data, updateChoroplethOptions);
        }

        if (arc) {
            map.arc(arc, arcOptions);
        }

        if (bubbles) {
            this.fixBubblePopupPositionBug(bubbleOptions);
            map.bubbles(bubbles, bubbleOptions);
        }

        if (graticule) {
            map.graticule();
        }

        if (labels) {
            map.labels();
        }
    }

    @autobind
    resizeMap() {
        this.map.resize();
    }

    render() {
        const style = {
            position: 'relative',
            height: '100%',
            width: '100%',
            ...this.props.style,
        };

        return <div ref={this.setRef} style={style} />;
    }
}
