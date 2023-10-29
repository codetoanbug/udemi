import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './quiz-page-layout.less';

@observer
export default class QuizPageLayout extends Component {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        renderBody: PropTypes.func.isRequired,
        renderFooter: PropTypes.func.isRequired,
        renderHeader: PropTypes.func,
        setScrollContainerRef: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        renderHeader: () => null,
        setScrollContainerRef: null,
        className: '',
    };

    render() {
        const {
            isLoading,
            renderBody,
            renderFooter,
            renderHeader,
            setScrollContainerRef,
            className,
        } = this.props;
        return (
            <div styleName="container">
                <div className={className} styleName="scroll-container" ref={setScrollContainerRef}>
                    {isLoading ? null : renderHeader()}
                    <div className="quiz-page-content" styleName="content">
                        {!isLoading ? (
                            renderBody()
                        ) : (
                            <Loader block={true} size="xxlarge" data-purpose="page-loader" />
                        )}
                    </div>
                </div>
                {isLoading ? null : renderFooter()}
            </div>
        );
    }
}
