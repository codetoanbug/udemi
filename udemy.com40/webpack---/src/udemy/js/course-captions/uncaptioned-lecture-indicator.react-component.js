import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CaptionTooltip from './caption-tooltip.react-component';

import './captions-form.less';

@inject('store')
@observer
export default class UncaptionedLectureIndicator extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const {uncaptionedPublishedLectureProgress} = this.props.store;
        const text = gettext(
            'The ‘CC’ icon will only be shown on your course when all published video lectures in your course have captions.',
        );
        const uncaptionedPublishedLectureProgressText = interpolate(
            gettext('%(uncaptionedPublishedLectureProgress)s published lectures captioned'),
            {
                uncaptionedPublishedLectureProgress,
            },
            true,
        );

        return (
            <div styleName="hidden-lg-max">
                <span>{uncaptionedPublishedLectureProgressText}</span>
                <CaptionTooltip>{text}</CaptionTooltip>
            </div>
        );
    }
}
