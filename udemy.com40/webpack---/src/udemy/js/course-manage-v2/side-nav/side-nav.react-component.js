import MenuIcon from '@udemy/icons/dist/menu.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {PropTypes as mobxTypes, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import CoursePublishButton from 'course-manage-v2/course-publish/course-publish-button.react-component';
import CoursePublishStore from 'course-manage-v2/course-publish/course-publish.mobx-store';
import {noop} from 'utils/noop';

import SideNavItem from './side-nav-item.react-component';
import './side-nav.less';

export const NavPicker = ({
    menuList,
    menuItems,
    numInvitationRequests,
    courseId,
    onNavClick,
    withCompletion,
}) => {
    if (!withCompletion && !menuList) {
        return null;
    }

    if (withCompletion && !menuList) {
        return (
            <ListNav
                menuItems={menuItems}
                withCompletion={withCompletion}
                onNavClick={onNavClick}
                courseId={courseId}
            />
        );
    }

    const numInvitationRequestsVisible = withCompletion ? 0 : numInvitationRequests;
    return (
        <SectionedNav
            menuList={menuList}
            numInvitationRequests={numInvitationRequestsVisible}
            onNavClick={onNavClick}
            withCompletion={withCompletion}
            courseId={courseId}
        />
    );
};

NavPicker.propTypes = {
    menuList: PropTypes.object,
    menuItems: mobxTypes.arrayOrObservableArray,
    numInvitationRequests: PropTypes.number.isRequired,
    courseId: PropTypes.number.isRequired,
    onNavClick: PropTypes.func,
    withCompletion: PropTypes.bool,
};

NavPicker.defaultProps = {
    menuList: null,
    menuItems: null,
    onNavClick: noop,
    withCompletion: false,
};

export const SectionedNav = ({
    menuList,
    numInvitationRequests,
    courseId,
    onNavClick,
    withCompletion,
}) => {
    return (
        <ul className="ud-unstyled-list" styleName="nav nav-sections">
            {Object.values(menuList).map((section, sectionIndex) => (
                <li key={`section-${sectionIndex}`} styleName="nav-section">
                    {section.title && (
                        <div className="ud-heading-md" styleName="nav-section-title">
                            {section.title}
                        </div>
                    )}
                    {!section.items ? null : (
                        <ul className="ud-unstyled-list">
                            {section.items.map((item, itemIndex) => (
                                <SideNavItem
                                    key={`item-${itemIndex}`}
                                    item={item}
                                    numInvitationRequests={numInvitationRequests}
                                    withCompletion={withCompletion}
                                    courseId={courseId}
                                    onNavClick={onNavClick}
                                />
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

SectionedNav.propTypes = {
    menuList: PropTypes.object.isRequired,
    numInvitationRequests: PropTypes.number.isRequired,
    onNavClick: PropTypes.func,
    withCompletion: PropTypes.bool.isRequired,
    courseId: PropTypes.number.isRequired,
};

SectionedNav.defaultProps = {
    onNavClick: noop,
};

export const ListNav = ({menuItems, onNavClick, withCompletion, courseId}) => {
    return (
        <ul className="ud-unstyled-list" styleName="nav">
            {menuItems.map((item, itemIndex) => (
                <SideNavItem
                    key={`item-${itemIndex}`}
                    item={item}
                    withCompletion={withCompletion}
                    courseId={courseId}
                    onNavClick={onNavClick}
                />
            ))}
        </ul>
    );
};

ListNav.propTypes = {
    menuItems: mobxTypes.arrayOrObservableArray.isRequired,
    onNavClick: PropTypes.func,
    withCompletion: PropTypes.bool.isRequired,
    courseId: PropTypes.number.isRequired,
};

ListNav.defaultProps = {
    onNavClick: noop,
};

@withRouter
@observer
export default class SideNav extends Component {
    static propTypes = {
        pageStore: PropTypes.shape({
            course: PropTypes.shape({
                id: PropTypes.number,
            }).isRequired,
            courseLoaded: PropTypes.bool.isRequired,
            menuData: PropTypes.object,
            menuLoaded: PropTypes.bool.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.coursePublishStore = new CoursePublishStore({pageStore: this.props.pageStore});
    }

    @observable menuExpanded = false;

    @autobind
    @action
    toggleMenuExpanded() {
        this.menuExpanded = !this.menuExpanded;
    }

    @autobind
    @action
    resetMenu() {
        this.menuExpanded = false;
    }

    /* eslint-disable camelcase */
    render() {
        const {course, menuData, courseLoaded, menuLoaded} = this.props.pageStore;
        if (!course || !courseLoaded || !menuLoaded) {
            return <div styleName="side-nav" />;
        }
        const {
            menu_list,
            menu_items,
            button_url,
            publish_title,
            publish_action,
            with_completion,
        } = menuData;
        const numInvitationRequests = (course && course.numInvitationRequests) || 0;

        return (
            <div
                styleName={classNames('side-nav', {open: this.menuExpanded})}
                data-purpose="side-menu"
            >
                <IconButton
                    udStyle="ghost"
                    onClick={this.toggleMenuExpanded}
                    styleName="toggle-menu-btn"
                >
                    <MenuIcon label={gettext('Open menu')} size="large" />
                </IconButton>
                <NavPicker
                    withCompletion={with_completion}
                    menuList={menu_list}
                    menuItems={menu_items}
                    numInvitationRequests={numInvitationRequests}
                    onNavClick={this.resetMenu}
                    courseId={course.id}
                />
                {button_url ? (
                    <CoursePublishButton
                        publishTitle={publish_title}
                        publishAction={publish_action}
                        buttonUrl={button_url}
                        courseId={course.id}
                        styleName="publish-button"
                        store={this.coursePublishStore}
                    />
                ) : null}
            </div>
        );
    }
    /* eslint-enable camelcase */
}
