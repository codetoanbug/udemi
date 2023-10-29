import {LocalizedHtml} from '@udemy/i18n';
import {AlertBanner} from '@udemy/react-messaging-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';
import MainContent from 'course-manage-v2/main-content.react-component';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';

import AccessibilityItem from './accessibility-item.react-component';
import AccessibilityStore from './accessibility.mobx-store';
import {CHECKLISTS_DATA} from './constants';
import './accessibility.less';

@observer
export default class Accessibility extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.accessibilityStore = new AccessibilityStore(props.courseId);
    }

    componentDidMount() {
        this.accessibilityStore.loadAccessibilitySettings();
    }

    renderAlert() {
        return (
            <AlertBanner
                showCta={false}
                udStyle="information"
                title={gettext('Create accessible learning content')}
                body={
                    <>
                        <p>
                            {gettext(
                                'Accessibility provides a person with a disability access to — and benefits of — the same information, ' +
                                    'interactions, and services as a person without a disability in a way that’s sensible, meaningful, and usable. ' +
                                    'In short, it’s the inclusive practice of ensuring there are no barriers to learning for as many people as possible.',
                            )}
                        </p>
                        <p>
                            {gettext(
                                'Some may think that accessibility is primarily aimed at helping people with physical disabilities, ' +
                                    'such as those with hearing or vision loss. However, making content accessible to everyone isn’t just the equitable ' +
                                    'thing to do, it also helps to broaden your reach so that more learners can benefit from your courses.',
                            )}
                        </p>
                        <p>
                            <LocalizedHtml
                                html={gettext(
                                    'Learn more about <a className="teachLink">creating accessible content</a> in Udemy’s Teaching Center.',
                                )}
                                interpolate={{
                                    teachLink: (
                                        <a
                                            className="ud-link-underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://teach.udemy.com/course-creation/accessible-content/"
                                        />
                                    ),
                                }}
                            />
                        </p>
                    </>
                }
            />
        );
    }

    renderChecklists() {
        return (
            <>
                <h2 className="ud-heading-xl" styleName="subheading">
                    {gettext('Accessibility checklists')}
                </h2>
                <p>
                    {gettext(
                        'To help you create accessible course content, we’ve provided Instructors with recommendations ' +
                            'and best practices to consider while creating new courses or updating existing content. ' +
                            'Please review these accessibility recommendations and checklists to indicate whether your course meets the guidelines.',
                    )}
                </p>
                <p>
                    {gettext(
                        'Note: while these accessibility guidelines are strongly recommended, they are not a requirement prior ' +
                            'to publishing your course. Though content that does meet these accessibility guidelines may benefit from ' +
                            'a greater number of learners who could take your course.',
                    )}
                </p>

                {CHECKLISTS_DATA.map((item, idx) => (
                    <AccessibilityItem
                        key={idx}
                        itemData={item}
                        accessibilityStore={this.accessibilityStore}
                    />
                ))}
            </>
        );
    }

    renderResources() {
        return (
            <>
                <h2 className="ud-heading-xl" styleName="subheading">
                    {gettext('Accessibility resources')}
                </h2>
                <p>
                    <a
                        href="https://teach.udemy.com/course-creation/accessible-content/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Creating accessible learning content')}
                    </a>
                </p>
                <p>
                    <a
                        href="https://teach.udemy.com/accessible-video-content-considerations/#Audio-content"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Audio content for accessible learning')}
                    </a>
                </p>
                <p>
                    <a
                        href="https://teach.udemy.com/accessible-video-content-considerations/#Visual-content"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Visual content for accessible learning')}
                    </a>
                </p>
                <p>
                    <a
                        href="https://teach.udemy.com/inclusive-content-considerations/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Planning your course accessibility considerations')}
                    </a>
                </p>
                <p>
                    <a
                        href="https://teach.udemy.com/resources-on-accessibility-inclusivity/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Creating accessible resource documents')}
                    </a>
                </p>
                <p>
                    <a
                        href="https://support.udemy.com/hc/articles/9834096080663"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Marking your course as accessible')}
                    </a>
                </p>
            </>
        );
    }

    renderAccessibility() {
        return (
            <>
                {this.renderAlert()}
                {this.renderChecklists()}
                {this.renderResources()}
            </>
        );
    }

    render() {
        return (
            <div>
                <SubHeader title={gettext('Accessibility')} />
                <MainContent>
                    {!this.accessibilityStore.isLoaded ? <Loader /> : this.renderAccessibility()}
                </MainContent>
            </div>
        );
    }
}
