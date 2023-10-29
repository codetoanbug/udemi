import {ExpressiveIcon, ExpressiveIconName} from '@udemy/icons-expressive';
import {Modal} from '@udemy/react-dialog-components';
import React from 'react';

import {SEARCH_PAGE} from 'labs/constants';

import {LABS_STEPS, SEARCH_LABS_STEPS} from './constants';

import './modal-labs-steps.less';

export const ModalLabsSteps = (props: {
    isOpen: boolean;
    onClose: () => void;
    fromPage?: string;
}) => {
    const STEPS = props.fromPage === SEARCH_PAGE ? SEARCH_LABS_STEPS : LABS_STEPS;
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} title={gettext('Learn how labs work')}>
            <p data-purpose="how-it-works">
                {gettext(
                    'Labs are real world projects to help you learn by doing. ' +
                        'Looking to develop a new skill or accelerate your learning to get ready for a new project? ' +
                        'A lab is ideal to experience authentic tasks and self-assess your readiness. Here’s how it works:',
                )}
            </p>
            <ol styleName="steps-wrapper">
                {STEPS.map((step) => {
                    return (
                        <li styleName="labs-steps" key={step.title} data-purpose="labs-steps">
                            <ExpressiveIcon
                                name={step.expressiveIconName as typeof ExpressiveIconName[number]}
                                size="large"
                            />
                            <div styleName="text-container">
                                <h2 className="ud-heading-md" styleName="title">
                                    {step.title}
                                </h2>
                                <span>{step.description}</span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </Modal>
    );
};
