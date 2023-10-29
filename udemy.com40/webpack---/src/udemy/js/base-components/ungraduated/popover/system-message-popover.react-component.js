// TODO: Promote to base-component.
import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import autopilot from 'utils/autopilot';
import {noop} from 'utils/noop';
import SystemMessage from 'utils/ud-system-message';

import styles from './system-message-popover.less';

/**
 * Internal component to take advantage of convenient i18n hook
 * @private
 */
const PopoverButton = ({handleClick}) => {
    const {gettext} = useI18n();

    return (
        <Button size="small" onClick={handleClick} className={styles['dismiss-btn']}>
            {gettext('Dismiss')}
        </Button>
    );
};

PopoverButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

@autopilot('isOpen', 'onToggle')
export default class SystemMessagePopover extends React.Component {
    static propTypes = {
        ...Popover.propTypes,
        systemMessageId: PropTypes.string.isRequired,
        relatedObject: PropTypes.shape({
            objectId: PropTypes.number.isRequired,
            objectType: PropTypes.string.isRequired,
        }),
    };

    static defaultProps = {
        ...Popover.defaultProps,
        isOpen: null,
        relatedObject: null,
    };

    async componentDidMount() {
        if (this.props.isOpen === null) {
            const response = await SystemMessage.hasSeen(this.props.systemMessageId, this.postBody);
            this.props.onToggle(!response.data);
        }
    }

    get postBody() {
        if (!this.props.relatedObject) return undefined;
        const {objectId, objectType} = this.props.relatedObject;
        return {obj_id: objectId, obj_type: objectType};
    }

    @autobind onClickDismissButton() {
        SystemMessage.seen(this.props.systemMessageId, this.postBody);
        this.props.onToggle(false);
    }

    render() {
        const {children, systemMessageId, relatedObject, ...props} = this.props;
        if (!props.isOpen) {
            return props.trigger;
        }

        return (
            <Popover shouldCloseOtherPoppers={false} {...props} onToggle={noop}>
                {children}
                <PopoverButton handleClick={this.onClickDismissButton} />
            </Popover>
        );
    }
}
