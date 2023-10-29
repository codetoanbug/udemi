import ArrowCircleUpOutlineIcon from '@udemy/icons/dist/arrow-circle-up-outline.ud-icon';
import ArrowCircleUpIcon from '@udemy/icons/dist/arrow-circle-up.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import './num-upvotes.less';

@observer
export default class NumUpvotes extends React.Component {
    static propTypes = {
        numUpvotes: PropTypes.number.isRequired,
        onToggleUpvoted: PropTypes.func.isRequired,
        isUpvoted: PropTypes.bool.isRequired,
    };

    @observable isUpvoteDisabled = false;

    @autobind
    @action
    onUpvoteClicked(event) {
        event.preventDefault();
        if (this.isUpvoteDisabled) {
            return;
        }
        this.isUpvoteDisabled = true;
        this.props.onToggleUpvoted().finally(action(() => (this.isUpvoteDisabled = false)));
    }

    render() {
        const {isUpvoted, numUpvotes} = this.props;
        const UpvoteIcon = isUpvoted ? ArrowCircleUpIcon : ArrowCircleUpOutlineIcon;
        const ariaLabel = isUpvoted ? gettext('Remove upvote') : gettext('Upvote');

        return (
            <div>
                <span className="ud-sr-only">
                    {ninterpolate('%(count)s upvote', '%(count)s upvotes', numUpvotes, {
                        count: numUpvotes,
                    })}
                </span>
                <Button
                    onClick={this.onUpvoteClicked}
                    udStyle="link"
                    disabled={this.isUpvoteDisabled}
                    styleName={classNames('button', {'button-upvoted': isUpvoted})}
                >
                    <span styleName="num-upvotes" aria-hidden="true">
                        {numUpvotes}
                    </span>
                    <UpvoteIcon label={ariaLabel} size="medium" />
                </Button>
            </div>
        );
    }
}
