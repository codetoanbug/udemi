import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {TRACKING_CATEGORIES} from '../constants';
import requires from '../registry/requires';
import {MAIN_CONTENT} from './constants';
import ItemLink, {FakeLink} from './item-link.react-component';

@requires('courseTakingStore')
@observer
export default class NextItemLink extends React.Component {
    /*
    A wrapper around our ItemLink to cover special cases at end of course.
    */
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            nextCurriculumItem: PropTypes.object,
            showReviewPromptIfNeeded: PropTypes.func,
        }).isRequired,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: undefined,
    };

    @autobind
    onClick(event) {
        this.props.onClick && this.props.onClick(); // just execute click tracking

        const {courseTakingStore} = this.props;
        if (courseTakingStore.showReviewPromptIfNeeded()) {
            event.preventDefault();
        } else if (!courseTakingStore.nextCurriculumItem) {
            // show end screen after the last item if no review screen shown
            courseTakingStore.setMainContentType(MAIN_CONTENT.END_SCREEN);
        } else if (courseTakingStore.showLabsPromptIfNeeded()) {
            event.preventDefault();
        }

        courseTakingStore.track(TRACKING_CATEGORIES.COURSE_CONTENT_VIEW);
    }

    render() {
        const {courseTakingStore, ...linkProps} = this.props;
        const {nextCurriculumItem} = courseTakingStore;
        if (!nextCurriculumItem) {
            return <FakeLink {...linkProps} onClick={this.onClick} data-purpose="go-to-next" />;
        }

        return (
            <ItemLink
                {...linkProps}
                itemType={nextCurriculumItem.type}
                itemId={nextCurriculumItem.id}
                onClick={this.onClick}
                data-purpose="go-to-next"
            />
        );
    }
}
