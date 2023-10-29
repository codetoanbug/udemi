import TickIcon from '@udemy/icons/dist/tick.ud-icon';
import {PropTypes as mobxPropTypes} from 'mobx-react';
import React from 'react';

import './top-review-attributes.less';

const MIN_ATTRIBUTES_TO_SHOW = 2;

export default function TopReviewAttributes({topReviewAttributes}) {
    return topReviewAttributes.length >= MIN_ATTRIBUTES_TO_SHOW ? (
        <div>
            <div styleName="title" className="ud-heading-lg">
                {gettext('Students said that this course was:')}
            </div>
            <ul styleName="attributes-list">
                {topReviewAttributes.map((attribute) => (
                    <li key={attribute.id} styleName="attribute">
                        <TickIcon styleName="attribute-icon" label={false} />
                        <div styleName="attribute-text">{attribute.display_name}</div>
                    </li>
                ))}
            </ul>
        </div>
    ) : null;
}
TopReviewAttributes.propTypes = {
    topReviewAttributes: mobxPropTypes.arrayOrObservableArray.isRequired,
};
