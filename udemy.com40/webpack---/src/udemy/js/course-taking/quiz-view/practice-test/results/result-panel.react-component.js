import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import {IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observe} from 'mobx';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import ensureInView from 'utils/ensure-in-view';

import CollapsedResultContent from './collapsed-result-content.react-component';
import ExpandedResultContent from './expanded-result-content.react-component';
import TestResultModel from './test-result.mobx-model';
import './result-panel.less';

@inject('practiceTestStore')
@observer
export default class ResultPanel extends Component {
    static propTypes = {
        practiceTestStore: PropTypes.object.isRequired,
        result: PropTypes.instanceOf(TestResultModel).isRequired,
        getScrollContainer: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.ensureInViewIfExpanded();
        this.disposers = [observe(this.props.result, 'isExpanded', this.ensureInViewIfExpanded)];

        // We want the underlying DOM node, not the <Panel /> instance.
        // eslint-disable-next-line react/no-find-dom-node
        this.ref = ReactDOM.findDOMNode(this);
    }

    componentWillUnmount() {
        (this.disposers || []).forEach((disposer) => disposer());
        this.ref = null;
    }

    @autobind
    ensureInViewIfExpanded() {
        // This setTimeout is needed for ensureInView to read scroll position accurately.
        setTimeout(() => {
            const {getScrollContainer, result} = this.props;
            const scrollContainer = getScrollContainer();
            if (result.isExpanded && scrollContainer && this.ref) {
                ensureInView(this.ref, scrollContainer, {
                    keepIfInView: result.id === this.props.practiceTestStore.firstTestResult.id,
                });
            }
        }, 0);
    }

    @autobind
    onToggleResult() {
        this.props.practiceTestStore.toggleIsExpandedForResult(this.props.result);
    }

    render() {
        const {result} = this.props;
        /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
        return (
            <div
                styleName={result.isExpanded ? 'panel expanded' : 'panel collapsed'}
                onClick={!result.isExpanded ? this.onToggleResult : null}
            >
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <IconButton
                    className="ud-link-neutral"
                    styleName="toggler"
                    udStyle="ghost"
                    onClick={result.isExpanded ? this.onToggleResult : null}
                    aria-expanded={result.isExpanded}
                    data-purpose="toggler"
                >
                    <ExpandIcon
                        label={result.isExpanded ? gettext('Collapse') : gettext('Expand')}
                        size="large"
                        styleName="toggler-icon"
                    />
                </IconButton>
                {result.isExpanded ? (
                    <ExpandedResultContent result={result} />
                ) : (
                    <CollapsedResultContent result={result} />
                )}
            </div>
        );
    }
}
