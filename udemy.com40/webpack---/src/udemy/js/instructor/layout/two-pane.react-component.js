import classNames from 'classnames';
import {observer, Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import TwoPaneStore from './two-pane.mobx-store';

import './two-pane.less';

/*
 TwoPane is a component for displaying content in 2 side by side panes. When the screen width
 reaches max-width: @screen-xxs-max, one pane will be displayed(left by default). In single pane
  mode you can then switch between left and right panes.

 Props: showLeftPane, children[0], children[1]

 showLeftPane: This boolean specifies whether left pane should be initially shown. If false, show
               right pane in single pane mode.

 children[0]: Content to display on the left pane.

 children[1]: Content to display on the right pane.

 twoPaneStore: Contains functions to control which pane is displayed in small screens. More info
               in two-pane.mobx-store.js

 Usage:
    1) TwoPane will fill the width/height of parent.
    2) Inject child components with twoPaneStore. In single pane mode use store properties to
       switch between left and right pane.
 */

@observer
export default class TwoPane extends Component {
    static propTypes = {
        showLeftPane: PropTypes.bool,
        twoPaneStore: PropTypes.object,
    };

    static defaultProps = {
        showLeftPane: true,
        twoPaneStore: null,
    };

    constructor(props) {
        super(props);
        this.twoPaneStore = props.twoPaneStore || new TwoPaneStore(props.showLeftPane);
    }

    render() {
        const {showLeftPane, twoPaneStore, ...props} = this.props;
        const contentClassName = classNames({
            container: true,
            'container-left-active': this.twoPaneStore.showLeftPane,
        });

        return (
            <Provider twoPaneStore={this.twoPaneStore}>
                <div styleName={contentClassName} {...props}>
                    <div styleName="left-pane">{this.props.children[0]}</div>
                    <div styleName="right-pane">{this.props.children[1]}</div>
                </div>
            </Provider>
        );
    }
}
