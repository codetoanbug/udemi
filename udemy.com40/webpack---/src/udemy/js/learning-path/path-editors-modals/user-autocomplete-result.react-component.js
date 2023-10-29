import {Avatar} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './user-autocomplete-result.less';

@observer
export default class UserAutocompleteResult extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        isAlreadyAnEditor: PropTypes.bool,
    };

    static defaultProps = {
        isAlreadyAnEditor: false,
    };

    render() {
        const {user, isAlreadyAnEditor} = this.props;
        return (
            <div data-purpose="assigned-item" key={user.id} styleName="wrapper">
                <Avatar alt="NONE" user={user} size="small" />

                <div styleName="user-info">
                    <div data-purpose="display-name" className="ud-heading-sm">
                        {user.display_name}
                    </div>
                    <div data-purpose="email" className="ud-text-xs" styleName="user-email">
                        {user.email}
                    </div>
                </div>
                {isAlreadyAnEditor && (
                    <div className="ud-text-xs" styleName="already-an-editor-text">
                        {gettext('Already an editor')}
                    </div>
                )}
            </div>
        );
    }
}
