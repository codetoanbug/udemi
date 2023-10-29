import {findFocusables, forceTabOrder, getUniqueId} from '@udemy/design-system-utils';
import CloseIcon from '@udemy/icons/dist/close.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import getIsMobileApp from 'utils/user-agent/get-is-mobile-app';

import MobileEndScreen from '../end-screen/mobile-end-screen.react-component';
import requires from '../registry/requires';
import MobileReviewPrompt from '../reviews/mobile-review-prompt.react-component';
import {MAIN_CONTENT} from './constants';
import styles from './mobile-curriculum-item.less';
import MobileOverlay from './mobile-overlay.react-component';
import NextAndPrevious from './next-and-previous.react-component';

/**
 * This is a custom modal because:
 * - It wants 0 padding on the modal container.
 * - It opens other modals (e.g. "Report abuse"). FocusTrappingDialog usage of lock-page-scroll.js
 *   doesn't support this. If you close an inner modal, page scroll is unlocked,
 *   but it shouldn't be because the outer modal is still open.
 *
 * We don't want to update the design-system to support "full page modals" like this one.
 * The design-system recommends a separate page (or route for SPA) instead of a modal.
 * But restructuring the course-taking routing will be difficult, so for now,
 * the least painful option is to make a custom modal.
 */
class LaunchModal extends React.Component {
    static propTypes = {
        title: PropTypes.node.isRequired,
        onClose: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([false])]).isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.dialogRef = React.createRef();
        this.labelledById = getUniqueId('launch-modal-title');
    }

    componentDidMount() {
        this.triggerNode = document.activeElement;
        document.body.classList.add(styles.launched);
        this.dialogRef.current.focus();
        this.disposeForceTabOrder = forceTabOrder([
            [() => this.findFocusable(-1), () => this.dialogRef.current],
            [() => this.findFocusable(-1), () => this.findFocusable(0)],
        ]);
    }

    componentWillUnmount() {
        this.disposeForceTabOrder && this.disposeForceTabOrder();
        document.body.classList.remove(styles.launched);
        this.triggerNode && this.triggerNode.focus();
        this.triggerNode = undefined;
    }

    @autobind findFocusable(givenIndex) {
        if (this.dialogRef.current) {
            const focusables = findFocusables(this.dialogRef.current);
            const index = givenIndex < 0 ? focusables.length + givenIndex : givenIndex;
            return focusables[index];
        }
    }

    render() {
        const {children, onClose, title} = this.props;
        const modal = (
            <div
                ref={this.dialogRef}
                role="dialog"
                aria-modal={true}
                tabIndex="-1"
                aria-labelledby={this.labelledById}
                styleName={classNames('dialog', {'dialog-closable': !!onClose})}
            >
                <h2 id={this.labelledById} className="ud-sr-only">
                    {title}
                </h2>
                {children}
                {!!onClose && (
                    <IconButton onClick={onClose} udStyle="ghost" styleName="dialog-close-button">
                        <CloseIcon color="neutral" label={gettext('Back to curriculum')} />
                    </IconButton>
                )}
            </div>
        );
        return ReactDOM.createPortal(modal, document.body);
    }
}

@requires('courseTakingStore')
@observer
export default class MobileCurriculumItem extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.shape({
            currentCurriculumItem: PropTypes.object,
            shouldResumeCurrentCurriculumItemForMobile: PropTypes.bool,
            mainContentType: PropTypes.string,
            setMobileAppViewReady: PropTypes.func,
        }).isRequired,
        useLauncher: PropTypes.bool.isRequired,
        displayImageOverlay: PropTypes.bool,
    };

    static defaultProps = {
        displayImageOverlay: false,
    };

    componentDidMount() {
        if (this.props.courseTakingStore.shouldResumeCurrentCurriculumItemForMobile)
            this.openModal();

        if (getIsMobileApp()) {
            this.props.courseTakingStore.setMobileAppViewReady();
        }
    }

    @observable hasLaunched = false;

    @autobind @action openModal() {
        this.hasLaunched = true;
    }

    @autobind @action closeModal() {
        this.hasLaunched = false;
    }

    get launchedContent() {
        const {currentCurriculumItem, mainContentType} = this.props.courseTakingStore;
        const cannotClose =
            [MAIN_CONTENT.REVIEW_PROMPT, MAIN_CONTENT.END_SCREEN].includes(mainContentType) ||
            getIsMobileApp();

        return (
            <LaunchModal
                title={currentCurriculumItem.displayTitle || ''}
                onClose={cannotClose ? false : this.closeModal}
            >
                {this.props.children}
            </LaunchModal>
        );
    }

    get overlayWithoutLauncher() {
        return (
            <>
                <MobileOverlay displayImageOverlay={this.props.displayImageOverlay} />
                <div styleName="container">{this.props.children}</div>
                <NextAndPrevious />
            </>
        );
    }

    get overlayWithPrompts() {
        const {currentCurriculumItem, mainContentType} = this.props.courseTakingStore;

        let actions;
        if (mainContentType === MAIN_CONTENT.REVIEW_PROMPT) {
            actions = <MobileReviewPrompt onConfirm={this.openModal} />;
        } else if (mainContentType === MAIN_CONTENT.END_SCREEN) {
            actions = <MobileEndScreen />;
        } else {
            actions = (
                <div styleName="default-actions">
                    <h2 className="ud-heading-md" styleName="title">
                        {currentCurriculumItem.displayTitle}
                    </h2>
                    <Button udStyle="brand" onClick={this.openModal} data-purpose="launch">
                        {gettext('Open')}
                    </Button>
                </div>
            );
        }

        return (
            <>
                <MobileOverlay displayImageOverlay={true} />
                <div styleName="container">{actions}</div>
                <NextAndPrevious />
                {this.hasLaunched && this.launchedContent}
            </>
        );
    }

    render() {
        // the mobile app has its own launcher, so we just want to display the content
        if (getIsMobileApp()) {
            return this.launchedContent;
        }

        // for unsupported items - coding exercises and assignments
        if (!this.props.useLauncher) {
            return this.overlayWithoutLauncher;
        }

        // for quiz, practice tests and articles
        return this.overlayWithPrompts;
    }
}
