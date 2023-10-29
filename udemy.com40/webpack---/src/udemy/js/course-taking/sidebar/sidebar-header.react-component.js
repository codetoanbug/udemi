import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './sidebar.less';

export default class SidebarHeader extends Component {
    static propTypes = {
        title: PropTypes.node.isRequired,
        a11yTitle: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: false,
    };

    componentDidMount() {
        const {title} = this.props;
        if (this.props.autoFocus && title?.ref?.current) {
            title.ref.current.focus();
        }
    }

    componentDidUpdate() {
        const {title} = this.props;
        if (this.props.autoFocus && title?.ref?.current) {
            title.ref.current.focus();
        }
    }

    render() {
        const {title, a11yTitle, onClose, autoFocus, ...props} = this.props;
        return (
            <div {...props} className={props.className} styleName="sidebar-header">
                {title}
                <Button
                    className="ud-link-neutral"
                    styleName="close-btn"
                    udStyle="link"
                    data-purpose="sidebar-button-close"
                    onClick={onClose}
                >
                    <CloseIcon
                        label={interpolate(
                            gettext('Close %(title)s sidebar'),
                            {title: a11yTitle},
                            true,
                        )}
                    />
                </Button>
            </div>
        );
    }
}
