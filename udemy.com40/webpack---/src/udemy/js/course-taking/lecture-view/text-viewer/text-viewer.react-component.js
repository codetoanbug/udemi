import PropTypes from 'prop-types';
import React from 'react';

import ResourceList from '../../course-content/resource-list.react-component';
import {ITEM_TYPES} from '../../curriculum/constants';
import CurriculumItemFooter from '../../curriculum/controls/curriculum-item-footer.react-component';
import requires from '../../registry/requires';

import './text-viewer.less';

@requires('lectureViewStore')
export default class TextViewer extends React.Component {
    /*
        A wrapper for Article and Unavailable views.
     */
    static propTypes = {
        lectureViewStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.lectureViewStore.onContentReady();
    }

    get resources() {
        const {lecture} = this.props.lectureViewStore;
        if (!lecture.resources.length) {
            return null;
        }
        return (
            <>
                <div className="ud-text-xl" styleName="resources-heading">
                    {gettext('Resources for this lecture')}
                </div>
                <ResourceList item={lecture} resources={lecture.resources} />
            </>
        );
    }

    render() {
        const {lecture} = this.props.lectureViewStore;
        return (
            <div styleName="container">
                <div styleName="scroll-container">
                    <div styleName="content">
                        <div className="ud-heading-xxl" styleName="main-heading">
                            {lecture.title}
                        </div>
                        {this.props.children}
                        {this.resources}
                    </div>
                </div>
                <CurriculumItemFooter reportId={lecture.id} reportType={ITEM_TYPES.LECTURE} />
            </div>
        );
    }
}
