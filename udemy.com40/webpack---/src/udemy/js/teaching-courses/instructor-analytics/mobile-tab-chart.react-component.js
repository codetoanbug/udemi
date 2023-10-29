import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './tab-chart.less';

@observer
export default class MobileTabChart extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
    };

    render() {
        const routes = this.props.routes.filter((route) => route.metrics);
        return (
            <>
                {routes.map((route) => (
                    <div key={route.path} styleName="container">
                        {route.tab}
                        {route.content}
                    </div>
                ))}
            </>
        );
    }
}
