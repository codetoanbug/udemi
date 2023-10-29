import {Avatar} from '@udemy/react-core-components';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './instructor-profile.less';
import Instructor from '../../instructor.mobx-model';

export default class InstructorProfile extends Component {
    static propTypes = {
        instructor: PropTypes.instanceOf(Instructor).isRequired,
    };

    render() {
        const {instructor} = this.props;
        return (
            <>
                <div styleName="header-row">
                    <Avatar
                        user={{...instructor, display_name: instructor.title}}
                        srcKey="image"
                        alt="NONE"
                    />
                    <div styleName="title-wrapper">
                        <a
                            className="ud-heading-lg"
                            styleName="title"
                            href={instructor.url}
                            data-purpose="instructor-url"
                        >
                            {instructor.title}
                        </a>
                        <p>{instructor.jobTitle}</p>
                    </div>
                </div>
                <div styleName="social-links-row">
                    {instructor.socialProfiles.map(({url, name, Icon}) => (
                        <a
                            href={url}
                            key={name}
                            styleName="social-profile-btn"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                        >
                            <Icon label={name} color="inherit" />
                        </a>
                    ))}
                </div>
                <div styleName="description">
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'course-taking:instructor-description',
                            html: instructor.description,
                        })}
                    />
                </div>
            </>
        );
    }
}
