import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import WrapWithText from 'base-components/ungraduated/text/wrap-with-text.react-component';

import InfoTooltip from './info-tooltip.react-component';
import './tab-chart.less';

@observer
export default class TabChartTab extends Component {
    static propTypes = {
        primaryDataLabel: PropTypes.string.isRequired,
        primaryData: PropTypes.string.isRequired,
        secondaryData: PropTypes.string,
        hasTooltip: PropTypes.bool.isRequired,
        tooltipText: PropTypes.node,
        tooltipFunc: PropTypes.func,
        tooltipFuncParams: PropTypes.array,
    };

    static defaultProps = {
        secondaryData: null,
        tooltipText: null,
        tooltipFunc: () => null,
        tooltipFuncParams: [],
    };

    render() {
        return (
            <div className="ud-text-md" styleName="metrics-data">
                <WrapWithText
                    className="ud-text-sm"
                    text={this.props.primaryDataLabel}
                    graphic={
                        this.props.hasTooltip && (
                            <InfoTooltip placement="right">
                                {this.props.tooltipText ||
                                    this.props.tooltipFunc.apply(
                                        null,
                                        this.props.tooltipFuncParams,
                                    )}
                            </InfoTooltip>
                        )
                    }
                />
                <div className="ud-text-xl" styleName="metrics-data-primary">
                    {this.props.primaryData}
                </div>
                {this.props.secondaryData}
            </div>
        );
    }
}
