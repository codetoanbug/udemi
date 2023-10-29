import {withI18n, LocalizedHtml} from '@udemy/i18n';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {LEARN_MORE} from 'organization-common/course-retirement/constants';

import styles from './retired-course-popover-wrapper.less';

class InternalRetiredCoursePopoverWrapper extends React.Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    renderContent({className, ...props}, ...args) {
        return Popover.defaultProps.renderContent(
            {className: classNames(className, styles.tooltip), ...props},
            ...args,
        );
    }

    render() {
        const {trigger, gettext} = this.props;
        return (
            <Popover
                placement="bottom"
                trigger={trigger}
                canToggleOnHover={true}
                withPadding={false}
                detachFromTarget={true}
                renderContent={this.renderContent}
            >
                <LocalizedHtml
                    html={gettext(
                        'This action is disabled because this course is retired. ' +
                            '<a class="link">Learn more</a>',
                    )}
                    interpolate={{
                        link: (
                            <a target="_blank" rel="noopener noreferrer" href={LEARN_MORE.LINK} />
                        ),
                    }}
                    className={styles.content}
                />
            </Popover>
        );
    }
}

export default withI18n(InternalRetiredCoursePopoverWrapper);
