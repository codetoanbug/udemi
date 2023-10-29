import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {noop} from 'utils/noop';

import CurriculumItemModel from './curriculum-item.mobx-model';
import './default-item-editor.less';

@observer
export default class DefaultItemEditor extends Component {
    static propTypes = {
        addContent: PropTypes.node,
        className: PropTypes.string,
        curriculumItem: PropTypes.instanceOf(CurriculumItemModel).isRequired,
        dataPurpose: PropTypes.string,
        editContent: PropTypes.node,
        editForm: PropTypes.node,
        hasInitialFocus: PropTypes.bool,
        onSetRef: PropTypes.func,
        shouldOpenEditContentInitially: PropTypes.bool,
    };

    static defaultProps = {
        addContent: null,
        className: '',
        dataPurpose: 'item-editor',
        editContent: null,
        editForm: null,
        hasInitialFocus: false,
        onSetRef: noop,
        shouldOpenEditContentInitially: false,
    };

    UNSAFE_componentWillMount() {
        if (this.props.shouldOpenEditContentInitially || this.props.hasInitialFocus) {
            this.props.curriculumItem.openEditContent();
        }
    }

    componentDidMount() {
        if (this.props.hasInitialFocus) {
            setTimeout(this.setScrollInitialFocus);
        }
    }

    @observable showInitialFocus = false;

    @autobind
    @action
    setScrollInitialFocus() {
        // The right solution will be scrollIntoView but safari and IE doesn't
        // understand "block: 'center'" so the lecture will be under the fixed header
        // this.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const offsetTop = this.element.getBoundingClientRect().top;
        const delta = parseInt(window.innerHeight / 2, 10);
        window.scrollTo({top: offsetTop - delta, left: 0});
        this.showInitialFocus = true;
    }

    @autobind
    setRef(ref) {
        this.element = ref;
        this.props.onSetRef(ref);
    }

    render() {
        // We want "Open Edit", "Open Add", "Close Add" to
        // result in "Open Edit", so we make `isAddContentOpen: true` override
        // `isEditContentOpen: true`.
        // We use css instead of if/else to show/hide addContent and editContent
        // because it is noticeably faster when these components contain a lot of content
        // (e.g. a quiz with max number of assessments).
        // On the other hand, we use if/else to show/hide editForm because it relies on
        // componentDidMount to reset with correct initial data.
        const {
            curriculumItem,
            className,
            children,
            dataPurpose,
            addContent,
            editContent,
            editForm,
        } = this.props;
        const {isEditFormOpen, isAddContentOpen, isEditContentOpen} = curriculumItem;
        return (
            <div
                ref={this.setRef}
                data-purpose={dataPurpose}
                className={className}
                styleName={classNames('item-editor', {'intial-focus': this.showInitialFocus})}
            >
                {editForm && isEditFormOpen ? editForm : null}
                <div styleName={classNames({hidden: isEditFormOpen})}>{children}</div>
                <div
                    data-purpose="add-content-wrapper"
                    styleName={classNames('add-content', {hidden: !isAddContentOpen})}
                >
                    {addContent}
                </div>
                <div
                    data-purpose="edit-content-wrapper"
                    styleName={classNames('edit-content', {
                        hidden: isAddContentOpen || !isEditContentOpen,
                    })}
                >
                    {editContent}
                </div>
            </div>
        );
    }
}
