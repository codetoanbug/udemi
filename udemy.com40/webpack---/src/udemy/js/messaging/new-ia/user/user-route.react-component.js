import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

@inject('store')
@observer
export default class UserRoute extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    async componentDidMount() {
        try {
            const response = await this.props.store.fetchThreadForUser(this.props.match.params.id);
            let location = {};
            if (response.data.results && response.data.results[0]) {
                location = `${this.props.store.baseUrl}/${response.data.results[0].id}/detail/`;
            } else if (response.data.other_user) {
                location = {
                    pathname: `${this.props.store.baseUrl}/compose/`,
                    state: {
                        user: response.data.other_user,
                    },
                };
            } else {
                location = `${this.props.store.baseUrl}/`;
            }
            this.props.history.push(location);
        } catch (error) {
            this.props.history.push(`${this.props.store.baseUrl}/`);
        }
    }

    render() {
        return <MainContentLoader />;
    }
}
