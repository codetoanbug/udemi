import ErrorIcon from '@udemy/icons/dist/error.ud-icon';
import {Button} from '@udemy/react-core-components';
import {ConfirmModal, Modal} from '@udemy/react-dialog-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {handleUnexpectedAPIError} from 'course-manage-v2/handle-error';

import ApplyDraftForm from './apply-draft-form.react-component';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';
import './draft-alert.less';

@observer
export default class DraftAlert extends Component {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel).isRequired,
        getContainer: PropTypes.func.isRequired,
    };

    componentDidMount() {
        window.addEventListener('resize', this.onResize, {passive: true});
        window.addEventListener('scroll', this.onScroll, {passive: true});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
    }

    @observable isAffixed = false;
    @observable affixSize = {width: 0, height: 0};
    affixTop = 0;
    affixSpacerRef = React.createRef();
    affixRef = React.createRef();
    margin = 16; // Space between FullPageTakeoverHeader and DraftAlert.
    padding = 8; // Space between DefaultItemEditor and DraftAlert.

    @autobind
    onDiscardDraftConfirm() {
        this.props.curriculumItem
            .confirmDiscardDraftConfirmation()
            .then(this.props.curriculumItem.closeAddContent)
            .catch(handleUnexpectedAPIError);
    }

    get canAffix() {
        const {isAddContentOpen, isEditContentOpen} = this.props.curriculumItem;
        return isAddContentOpen || isEditContentOpen;
    }

    @action
    setAffixSize() {
        const affixNode = this.affixRef.current;
        const affixSpacerNode = this.affixSpacerRef.current;
        this.affixSize.width = affixSpacerNode ? affixSpacerNode.offsetWidth : 0;
        this.affixSize.height = affixNode ? affixNode.offsetHeight : 0;
    }

    @autobind
    onResize() {
        this.isAffixed && this.setAffixSize();
    }

    @autobind
    @action
    onScroll() {
        const affixNode = this.affixRef.current;
        const containerNode = this.props.getContainer();
        if (!affixNode || !containerNode || !this.canAffix) {
            return;
        }

        const headerNode = document.querySelector('.cm-full-page-takeover-header');
        this.affixTop = (headerNode ? headerNode.getBoundingClientRect().bottom : 0) + this.margin;

        let isAffixed = false;
        const containerRect = containerNode.getBoundingClientRect();
        if (containerRect.top + this.padding <= this.affixTop) {
            const affixRect = affixNode.getBoundingClientRect();
            if (containerRect.bottom - affixRect.height - this.padding > this.affixTop) {
                isAffixed = true;
            }
        }

        if (isAffixed !== this.isAffixed) {
            this.isAffixed = isAffixed;
            isAffixed && this.setAffixSize();
        }
    }

    render() {
        const {curriculumItem, getContainer, ...props} = this.props;

        let affixStyle, affixSpacerStyle;
        if (this.isAffixed) {
            affixStyle = {
                position: 'fixed',
                top: `${this.affixTop}px`,
                width: `${this.affixSize.width}px`,
            };
            affixSpacerStyle = {height: `${this.affixSize.height}px`};
        }

        return (
            <div data-purpose="draft-alert" {...props}>
                <div ref={this.affixSpacerRef} style={affixSpacerStyle} />
                <div ref={this.affixRef} style={affixStyle} styleName="draft-alert">
                    <ErrorIcon label={false} size="large" styleName="draft-alert-icon" />
                    <div styleName="draft-alert-content">
                        <h2 className="ud-heading-md" styleName="draft-alert-title">
                            {!curriculumItem.hasAssessmentContent
                                ? gettext('Practice tests must contain at least 1 question.')
                                : gettext('Changes to this test are not yet live.')}
                        </h2>
                        <div styleName="draft-alert-cta-container">
                            <Button
                                udStyle="ghost"
                                size="small"
                                className="ud-link-neutral"
                                data-purpose="cancel-draft-btn"
                                onClick={curriculumItem.openDiscardDraftConfirmation}
                            >
                                {gettext('Clear Changes')}
                            </Button>
                            <Button
                                disabled={!curriculumItem.hasAssessmentContent}
                                size="small"
                                data-purpose="apply-draft-btn"
                                onClick={curriculumItem.openApplyDraftModal}
                            >
                                {gettext('Publish Changes')}
                            </Button>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={curriculumItem.showApplyDraftModal}
                    onClose={curriculumItem.closeApplyDraftModal}
                    title={gettext('Please describe the changes in this update:')}
                >
                    <ApplyDraftForm curriculumItem={curriculumItem} />
                </Modal>
                <ConfirmModal
                    onCancel={curriculumItem.closeDiscardDraftConfirmation}
                    onConfirm={this.onDiscardDraftConfirm}
                    isOpen={curriculumItem.showDiscardDraftConfirmation}
                >
                    {gettext(
                        'This will lose all your changes to this practice test.  Do you want to continue?',
                    )}
                </ConfirmModal>
            </div>
        );
    }
}
