import {Button} from '@udemy/react-core-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udMe from 'utils/ud-me';

import ConfirmationPage from './confirmation-page.react-component';
import './review-editor.less';

@observer
export default class ReviewPreview extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        onCancelReview: PropTypes.func.isRequired,
    };

    @autobind
    onClickExit() {
        this.props.onCancelReview();
    }

    render() {
        const {store} = this.props;
        return (
            <div>
                <ConfirmationPage
                    course={store.course}
                    reviewText={store.reviewContent}
                    rating={store.rating}
                    user={udMe}
                />
                <FooterButtons>
                    <Button data-purpose="save-button" onClick={this.onClickExit}>
                        {gettext('Save and Exit')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
