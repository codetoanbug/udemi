import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CurriculumEditorStore from './curriculum-editor.mobx-store';

const propTypes = {
    store: PropTypes.instanceOf(CurriculumEditorStore).isRequired,
};

const InfoTip = ({store, ...props}) => {
    if (store.numOfNonSectionItems > 1) {
        return null;
    }

    if (store.showAlertPracticeTest) {
        return null;
    }

    const message = store.course.isPracticeTestCourse
        ? interpolate(
              gettext(
                  'Start putting together your course by creating practice tests below. ' +
                      'You must have a minimum of %(numPracticeTests)s practice tests to publish this course.',
              ),
              {numPracticeTests: store.course.practice_test_only_min_num_of_practice_tests},
              true,
          )
        : gettext(
              'Start putting together your course by creating sections, lectures and practice ' +
                  '(quizzes, coding exercises and assignments).',
          );

    return <p {...props}>{message}</p>;
};

InfoTip.propTypes = propTypes;

export default inject('store')(observer(InfoTip));
