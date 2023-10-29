import {Dropdown} from '@udemy/react-menu-components';
import {Badge} from '@udemy/react-messaging-components';
import {pxToRem} from '@udemy/styles';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer, PropTypes as mobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';

import './all-course-dropdown.less';

@observer
export default class AllCourseDropdown extends Component {
    static propTypes = {
        data: mobxTypes.arrayOrObservableArray,
        selectedId: PropTypes.number,
        onCourseSelect: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        includeAllCourses: PropTypes.bool,
        isUBOnlyDataPreviewEnabled: PropTypes.bool,
    };

    static defaultProps = {
        data: null,
        selectedId: null,
        disabled: false,
        includeAllCourses: true,
        isUBOnlyDataPreviewEnabled: false,
    };

    @autobind renderMenuItem(
        // eslint-disable-next-line camelcase
        {id, title, disabled, is_in_any_ufb_content_collection},
        isUBOnlyDataPreviewEnabled,
    ) {
        // eslint-disable-next-line camelcase
        const displayUBBadge = isUBOnlyDataPreviewEnabled && is_in_any_ufb_content_collection;
        return (
            <Dropdown.MenuItem
                key={id}
                onClick={() => this.props.onCourseSelect(id)}
                disabled={disabled}
                data-purpose="dropdown-menu-item"
            >
                {title}
                {!!displayUBBadge && (
                    <Badge data-purpose="dropdown-course-title-badge" styleName="ub-user">
                        {'Udemy Business'}
                    </Badge>
                )}
            </Dropdown.MenuItem>
        );
    }

    pushChildren(children, items, section) {
        if (section && items.length > 0) {
            if (section.title) {
                children.push(
                    <div
                        key={`title-${section.id}`}
                        className="ud-heading-sm"
                        styleName="dropdown-menu-section-title"
                    >
                        {section.title}
                    </div>,
                );
            }
            children.push(
                <Dropdown.Menu key={`items-${section.id}`}>
                    {items.map((item) =>
                        this.renderMenuItem(item, this.props.isUBOnlyDataPreviewEnabled),
                    )}
                </Dropdown.Menu>,
            );
        } else {
            items.forEach((item) => {
                children.push(this.renderMenuItem(item, this.props.isUBOnlyDataPreviewEnabled));
            });
        }
    }

    render() {
        const {selectedId, data, includeAllCourses} = this.props;
        if (!data) {
            return null;
        }
        const publishedCourses = data.filter((item) => item.is_published);
        const unpublishedCourses = data.filter(
            (item) => item.was_ever_published && !item.is_published,
        );
        if (publishedCourses.length === 0 && unpublishedCourses.length === 0) {
            return null;
        }
        const currentCourse = data.find((course) => course.id === selectedId);

        let title = gettext('All courses');
        if (currentCourse) {
            title = currentCourse.title;
        } else if (selectedId) {
            title = gettext('Unauthorized course');
        }

        const hasSections = unpublishedCourses.length > 0;
        let children = [];
        if (includeAllCourses) {
            this.pushChildren(
                children,
                [{id: null, title: gettext('All courses')}],
                hasSections && {id: 'all', title: null},
            );
        }
        this.pushChildren(
            children,
            publishedCourses,
            hasSections && {id: 'published', title: gettext('Published')},
        );
        this.pushChildren(
            children,
            unpublishedCourses,
            hasSections && {id: 'unpublished', title: gettext('Unpublished')},
        );

        if (!hasSections) {
            children = <Dropdown.Menu>{children}</Dropdown.Menu>;
        }

        return (
            <Dropdown
                placement="bottom-start"
                menuWidth="auto"
                menuMaxHeight={`${pxToRem(500)}rem`}
                styleName="dropdown"
                trigger={
                    <Dropdown.Button
                        className="ud-link-neutral"
                        styleName="dropdown-button"
                        size="medium"
                        udStyle="ghost"
                        disabled={this.props.disabled}
                        typography="ud-heading-xl"
                    >
                        <span styleName="dropdown-title">{title}</span>
                    </Dropdown.Button>
                }
            >
                <div styleName={classNames({'dropdown-menu': !getRequestData().isMobile})}>
                    {children}
                </div>
            </Dropdown>
        );
    }
}
