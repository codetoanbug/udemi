import {RootCloseWrapper} from '@udemy/design-system-utils';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import RichTextEditorModel from './rich-text-editor.mobx-model';

let id = 0;

@observer
class MathEditor extends Component {
    static propTypes = {
        node: PropTypes.object.isRequired,
        getPos: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        doCommand: PropTypes.func.isRequired,
        isInline: PropTypes.bool.isRequired,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        const {content} = props.node.content;
        this.id = ++id;
        this.content = content[0].text;
        this.contentRef = React.createRef();
        this.props.model.registerMathEditor(this.id, this.props.getPos, this.mathTypeset);
    }

    componentDidMount() {
        this.mathTypeset();
    }

    componentWillUnmount() {
        this.props.model.unregisterMathEditor(this.id);
    }

    @autobind
    mathTypeset() {
        const {mathjaxLib} = this.props.model;
        if (mathjaxLib) {
            mathjaxLib.startup.promise = mathjaxLib.startup.promise.then(() =>
                mathjaxLib.typesetPromise([this.contentRef.current]),
            );
        }
    }

    @autobind
    onRootClose() {
        const {activeMathEditor} = this.props.model;
        if (activeMathEditor) {
            // On IE11, it's possible for onRootClose to fire after componentWillUnmount,
            // in which case this.mathEditorModel is undefined.
            activeMathEditor.setIsOverlayShown(false);
            this.mathTypeset();
        }
    }

    @autobind
    onMouseDown(event) {
        // This is needed to prevent math from being draggable.
        event.preventDefault();
    }

    get mathEditorModel() {
        return this.props.model.getMathEditor(this.id);
    }

    @autobind
    onMathClick(event) {
        // The math can be inside an anchor. For IE11 and Edge, we need to preventDefault()
        // so that the anchor href is not triggered.
        event.stopPropagation(); // Prevent this.onRootClose.
        event.preventDefault();
        this.mathTypeset();
        this.props.model.setActiveMathEditor(this.id);
        this.props.doCommand('CLICK_MATH', {focusOnEditor: false});
    }

    @autobind
    onEditButtonClick() {
        this.mathTypeset();
        this.props.model.setActiveMathEditor(this.id);
        this.props.model.mathForm.setMathRepresentation(this.content);
        this.props.model.mathForm.setIsInline(this.props.isInline);
        this.props.doCommand('PROMPT_MATH_EDIT', {focusOnEditor: false});
    }

    @autobind
    renderMath() {
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                className="rt-math-editor__representation"
                ref={this.contentRef}
                onClick={this.onMathClick}
                role="math presentation"
                onMouseDown={this.onMouseDown}
                data-purpose="math-render"
            >
                {this.content}
            </div>
        );
    }

    renderEditMode() {
        // On IPad, onClick handler doesn't work for some reason.
        const buttonHandler = isMobileBrowser
            ? {onTouchStart: this.onEditButtonClick}
            : {onClick: this.onEditButtonClick};
        return (
            <RootCloseWrapper onRootClose={this.onRootClose}>
                <div className="rt-math-editor__container" onMouseDown={this.onMouseDown}>
                    {this.renderMath()}
                    <div className="rt-node-editor__overlay">
                        <Button
                            className="rt-node-editor__overlay-btn"
                            udStyle="primary"
                            size="xsmall"
                            data-purpose="edit-math-btn"
                            {...buttonHandler}
                        >
                            {this.props.gettext('Edit')}
                        </Button>
                    </div>
                </div>
            </RootCloseWrapper>
        );
    }

    render() {
        return this.mathEditorModel.isOverlayShown ? this.renderEditMode() : this.renderMath();
    }
}

export default withI18n(MathEditor);
