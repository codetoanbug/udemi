import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import {noop} from 'utils/noop';

import requires from '../registry/requires';
import {PAGE_TO_STATE_MAP} from './constants';
import {DefaultRightButtons, DefaultLeftButtons} from './default-footer-buttons.react-component';
import Layout from './layout.react-component';

import './practice.less';

@withRouter
@requires('courseTakingStore', 'practiceViewStore')
@observer
export default class BasePage extends Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        practiceViewStore: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        onPracticeInitialized: PropTypes.func,
        title: PropTypes.string,
        subtitle: PropTypes.node,
        pageType: PropTypes.string,
        renderRightButtons: PropTypes.func,
        renderLeftButtons: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        children: null,
        className: null,
        onPracticeInitialized: noop,
        title: null,
        subtitle: null,
        pageType: null,
        renderRightButtons: null,
        renderLeftButtons: null,
    };

    constructor(props, context) {
        super(props, context);
        this.props.practiceViewStore.setCurrentPage(this.props.pageType);
    }

    componentDidMount() {
        const {practiceViewStore} = this.props;
        practiceViewStore.initializePracticeData().then(() => {
            this.props.onPracticeInitialized();
            this.sendProgressLog();
        });
    }

    sendProgressLog() {
        const {practice} = this.props.practiceViewStore;
        const pageName = Object.keys(PAGE_TO_STATE_MAP).find(
            (key) => PAGE_TO_STATE_MAP[key] === this.currentAction,
        );
        if (!pageName) {
            return;
        }
        practice.updateProgress({page: pageName});
    }

    @autobind
    renderRightButtons() {
        if (!this.props.practiceViewStore.isPracticeDataInitialized) {
            return null;
        }
        if (this.props.renderRightButtons) {
            return this.props.renderRightButtons();
        }
        return (
            <DefaultRightButtons
                nextUrl={this.props.practiceViewStore.nextUrl}
                prevUrl={this.props.practiceViewStore.prevUrl}
            />
        );
    }

    @autobind
    renderLeftButtons() {
        if (!this.props.practiceViewStore.isPracticeDataInitialized) {
            return null;
        }
        if (this.props.renderLeftButtons) {
            return this.props.renderLeftButtons();
        }
        return (
            <DefaultLeftButtons
                hasCompletedPractice={this.props.practiceViewStore.hasCompletedPractice}
                currentAction={this.currentAction}
                showShortenedText={this.props.courseTakingStore.isMediumScreenViewportSize}
            />
        );
    }

    @computed
    get currentAction() {
        const {baseUrl} = this.props.practiceViewStore;
        return this.props.location.pathname.replace(baseUrl, '').replace(/\//, '');
    }

    render() {
        const {children, className, title, subtitle} = this.props;
        const hasChildren = React.Children.toArray(children).filter(Boolean).length > 0;
        return (
            <Layout
                renderLeftButtons={this.renderLeftButtons}
                renderRightButtons={this.renderRightButtons}
            >
                <div className={className}>
                    {title && (
                        <div className="ud-heading-xl" data-purpose="title">
                            {title}
                        </div>
                    )}
                    {subtitle && (
                        <div styleName="subtitle" data-purpose="subtitle">
                            {subtitle}
                        </div>
                    )}
                    <div styleName={title || subtitle ? 'mt-xl' : ''}>
                        {hasChildren ? children : <Loader size="large" block={true} />}
                    </div>
                </div>
            </Layout>
        );
    }
}
