import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {SOURCE_PAGES} from 'share/constants';
import {isMarketplaceShareEnabled} from 'share/helpers';
import MarketplaceSocialShareButton from 'share/marketplace-social-share-button.react-component';
import * as marketplaceSocialShareLazilyLoadedModule from 'share/marketplace-social-share-lazily-loaded';

function shareableCourse(course) {
    return {id: course.id, type: 'course', is_private: course.isPrivate, title: course.title};
}

@observer
export default class MarketplaceShareMenuItem extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    render() {
        const {course} = this.props.courseTakingStore;
        return (
            <MarketplaceSocialShareButton
                buttonStyle="white-outline"
                context={SOURCE_PAGES.COURSE_TAKING}
                fullWidth={false}
                load={() => Promise.resolve(marketplaceSocialShareLazilyLoadedModule)}
                shareableObject={shareableCourse(course)}
                sourceUrl={course.url}
            />
        );
    }
}

MarketplaceShareMenuItem.shouldRender = ({courseTakingStore}) => {
    const {enrollment, course} = courseTakingStore;
    return !!enrollment && isMarketplaceShareEnabled(shareableCourse(course));
};
