import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumEditorStore from './curriculum-editor.mobx-store';

import './add-item.less';

@inject('store')
export default class AddItemToggler extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
        className: PropTypes.string,
        relatedItemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onClick: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        isLastItem: PropTypes.bool,
        type: PropTypes.oneOf(['section', 'lecture']),
    };

    static defaultProps = {
        className: '',
        type: 'lecture',
        isLastItem: false,
    };

    shouldComponentUpdate(nextProps) {
        return (
            this.props.isOpen !== nextProps.isOpen || this.props.isLastItem !== nextProps.isLastItem
        );
    }

    @autobind
    handleClick() {
        this.props.onClick(this.props.relatedItemKey);
    }

    render() {
        const {className, store, isOpen, type, isLastItem} = this.props;

        if (!store.inlineInsertEnabled) {
            return null;
        }

        const isLecture = type === 'lecture';

        const label = isOpen ? gettext('Close') : gettext('New curriculum item');

        return (
            <>
                {isLastItem ? (
                    <Button
                        styleName={classNames('add-item-toggler-last-item', {
                            open: isOpen,
                            section: !isLecture,
                        })}
                        size="small"
                        udStyle={isOpen ? 'ghost' : 'secondary'}
                        onClick={this.handleClick}
                        data-purpose="add-item-inline-last"
                    >
                        <CloseIcon
                            styleName={classNames('add-item-toggler-last-item', {
                                'expand-icon': true,
                                section: !isLecture,
                                open: isOpen,
                            })}
                            label={label}
                            size="small"
                        />
                        {!isOpen && (isLecture ? gettext('Curriculum item') : gettext('Section'))}
                    </Button>
                ) : (
                    <Button
                        udStyle="link"
                        size="xsmall"
                        className={classNames(className, 'ud-custom-focus-visible')}
                        styleName={classNames('add-item-toggler', {
                            open: isOpen,
                            lecture: isLecture,
                            section: !isLecture,
                        })}
                        data-purpose="add-item-inline"
                        onClick={this.handleClick}
                    >
                        <span className="ud-focus-visible-target" styleName="icon-wrapper">
                            <CloseIcon label={label} size="small" styleName="icon" />
                        </span>
                    </Button>
                )}
            </>
        );
    }
}
