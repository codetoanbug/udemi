import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {TRIAL_MESSAGES, CONTENT_LOCKED_EVENT} from 'organization-trial/constants';

import requires from '../registry/requires';
import './locked-screen.less';

@requires('courseTakingStore')
@observer
export default class LockedScreen extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
    };

    componentDidMount() {
        const curriculumItem = this.props.courseTakingStore.currentCurriculumItem;
        const itemType = curriculumItem.type;
        const assetType = curriculumItem.asset && curriculumItem.asset.type;
        const quizType = curriculumItem.quizType;
        const detail = {itemType, assetType, quizType};
        // Dispatch event for trial consumption bar
        document.dispatchEvent(new CustomEvent(CONTENT_LOCKED_EVENT, {detail}));
    }

    render() {
        return (
            <div styleName="locked-screen">
                <div>
                    <h2 className="ud-heading-xl" styleName="title">
                        {this.props.courseTakingStore.currentCurriculumItem.title}
                    </h2>
                    <p className="ud-text-sm">{TRIAL_MESSAGES.CONTENT_LOCKED}</p>
                </div>
            </div>
        );
    }
}
