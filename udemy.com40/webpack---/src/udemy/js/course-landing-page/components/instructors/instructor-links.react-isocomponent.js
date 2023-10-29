import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import './instructor-links.less';

@isomorphic
export default class InstructorLinks extends React.Component {
    static propTypes = {
        instructors: PropTypes.array.isRequired,
        useAbsoluteURLs: PropTypes.bool,
    };

    static defaultProps = {
        useAbsoluteURLs: false,
    };

    @autobind
    handleOnInstructorNameClick(event) {
        // Because 1) Varnish strips query params and 2) we modify query params when we add a coupon,
        // we want to update this anchor link to avoid a full page refresh.
        const position = event.target.parentElement?.dataset?.position || 1;
        const id = `#instructor-${position}`;
        event.target.parentElement.href = `${window.location.search}${id}`;
    }

    renderNames() {
        const Names = () =>
            this.props.instructors
                .map((instructor, i) => (
                    <Button
                        componentClass="a"
                        udStyle="link"
                        key={instructor.title}
                        className="ud-text-sm ud-instructor-links"
                        onClick={this.handleOnInstructorNameClick}
                        data-position={i + 1}
                        href={`#instructor-${i + 1}`}
                    >
                        {instructor.title}
                    </Button>
                ))
                .reduce((prev, curr) => [prev, ', ', curr]);

        return (
            <LocalizedHtml
                styleName="names"
                html={interpolate(
                    gettext('<span class="created-by">Created by</span> <span class="names" />'),
                    true,
                )}
                interpolate={{
                    'created-by': <span className="ud-text-sm" />,
                    names: <Names />,
                }}
            />
        );
    }

    renderNamesWithAbsoluteLinks() {
        const InstructorAbsoluteLinks = () =>
            this.props.instructors
                .map((instructor) => (
                    <a
                        href={instructor.absolute_url}
                        key={instructor.title}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {instructor.title}
                    </a>
                ))
                .reduce((prev, curr) => [prev, ', ', curr]);

        return (
            <LocalizedHtml
                styleName="names"
                html={interpolate(
                    gettext('<span class="created-by">Created by </span><a class="names"></a>'),
                    true,
                )}
                interpolate={{
                    'created-by': <span className="ud-text-sm" />,
                    names: <InstructorAbsoluteLinks />,
                }}
            />
        );
    }

    render() {
        if (!this.props.instructors.length) {
            return null;
        }

        return (
            <div styleName="instructor-links" data-purpose="instructor-name-top">
                {this.props.useAbsoluteURLs
                    ? this.renderNamesWithAbsoluteLinks()
                    : this.renderNames()}
            </div>
        );
    }
}
