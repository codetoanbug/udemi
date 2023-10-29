import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {ITEM_TYPES} from '../curriculum/constants';
import CurriculumItemFooter from '../curriculum/controls/curriculum-item-footer.react-component';
import requires from '../registry/requires';
import ProgressBar from './progress-bar.react-component';

import './layout.less';

@requires('practiceViewStore')
@observer
export default class Layout extends Component {
    static propTypes = {
        practiceViewStore: PropTypes.object.isRequired,
        renderLeftButtons: PropTypes.func.isRequired,
        renderRightButtons: PropTypes.func.isRequired,
    };

    get practiceEndAlert() {
        const {practice} = this.props.practiceViewStore;
        return (
            <div styleName="end-alert">
                <div styleName="end-alert-content">
                    <div className="ud-heading-xl">
                        {gettext('Great job, you finished this assignment!')}
                    </div>
                    <div className="ud-text-lg" styleName="end-alert-subtitle">
                        {practice.title}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {children, practiceViewStore, renderLeftButtons, renderRightButtons} = this.props;
        const {
            practice,
            shouldShowProgressBar,
            shouldShowAlertEndPractice,
            setScrollContainer,
        } = practiceViewStore;

        return (
            <div styleName="container">
                <div styleName="scroll-container" ref={setScrollContainer}>
                    {shouldShowAlertEndPractice && this.practiceEndAlert}
                    {shouldShowProgressBar && (
                        <div styleName="progress-bar">
                            <ProgressBar />
                        </div>
                    )}
                    <div styleName="content">{children}</div>
                </div>
                <CurriculumItemFooter
                    reportId={practice.id}
                    reportType={ITEM_TYPES.PRACTICE}
                    renderLeftButtons={renderLeftButtons}
                    renderRightButtons={renderRightButtons}
                />
            </div>
        );
    }
}
