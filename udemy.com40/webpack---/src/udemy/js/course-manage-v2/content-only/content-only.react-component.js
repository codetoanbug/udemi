import PropTypes from 'prop-types';
import React, {Component} from 'react';

import MainContent from 'course-manage-v2/main-content.react-component';

import Page from './content-only-page.react-component';

export default class ContentOnly extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        pageType: PropTypes.string.isRequired,
        onPageOpen: PropTypes.func.isRequired,
    };

    render() {
        const {courseId, pageType, onPageOpen} = this.props;
        return (
            <MainContent wideContent={true}>
                <Page courseId={courseId} pageType={pageType} onPageOpen={onPageOpen} />
            </MainContent>
        );
    }
}
