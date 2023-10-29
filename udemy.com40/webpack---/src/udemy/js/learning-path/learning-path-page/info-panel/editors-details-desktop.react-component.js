import {BasicPopover} from '@udemy/react-popup-components';
import {PropTypes as MobxTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import ListPathEditors from '../list-path-editors.react-component';

import './info-panel.less';

export default class EditorsDetailsDesktop extends React.Component {
    static propTypes = {
        owner: PropTypes.object.isRequired,
        editors: MobxTypes.arrayOrObservableArray.isRequired,
        isPopover: PropTypes.bool,
    };

    static defaultProps = {
        isPopover: true,
    };

    get editors() {
        return this.props.editors.filter((editor) => editor.id !== this.props.owner.id);
    }

    get extraEditorsLabel() {
        return (
            <span data-purpose="extra-editors-detail-desktop" styleName="extra-editors-label">
                {ninterpolate(
                    '+%(num)s more editor',
                    '+%(num)s more editors',
                    this.editors.length,
                    {
                        num: this.editors.length,
                    },
                )}
            </span>
        );
    }

    renderExtraEditors() {
        const {isPopover, owner} = this.props;
        if (isPopover) {
            return (
                <BasicPopover
                    trigger={this.extraEditorsLabel}
                    placement="bottom"
                    canToggleOnHover={true}
                    a11yRole="description"
                    withPadding={false}
                    styleName="extra-editors-popover"
                >
                    <ListPathEditors owner={owner} editors={this.editors} isPopover={isPopover} />
                </BasicPopover>
            );
        }
        return this.extraEditorsLabel;
    }

    render() {
        return (
            <>
                <span>{this.props.owner.display_name}</span>
                {this.editors.length > 0 && this.renderExtraEditors()}
            </>
        );
    }
}
