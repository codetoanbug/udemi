import Observer from '@researchgate/react-intersection-observer';
import {Button} from '@udemy/react-core-components';
import {SmartBarSpacer} from '@udemy/smart-bar';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import React, {Component} from 'react';

import styles from './floating-buttons.less';

@observer
export default class FloatingButtons extends Component {
    static propTypes = {
        document: PropTypes.object,
        persistentSearch: PropTypes.bool,
    };

    static defaultProps = {
        document: null,
        persistentSearch: false,
    };

    componentDidMount() {
        const clientSideDocument = this.props.document || document;
        const marks = clientSideDocument?.querySelectorAll('.in-page-offset-anchor');
        for (const mark of marks) {
            this.marks[mark.id] = mark;
        }
    }

    @observable visible;
    marks = {};

    @autobind
    handleClick(ev) {
        const {target} = ev.currentTarget.dataset;

        if (this.marks[target]) {
            this.marks[target].scrollIntoView({behavior: 'smooth'});
        }
    }

    @autobind
    @action
    handleIntersection(ev) {
        const {top} = ev.boundingClientRect;

        // If our top is negative that means we have scrolled past our mark
        this.visible = top < 0;
    }

    render() {
        const className = classNames(
            styles['floating-buttons'],
            this.visible ? styles.visible : styles.hidden,
            {
                [styles['with-persistent-search']]: this.visible && this.props.persistentSearch,
            },
        );

        const sharedButtonProps = {
            size: 'medium',
            udStyle: 'ghost',
            onClick: this.handleClick,
        };

        // Targets are .in-page-offset-anchor placed in the DOM. (Could be by Django or React)
        return (
            <>
                <Observer onChange={this.handleIntersection}>
                    <span className={styles.mark} />
                </Observer>
                <div className={styles['floating-buttons-container']}>
                    <SmartBarSpacer />
                    <div className={className}>
                        <Button data-target="what-you-will-learn" {...sharedButtonProps}>
                            {gettext('Overview')}
                        </Button>
                        <Button data-target="objective" {...sharedButtonProps}>
                            {gettext('Curriculum')}
                        </Button>
                        <Button data-target="instructor" {...sharedButtonProps}>
                            {gettext('Instructor')}
                        </Button>
                        <Button data-target="reviews" {...sharedButtonProps}>
                            {gettext('Reviews')}
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}
