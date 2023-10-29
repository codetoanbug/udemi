import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import ExpandPlusIcon from '@udemy/icons/dist/expand-plus.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import './course-labels.less';

export default class CourseLabel extends Component {
    static propTypes = {
        label: PropTypes.object.isRequired,
        strikeThrough: PropTypes.bool,
        locked: PropTypes.bool,
        onDelete: PropTypes.func,
        onAdd: PropTypes.func,
        showAdd: PropTypes.bool,
        link: PropTypes.string,
    };

    static defaultProps = {
        strikeThrough: false,
        locked: false,
        onDelete: noop,
        onAdd: noop,
        showAdd: false,
        link: null,
    };

    @autobind
    addLabel(event) {
        event.preventDefault();
        this.props.onAdd(this.props.label);
    }

    @autobind
    deleteLabel(event) {
        event.preventDefault();
        this.props.onDelete(this.props.label);
    }

    render() {
        let clickAction, icon;
        let title = <span styleName="ellipsis">{this.props.label.title}</span>;
        if (this.props.strikeThrough && !this.props.locked && this.props.showAdd) {
            icon = <ExpandPlusIcon label={gettext('Add')} />;
            clickAction = this.addLabel;
        } else if (!this.props.strikeThrough && !this.props.locked) {
            icon = <CloseIcon label={gettext('Deselect')} />;
            clickAction = this.deleteLabel;
        }
        if (this.props.link) {
            icon = icon && (
                <Button udStyle="link" onClick={clickAction} styleName="course-label-icon-btn">
                    {icon}
                </Button>
            );
            clickAction = null;
            title = (
                <a
                    href={this.props.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    styleName="course-label-link"
                >
                    {title}
                </a>
            );
        }

        return (
            <Button
                componentClass={clickAction ? 'button' : 'div'}
                round={true}
                size="small"
                styleName={classNames('course-label', {strikethrough: this.props.strikeThrough})}
                data-purpose={`label-id-${this.props.label.id}`}
                onClick={clickAction}
            >
                {title}
                {icon}
            </Button>
        );
    }
}
