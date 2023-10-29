import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';

@withRouter
@observer
export default class KeepRedirect extends React.Component {
    /*
    A redirect that keeps parts of the location when redirecting.
    For example, passing the prop `keepHash` and redirecting the path keeps the hash.
    */
    static propTypes = {
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        location: PropTypes.object.isRequired,
        keepAll: PropTypes.bool,
        keepHash: PropTypes.bool,
        keepPath: PropTypes.bool,
        keepSearch: PropTypes.bool,
    };

    static defaultProps = {
        keepAll: false,
        keepHash: false,
        keepPath: false,
        keepSearch: false,
    };

    render() {
        const {keepAll, location} = this.props;
        let {keepPath, keepSearch, keepHash, to} = this.props;

        // Keep the parts of location we want.
        keepPath = keepPath || keepAll;
        keepSearch = keepSearch || keepAll;
        keepHash = keepHash || keepAll;

        const keptTo = {};
        if (keepPath) {
            keptTo.pathname = location.pathname;
        }
        if (keepHash) {
            keptTo.hash = location.hash;
        }
        if (keepSearch) {
            keptTo.search = location.search;
        }

        // Handle string `to` prop.
        if (typeof to === 'string') {
            if (to.match(/[#?]/g)) {
                throw new Error(
                    `Do not include hash or search in string \`to\` prop. Please use location object
                    style prop instead.`,
                );
            }
            to = {pathname: to};
        }

        // `to` prop overrides kept.
        to = Object.assign(keptTo, to);
        return <Redirect {...this.props} to={to} />;
    }
}
