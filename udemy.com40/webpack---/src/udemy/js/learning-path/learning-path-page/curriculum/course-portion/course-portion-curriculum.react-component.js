import {Accordion} from '@udemy/react-reveal-components';
import {inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import CoursePortionModalStore from './course-portion-modal.mobx-store';
import CoursePortionSection from './course-portion-section.react-component';

import './course-portion-curriculum.less';

@inject('coursePortionModalStore')
export default class CoursePortionCurriculum extends React.Component {
    static propTypes = {
        coursePortionModalStore: PropTypes.instanceOf(CoursePortionModalStore).isRequired,
    };

    render() {
        const {portion} = this.props.coursePortionModalStore;

        return (
            <Accordion styleName="container" data-purpose="curriculum-sections">
                {portion.curriculumSections.map((section) => {
                    return (
                        <CoursePortionSection
                            curriculumSection={section}
                            key={`portion-section-${section.id}`}
                        />
                    );
                })}
            </Accordion>
        );
    }
}
