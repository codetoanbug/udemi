import {AlertBanner} from '@udemy/react-messaging-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumEditorStore from './curriculum-editor.mobx-store';

const propTypes = {
    store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
};

const AlertPracticeTest = ({store, ...props}) => {
    if (!store.showAlertPracticeTest) {
        return null;
    }

    let alertText = '';
    if (!store.course.isPaid) {
        alertText = gettext('Please set a price on your course to create a practice test.');
    } else if (store.numOfPracticeTests >= store.course.max_num_of_practice_tests) {
        const tooltipTextContext = [store.course.max_num_of_practice_tests];
        alertText = interpolate(
            gettext(
                'You are allowed to include a maximum of %s practice tests in a practice test-only course.',
            ),
            tooltipTextContext,
        );
    }

    if (!alertText) {
        return null;
    }

    return <AlertBanner {...props} udStyle="error" showCta={false} title={alertText} />;
};

AlertPracticeTest.propTypes = propTypes;

export default inject('store')(observer(AlertPracticeTest));
