import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {Checkbox} from '@udemy/react-form-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {Provider, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import LearningPathItemContent from '../../../learning-path-item-content.mobx-model';
import CoursePortionCurriculum from './course-portion-curriculum.react-component';
import CoursePortionModalStore from './course-portion-modal.mobx-store';

import './course-portion-modal.less';

@observer
export default class CoursePortionModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        portion: PropTypes.instanceOf(LearningPathItemContent).isRequired,
        isReadOnly: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        const {portion, isReadOnly} = this.props;
        this.coursePortionModalStore = new CoursePortionModalStore(portion, isReadOnly);
    }

    componentDidMount() {
        this.coursePortionModalStore.loadContentCurriculum();
    }

    @autobind
    handleCancelClick() {
        return this.props.onHide();
    }

    @autobind
    handleDoneClick() {
        return this.props.onSubmit();
    }

    renderCheckBox() {
        const {portion, isReadOnly, handleChange} = this.coursePortionModalStore;

        if (isReadOnly) {
            return null;
        }

        return (
            <div styleName="select-all-form">
                <Checkbox
                    data-purpose="edit-content-select-all"
                    checked={portion.isSelectAllChecked}
                    onChange={handleChange}
                >
                    {portion.isSelectAllChecked ? gettext('All selected') : gettext('Select all')}
                </Checkbox>
            </div>
        );
    }

    renderCloseButton() {
        return (
            <Button data-purpose="content-close" onClick={this.handleCancelClick}>
                {gettext('Close')}
            </Button>
        );
    }

    renderDefaultButtons() {
        return (
            <>
                <Button
                    udStyle="ghost"
                    data-purpose="content-edit-close"
                    onClick={this.handleCancelClick}
                >
                    {gettext('Cancel')}
                </Button>
                <Button
                    disabled={this.coursePortionModalStore.portion.numUserSelectedItems === 0}
                    onClick={this.handleDoneClick}
                    data-purpose="content-edit-submit"
                >
                    {gettext('Done')}
                </Button>
            </>
        );
    }

    render() {
        const {show, onHide} = this.props;
        const {isReadOnly, alertTitle, portion} = this.coursePortionModalStore;
        const {isCurriculumLoading, numItems, numUserSelectedItems} = portion;

        return (
            <Provider coursePortionModalStore={this.coursePortionModalStore}>
                <Modal isOpen={show} onClose={onHide} title={gettext('Course content')}>
                    {isCurriculumLoading ? (
                        <Loader size="medium" block={true} />
                    ) : (
                        <>
                            <AlertBanner udStyle="information" showCta={false} title={alertTitle} />
                            <div styleName="info-panel">
                                {this.renderCheckBox()}
                                <span styleName="num-selected-info">
                                    {ninterpolate(
                                        '%(numUserSelectedItems)s of %(numItems)s item selected',
                                        '%(numUserSelectedItems)s of %(numItems)s items selected',
                                        numItems,
                                        {
                                            numItems,
                                            numUserSelectedItems,
                                        },
                                    )}
                                </span>
                            </div>
                            <CoursePortionCurriculum />
                        </>
                    )}
                    <FooterButtons>
                        {isReadOnly ? this.renderCloseButton() : this.renderDefaultButtons()}
                    </FooterButtons>
                </Modal>
            </Provider>
        );
    }
}
