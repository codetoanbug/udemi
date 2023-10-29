import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Switch, withRouter} from 'react-router-dom';

@withRouter
export default class HashSwitch extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    };

    render() {
        const pathname = this.props.location.hash.slice(1); // remove leading "#"
        const customLocation = {pathname};

        // from here on, hash portion can be treated as the path provided this custom location object is used
        return <Switch location={customLocation}>{this.props.children}</Switch>;
    }
}
