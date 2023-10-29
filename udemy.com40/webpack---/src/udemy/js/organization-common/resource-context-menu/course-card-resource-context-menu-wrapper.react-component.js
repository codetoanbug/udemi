import {withMatchMedia} from '@udemy/hooks';
import {SaveToListButton} from '@udemy/shopping';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './course-card-resource-context-menu.less';

@inject(
    ({
        resourceContextMenu,
        resourceContextMenuProps,
        uiRegion,
        isConsumerSubsSubscriber = false,
    }) => ({
        resourceContextMenu,
        resourceContextMenuProps,
        uiRegion,
        isConsumerSubsSubscriber,
    }),
)
@withMatchMedia({isDesktop: 'md-min'})
export default class CourseCardResourceContextMenuWrapper extends React.Component {
    static propTypes = {
        course: PropTypes.object.isRequired,
        resourceContextMenu: PropTypes.object,
        resourceContextMenuProps: PropTypes.object,
        className: PropTypes.string,
        isDesktop: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
        uiRegion: PropTypes.string.isRequired,
        isConsumerSubsSubscriber: PropTypes.bool,
    };

    static defaultProps = {
        resourceContextMenu: {},
        resourceContextMenuProps: {},
        className: undefined,
        isDesktop: null,
        isConsumerSubsSubscriber: false,
    };

    render() {
        const {
            children,
            className,
            course,
            isDesktop,
            resourceContextMenu,
            resourceContextMenuProps,
            isConsumerSubsSubscriber,
        } = this.props;

        const courseContextMenu = resourceContextMenu.getCourseCardContextMenu
            ? resourceContextMenu.getCourseCardContextMenu(
                  {...course, isPublished: true},
                  resourceContextMenuProps,
              )
            : null;

        if (courseContextMenu) {
            return (
                <div className={classNames(className, styles['card-wrapper'])}>
                    {children}
                    <div className={styles['more-menu-button']}>{courseContextMenu}</div>
                </div>
            );
        }
        if (course.is_in_user_subscription) {
            return (
                <div
                    className={classNames(
                        className,
                        styles['card-wrapper'],
                        styles['card-wrapper-save-button'],
                    )}
                >
                    {children}
                    <SaveToListButton
                        course={course}
                        udStyle={isDesktop ? 'secondary' : 'ghost'}
                        typography="ud-heading-md"
                        size={isDesktop ? 'large' : 'medium'}
                        uiRegion={this.props.uiRegion}
                        labelPosition={isConsumerSubsSubscriber && !isDesktop ? 'right' : 'left'}
                        label={isConsumerSubsSubscriber ? gettext('Save') : undefined}
                    />
                </div>
            );
        }
        return children;
    }
}
