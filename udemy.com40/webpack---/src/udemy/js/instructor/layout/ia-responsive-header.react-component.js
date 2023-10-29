import {Badge} from '@udemy/react-messaging-components';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import AllCourseDropdown from 'instructor/common/all-course-dropdown.react-component';
import FilterBar from 'instructor/common/filter-bar.react-component';
import {noop} from 'utils/noop';

import './ia-responsive-header.less';

export const SimpleIAResponsiveHeader = ({title, rightCTA}) => (
    <div className="instructor-main-heading" styleName="simple-container">
        <h1 className="ud-heading-serif-xxl">{title}</h1>
        {rightCTA}
    </div>
);

SimpleIAResponsiveHeader.propTypes = {
    title: PropTypes.node.isRequired,
    rightCTA: PropTypes.node,
};

SimpleIAResponsiveHeader.defaultProps = {
    rightCTA: null,
};

@observer
export default class IAResponsiveHeader extends Component {
    static propTypes = {
        title: PropTypes.node.isRequired,
        leftItems: PropTypes.array,
        rightCTA: PropTypes.node,
        loaded: PropTypes.bool,
        allCourseDropdownData: PropTypes.shape({
            data: mobxTypes.arrayOrObservableArray,
            selectedId: PropTypes.number,
            onCourseSelect: PropTypes.func,
            disabled: PropTypes.bool,
        }),
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
        includeAllCourses: PropTypes.bool,
        badgeColorClass: PropTypes.string,
        badgeColorText: PropTypes.string,
    };

    static defaultProps = {
        leftItems: [],
        rightCTA: null,
        loaded: true,
        allCourseDropdownData: {
            data: [],
            selectedId: null,
            onCourseSelect: noop,
            disabled: false,
        },
        isUBOnlyDataPreviewEnabled: false,
        includeAllCourses: true,
        badgeColorClass: null,
        badgeColorText: null,
    };

    render() {
        const {
            title,
            leftItems,
            rightCTA,
            loaded,
            allCourseDropdownData,
            badgeColorClass,
            badgeColorText,
        } = this.props;
        return (
            <div className="instructor-main-heading" styleName="container">
                <h1 className="ud-heading-serif-xxl" styleName="title">
                    {title}
                </h1>
                {badgeColorClass && badgeColorText && (
                    <Badge styleName={badgeColorClass}>{badgeColorText}</Badge>
                )}
                {loaded && (
                    <div styleName="title-dropdown">
                        <AllCourseDropdown
                            {...allCourseDropdownData}
                            isUBOnlyDataPreviewEnabled={this.props.isUBOnlyDataPreviewEnabled}
                            includeAllCourses={this.props.includeAllCourses}
                        />
                    </div>
                )}
                {loaded && <FilterBar leftItems={leftItems} rightCTA={rightCTA} />}
            </div>
        );
    }
}
