import {RootCloseWrapper} from '@udemy/design-system-utils';
import {withI18n} from '@udemy/i18n';
import {Image, Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Resizer from 'base-components/ungraduated/resizer/resizer.react-component';
import {isMobileBrowser} from 'utils/user-agent/get-is-mobile-browser';

import RichTextEditorModel from './rich-text-editor.mobx-model';

let id = 0;

@observer
class ImageEditor extends Component {
    static propTypes = {
        node: PropTypes.object.isRequired,
        getPos: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        doCommand: PropTypes.func.isRequired,
        // gettext is provided by withI18n; do not pass it in yourself
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        id += 1;
        this.id = id;
        this.props.model.registerImageEditor(this.id, this.props.getPos);
    }

    componentWillUnmount() {
        this.props.model.unregisterImageEditor(this.id);
    }

    get imageEditorModel() {
        return this.props.model.getImageEditor(this.id);
    }

    @autobind
    onRootClose() {
        if (this.imageEditorModel) {
            // On IE11, it's possible for onRootClose to fire after componentWillUnmount,
            // in which case this.imageEditorModel is undefined.
            this.imageEditorModel.setIsOverlayShown(false);
        }
    }

    @autobind
    onMouseDown(event) {
        // This is needed to prevent images from being draggable.
        // We have `draggable: false` set in the schema, but by design ProseMirror forces
        // selected nodes to be draggable. See https://discuss.prosemirror.net/t/1052.
        // Even if we make images unselectable, we still need this for Firefox.
        //
        // This is also needed to prevent IE11 from rendering its own resize handles around
        // selected images.
        event.preventDefault();
    }

    @autobind
    onImageClick(event) {
        // The image can be inside an anchor. For IE11 and Edge, we need to preventDefault()
        // so that the anchor href is not triggered.
        event.stopPropagation(); // Prevent this.onRootClose.
        event.preventDefault();

        this.props.model.setActiveImageEditor(this.id);
        this.props.doCommand('CLICK_IMAGE', {focusOnEditor: false});
    }

    @autobind
    onEditButtonClick() {
        this.props.model.setActiveImageEditor(this.id);
        this.props.doCommand('PROMPT_IMAGE_EDIT', {focusOnEditor: false});
    }

    @autobind
    onResizeStart() {
        this.props.model.setIsResizingImage(true);
    }

    @autobind
    onResizeEnd() {
        this.props.model.setIsResizingImage(false);
        this.props.model.imageEditForm.reset({
            data: {
                width: this.imgRef.clientWidth,
                height: this.imgRef.clientHeight,
            },
        });
        this.props.doCommand('RESIZE_IMAGE', {focusOnEditor: false});
    }

    @autobind
    onResize(event, rect) {
        if (this.imgRef.naturalWidth > 0 && this.imgRef.naturalHeight > 0) {
            const aspectRatio = this.imgRef.naturalWidth / this.imgRef.naturalHeight;
            let width, height;

            // Figure out the new width of the image.
            if (aspectRatio > 1) {
                width = Math.max(100, Math.round(rect.width));
            } else {
                height = Math.max(100, Math.round(rect.height));
                width = height * aspectRatio;
            }
            this.imgRef.style.width = `${width}px`;

            // The actual width of the image is not always `style.width` because images are
            // constrained by max-width: 100%. Hence, figure out the new height using `clientWidth`.
            height = Math.round(this.imgRef.clientWidth / aspectRatio);
            this.imgRef.style.height = `${height}px`;
        }
    }

    @autobind
    setImgRef(ref) {
        // We want the underlying DOM node, not the <Image /> instance.
        // eslint-disable-next-line react/no-find-dom-node
        this.imgRef = ref ? ReactDOM.findDOMNode(ref) : null;
    }

    renderImage() {
        const {node} = this.props;
        return (
            <Image
                ref={this.setImgRef}
                {...node.attrs}
                draggable={false}
                alt={node.attrs.alt || ''}
                title={node.attrs.alt || ''}
                role="presentation"
                onClick={this.onImageClick}
                onMouseDown={this.onMouseDown}
                lazy={false}
                height={parseFloat(node.attrs.height) || 'unset'}
                width={parseFloat(node.attrs.width) || 'unset'}
            />
        );
    }

    renderEditMode() {
        const {gettext} = this.props;

        // On IPad, onClick handler doesn't work for some reason.
        const buttonHandler = isMobileBrowser
            ? {onTouchStart: this.onEditButtonClick}
            : {onClick: this.onEditButtonClick};
        return (
            <RootCloseWrapper onRootClose={this.onRootClose}>
                <Resizer
                    className="rt-image-editor"
                    data-purpose="edit-image-container"
                    edges={{right: '.js-resizer-handle', bottom: '.js-resizer-handle'}}
                    onStart={this.onResizeStart}
                    onMove={this.onResize}
                    onEnd={this.onResizeEnd}
                >
                    {this.renderImage()}
                    <div className="rt-node-editor__overlay">
                        <Button
                            className="rt-node-editor__overlay-btn"
                            udStyle="primary"
                            size="xsmall"
                            data-purpose="edit-image-btn"
                            {...buttonHandler}
                        >
                            {gettext('Edit')}
                        </Button>
                    </div>
                    <div
                        aria-hidden="true"
                        className={classNames({
                            'js-resizer-handle': true,
                            'rt-image-editor__resizer-handle': true,
                            'rt-image-editor__resizer-handle--mobile': isMobileBrowser,
                        })}
                    />
                </Resizer>
            </RootCloseWrapper>
        );
    }

    render() {
        // Avoid rendering unnecessary spans/divs around the image, as they can mess up
        // the browser's arrow key navigation around the image.
        return this.imageEditorModel.isOverlayShown ? this.renderEditMode() : this.renderImage();
    }
}

export default withI18n(ImageEditor);
