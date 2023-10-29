import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import requires from '../registry/requires';
import KeepRedirect from '../utils/keep-redirect.react-component.js';
import {LECTURE_START_PARAM} from './constants';

@withRouter
@requires('courseTakingStore')
@observer
export default class ItemRedirect extends React.Component {
    /*
    A wrapper around the standard Redirect component to allow easy redirection to a curriculum item,
    whilst maintaining the current hash state.
     */
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        itemType: PropTypes.string.isRequired,
        itemId: PropTypes.number.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        staticContext: PropTypes.object,
    };

    static defaultProps = {
        staticContext: null,
    };

    render() {
        // location, match, history and staticContext injected by withRouter.
        const {
            courseTakingStore,
            itemType,
            itemId,
            location,
            match,
            history,
            staticContext,
            ...redirectProps
        } = this.props;

        const to = {
            pathname: `/${itemType}/${itemId}`,
            hash: this.props.history.location.hash,
        };

        const {curriculumItem} = courseTakingStore.getCurriculumItemContextByTypeAndId(
            itemType,
            itemId,
        );
        if (curriculumItem && curriculumItem.lastWatchedSecond !== undefined) {
            to.search = `${LECTURE_START_PARAM}=${curriculumItem.lastWatchedSecond}`;
        }

        return <KeepRedirect to={to} {...redirectProps} keepHash={true} keepSearch={true} />;
    }
}
