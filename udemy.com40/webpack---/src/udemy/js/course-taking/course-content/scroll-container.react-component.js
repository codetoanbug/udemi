import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import React, {Component} from 'react';

@observer
export default class ScrollContainer extends Component {
    @observable.ref scrollContainerRef = null;

    @autobind
    @action
    setScrollContainerContainerRef(ref) {
        this.scrollContainerRef = ref;
    }

    render() {
        const {children, ...props} = this.props;
        return (
            <div ref={this.setScrollContainerContainerRef} {...props}>
                {this.scrollContainerRef && (
                    <Provider scrollContainerRef={this.scrollContainerRef}>{children}</Provider>
                )}
            </div>
        );
    }
}
