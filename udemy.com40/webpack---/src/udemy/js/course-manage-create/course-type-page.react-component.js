import ListAltIcon from '@udemy/icons/dist/list-alt.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import './create-course-flow.less';

@observer
export default class CourseTypePage extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    @autobind
    onChange(e) {
        this.props.store.updateData('type', e.target.value);
    }

    options = [
        {
            type: 'course',
            icon: VideoIcon,
            title: gettext('Course'),
            text: gettext(
                'Create rich learning experiences with the help of video lectures, quizzes, coding exercises, etc.',
            ),
        },
        {
            type: 'practice',
            icon: ListAltIcon,
            title: gettext('Practice Test'),
            text: gettext(
                'Help students prepare for certification exams by providing practice questions.',
            ),
        },
    ];

    headerText = gettext("First, let's find out what type of course you're making.");

    render() {
        const {store} = this.props;
        return (
            <div>
                <h1
                    className="ud-heading-serif-xl"
                    styleName="header-text"
                    data-purpose="header-text"
                >
                    {this.headerText}
                </h1>
                <form styleName="response-form">
                    <FormGroup
                        udStyle="fieldset"
                        label={gettext('Type of course')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <div styleName="button-panels">
                            {this.options.map((option) => {
                                const id = `course-type-${option.type}`;
                                const Icon = option.icon;
                                return (
                                    <label key={option.type} styleName="button-panel" htmlFor={id}>
                                        <input
                                            type="radio"
                                            name="course-type"
                                            value={option.type}
                                            onChange={this.onChange}
                                            checked={store.pageData.type === option.type}
                                            id={id}
                                            className="ud-sr-only"
                                        />
                                        <span styleName="button-panel-content">
                                            <span>
                                                <Icon label={false} size="large" />
                                            </span>
                                            <span
                                                className="ud-heading-md"
                                                styleName="button-panel-title"
                                            >
                                                {option.title}
                                            </span>
                                            <span className="ud-text-sm">{option.text}</span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </FormGroup>
                </form>
            </div>
        );
    }
}
