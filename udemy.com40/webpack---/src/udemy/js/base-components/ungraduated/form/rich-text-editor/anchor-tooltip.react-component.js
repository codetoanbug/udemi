import {withI18n} from '@udemy/i18n';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {IconButton, Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import RichTextEditorModel from './rich-text-editor.mobx-model';

// The actual trigger is the `a` tag inside the rich text rendered by ProseMirror, not React.
// As long as `id` points to the actual trigger DOM node, Popover still works.
const FakeTrigger = () => null;

@observer
class AnchorTooltipBase extends Component {
    static propTypes = {
        getTarget: PropTypes.func.isRequired,
        doCommand: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(RichTextEditorModel).isRequired,
        onHide: PropTypes.func.isRequired,
        // eslint-disable-next-line react/require-default-props
        gettext: PropTypes.func,
    };

    @autobind
    editAnchor() {
        this.props.doCommand('PROMPT_ANCHOR', {focusOnEditor: false});
    }

    @autobind
    undoAnchor() {
        this.props.doCommand('UNDO_ANCHOR');
    }

    render() {
        const target = this.props.getTarget();

        if (!this.props.model.isAnchorTooltipShown || !target) {
            return null;
        }

        const href = this.props.model.anchorForm.data.href;
        return (
            <Popover
                detachFromTarget={true}
                withPadding={false}
                placement="bottom"
                trigger={<FakeTrigger id={target.id} />}
                isOpen={true}
            >
                <div className="rt-anchor-tooltip udlite-in-udheavy">
                    <span className="rt-anchor-tooltip-text">
                        {href ? (
                            <a
                                className="ud-text-sm"
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {href}
                            </a>
                        ) : null}
                        {href ? ' | ' : null}
                        <Button
                            udStyle="link"
                            typography="ud-text-sm"
                            onClick={this.editAnchor}
                            data-purpose="anchor-tooltip-edit"
                        >
                            {this.props.gettext('Edit')}
                        </Button>
                        {' | '}
                        <Button
                            udStyle="link"
                            typography="ud-text-sm"
                            onClick={this.undoAnchor}
                            data-purpose="anchor-tooltip-unlink"
                        >
                            {this.props.gettext('Unlink')}
                        </Button>
                    </span>
                    <IconButton
                        className="ud-link-neutral"
                        udStyle="ghost"
                        onClick={this.props.onHide}
                    >
                        <CloseIcon label={this.props.gettext('Close')} />
                    </IconButton>
                </div>
            </Popover>
        );
    }
}

const AnchorTooltip = withI18n(AnchorTooltipBase);

export default AnchorTooltip;
