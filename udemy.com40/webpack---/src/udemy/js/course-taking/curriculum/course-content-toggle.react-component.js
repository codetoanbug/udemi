import ArrowLeftIcon from '@udemy/icons/dist/arrow-left.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {SIDEBAR_CONTENT, TRACKING_CATEGORIES} from '../constants';
import requires from '../registry/requires';

import './course-content-toggle.less';

@requires('courseTakingStore')
export default class CourseContentToggle extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: false,
    };

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.props.autoFocus && this.ref.current) {
            // Need either ReactDOM or forwardRef to get the actual button element...
            // eslint-disable-next-line react/no-find-dom-node
            ReactDOM.findDOMNode(this.ref.current).focus();
        }
    }

    @autobind
    onClickOpenCourseContent() {
        this.props.courseTakingStore.selectSidebarContent(SIDEBAR_CONTENT.DEFAULT);
        this.props.courseTakingStore.track(TRACKING_CATEGORIES.COURSE_CONTENT_LIST_OPEN);
    }

    render() {
        const label = gettext('Course content');
        const a11yLabel = interpolate(gettext('Open %(title)s sidebar'), {title: label}, true);
        return (
            <Button
                onClick={this.onClickOpenCourseContent}
                udStyle="primary"
                styleName="button"
                data-purpose="open-course-content"
                ref={this.ref}
            >
                <ArrowLeftIcon label={false} size="medium" />
                <span aria-label={a11yLabel} styleName="label">
                    {label}
                </span>
            </Button>
        );
    }
}
