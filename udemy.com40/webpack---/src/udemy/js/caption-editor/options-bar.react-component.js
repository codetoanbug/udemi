import {Button} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './options-bar.less';

@inject('store')
@observer
export default class OptionsBar extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div styleName="options-bar">
                <Button
                    udStyle="ghost"
                    size="small"
                    typography="ud-text-sm"
                    onClick={this.props.store.toggleOverlayVisibility}
                >
                    {gettext('View Keyboard Shortcuts')}
                </Button>
                <Checkbox
                    checked={this.props.store.pauseWhenTyping}
                    onChange={this.props.store.togglePauseWhenTypingSetting}
                >
                    {gettext('Pause when typing')}
                </Checkbox>
            </div>
        );
    }
}
