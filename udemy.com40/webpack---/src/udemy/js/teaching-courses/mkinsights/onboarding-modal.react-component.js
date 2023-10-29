import {Image, Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './onboarding-modal.less';

export const stepCopy = [
    {
        title: gettext('Explore marketplace data'),
        body: gettext(
            'Better understand your potential students and create courses they will love. ' +
                'See data on student searches, existing courses, and potential revenue on your topic.',
        ),
        img: {
            src: '/staticx/udemy/images/mkinsights/onboarding-modal-1.png',
            width: 1941,
            height: 459,
        },
    },
    {
        title: gettext('Refine your course curriculum'),
        body: gettext(
            'Gain insight on what your students really want to learn by looking at "top search keywords". ' +
                'See which words or phrases students are searching to find courses on your topic.',
        ),
        img: {
            src: '/staticx/udemy/images/mkinsights/onboarding-modal-2.png',
            width: 1254,
            height: 618,
        },
    },
    {
        title: gettext('Don’t have a topic in mind?'),
        body: gettext(
            'Check back each day to discover new topics that are growing in demand on Udemy. ' +
                'See recommendations for each topic to help you capitalize on the opportunity!',
        ),
        img: {
            src: '/staticx/udemy/images/mkinsights/onboarding-modal-3.png',
            width: 897,
            height: 579,
        },
    },
];

@observer
export default class OnboardingModal extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @observable step = 0;

    @autobind
    @action
    goToNextStep() {
        this.step++;
    }

    render() {
        const {store} = this.props;
        const isLastStep = this.step === stepCopy.length - 1;
        return (
            <Modal
                isOpen={store.showOnboardingModal}
                onClose={store.hideOnboardingModal}
                requireExplicitAction={true}
                title={stepCopy[this.step].title}
            >
                {stepCopy[this.step].body}
                <Image
                    src={stepCopy[this.step].img.src}
                    styleName="screenshot"
                    alt={gettext('Example product screenshot')}
                    width={stepCopy[this.step].img.width}
                    height={stepCopy[this.step].img.height}
                />
                <FooterButtons styleName="footer">
                    <div>
                        {interpolate(
                            gettext('%(currentStep)s of %(totalStep)s'),
                            {currentStep: this.step + 1, totalStep: stepCopy.length},
                            true,
                        )}
                    </div>
                    {isLastStep ? (
                        <Button onClick={store.hideOnboardingModal}>
                            {gettext('Get started')}
                        </Button>
                    ) : (
                        <Button onClick={this.goToNextStep}>{gettext('Next')}</Button>
                    )}
                </FooterButtons>
            </Modal>
        );
    }
}
