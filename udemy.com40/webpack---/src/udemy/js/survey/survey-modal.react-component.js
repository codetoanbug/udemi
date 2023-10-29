import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {noop} from 'utils/noop';
import range from 'utils/range';

import PaginatedSurveyStore from './paginated-survey.mobx-store';
import SurveyQuestion from './survey-question.react-component';
import './survey-modal.less';

@observer
export default class SurveyModal extends React.Component {
    static propTypes = {
        surveyStore: PropTypes.object.isRequired,
        onSubmit: PropTypes.func,
        reset: PropTypes.bool,
        isQuestionVisible: PropTypes.func,
        thankYouPageProps: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([false])]),
    };

    static defaultProps = {
        onSubmit: noop,
        reset: false,
        isQuestionVisible: () => true,
        thankYouPageProps: false,
    };

    constructor(props) {
        super(props);
        this.store = new PaginatedSurveyStore(this.props.surveyStore, this.props.onSubmit);
    }

    @autobind
    onClickPrevPage() {
        this.store.onPageChange(this.store.pageNumber - 1);
    }

    @autobind
    onClickNextPage() {
        this.store.onPageChange(this.store.pageNumber + 1);
    }

    render() {
        const {
            surveyStore,
            onSubmit,
            reset,
            isQuestionVisible,
            thankYouPageProps,
            ...props
        } = this.props;

        // eslint-disable-next-line gettext/no-variable-string
        let title = gettext(surveyStore.headline);
        let body, footer;
        if (thankYouPageProps && this.store.surveyComplete) {
            title = thankYouPageProps.title || title;
            body = <p data-purpose="thank-you-text">{thankYouPageProps.text}</p>;
            footer = (
                <FooterButtons>
                    <Button onClick={props.onClose}>{gettext('Close')}</Button>
                </FooterButtons>
            );
        } else {
            const {questionSetNumber, pageCount, pageNumber} = this.store;
            if (questionSetNumber < surveyStore.questionSets.length) {
                body = surveyStore.questionSets[questionSetNumber].questions
                    .filter(isQuestionVisible)
                    .map((question) => (
                        <SurveyQuestion
                            key={question.id}
                            question={question}
                            surveyStore={surveyStore}
                        />
                    ));
            }

            footer = (
                <FooterButtons styleName="footer">
                    {pageNumber > 1 && (
                        <Button udStyle="secondary" onClick={this.onClickPrevPage}>
                            {gettext('Previous')}
                        </Button>
                    )}
                    <div styleName="footer-spacer">
                        {pageCount > 1 && (
                            <div
                                styleName="dots"
                                aria-label={interpolate(
                                    gettext('Step %(value)s of %(max)s'),
                                    {value: pageNumber, max: pageCount},
                                    true,
                                )}
                            >
                                {range(pageCount).map((i) => (
                                    <div
                                        key={i + 1}
                                        styleName={i + 1 === pageNumber ? 'dot dot-active' : 'dot'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <Button
                        disabled={!this.store.isCurrentPageAnswered}
                        onClick={this.onClickNextPage}
                    >
                        {this.store.canGoToNextPage ? gettext('Next') : gettext('Submit')}
                    </Button>
                </FooterButtons>
            );
        }

        return (
            <Modal
                title={title}
                loading={!surveyStore.isLoaded}
                onOpen={reset ? this.store.reset : noop}
                {...props}
                className={props.className}
                styleName="survey-modal"
            >
                {body}
                {footer}
            </Modal>
        );
    }
}
