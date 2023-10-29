import {Button} from '@udemy/react-core-components';
import {FormGroup, TextArea} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ReviewStarsInput from './review-stars-input/review-stars-input.react-component';
import './review-editor.less';

@observer
export default class WriteComment extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const {store} = this.props;
        return (
            <div data-purpose="write-comment">
                <ReviewStarsInput
                    rating={store.rating}
                    data-purpose="review-stars"
                    onChoose={store.rate}
                />
                <FormGroup
                    label={gettext('Description')}
                    labelProps={{className: 'ud-sr-only'}}
                    styleName="review-content"
                >
                    <TextArea
                        data-purpose="review-content"
                        rows="5"
                        value={store.reviewContent}
                        onChange={store.updateComment}
                        placeholder={gettext(
                            'Tell us about your own personal experience taking this course. Was it a good match for you?',
                        )}
                    />
                </FormGroup>
                <FooterButtons>
                    <Button onClick={store.saveAndForward} data-purpose="save-button">
                        {gettext('Save and Continue')}
                    </Button>
                </FooterButtons>
            </div>
        );
    }
}
