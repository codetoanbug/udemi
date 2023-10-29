import {LocalizedHtml} from '@udemy/i18n';
import {Duration} from '@udemy/react-date-time-components';
import {Meter} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {pathBarStyle} from './path-config';

import './program-card.less';

export function ProgramCardWrapper({href, ...props}) {
    if (href) {
        const cx = classNames(props.className, 'ud-custom-focus-visible');
        return <a {...props} className={cx} href={href} />;
    }
    return <div {...props} />;
}

ProgramCardWrapper.propTypes = {
    href: PropTypes.string,
    className: PropTypes.string,
};

ProgramCardWrapper.defaultProps = {
    href: undefined,
    className: '',
};

const programObjectCommonTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
};

export default class ProgramCard extends Component {
    static propTypes = {
        program: PropTypes.oneOfType([
            PropTypes.shape({
                // Continue Learning Card
                ...programObjectCommonTypes,
                completionRatio: PropTypes.number.isRequired,
                isEnrolled: PropTypes.bool.isRequired,
            }),
            PropTypes.shape({
                // Base card
                ...programObjectCommonTypes,
                duration: PropTypes.number,
                testCount: PropTypes.number,
                questionAnswerCount: PropTypes.number,
            }),
        ]).isRequired,
        path: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large']),
        className: PropTypes.string,
    };

    static defaultProps = {
        path: 'default',
        size: 'small',
        className: '',
    };

    renderCompletionRatio() {
        const {program} = this.props;

        if (program.completionRatio > 0) {
            return (
                <Meter
                    value={program.completionRatio}
                    min={0}
                    max={100}
                    label={gettext('%(percent)s% complete')}
                    styleName="progress"
                />
            );
        }

        return (
            <span className="ud-heading-sm" styleName="start-learning">
                {gettext('Start learning')}
            </span>
        );
    }

    render() {
        const {program, path, size, className} = this.props;

        const wrapperStyleName = classNames('program-card', {
            large: size === 'large',
            'with-progress': program.completionRatio > 0,
        });

        return (
            <ProgramCardWrapper
                href={program.url}
                styleName={wrapperStyleName}
                className={className}
            >
                <div style={pathBarStyle(path)} />
                <div styleName="content">
                    <h4
                        className={classNames(
                            'ud-focus-visible-target',
                            size === 'large' ? 'ud-heading-md' : 'ud-heading-sm',
                        )}
                        styleName="title"
                    >
                        {program.title}
                    </h4>
                    <span style={{flex: 1}} />
                    <div
                        className={size === 'large' ? 'ud-text-sm' : 'ud-text-xs'}
                        styleName="extra-info"
                    >
                        {program.duration > 0 && (
                            <span className="ud-text-sm" data-purpose="duration">
                                <LocalizedHtml
                                    style={{display: 'block'}}
                                    html={gettext(
                                        '<span class="duration">%(duration)s</span> of content',
                                    )}
                                    interpolate={{
                                        duration: (
                                            <Duration
                                                numSeconds={program.duration}
                                                precision={Duration.PRECISION.HOURS}
                                            />
                                        ),
                                    }}
                                />
                            </span>
                        )}
                        {program.testCount > 0 && (
                            <span className="ud-text-sm" data-purpose="test-count">
                                {ninterpolate(
                                    '%(numPractices)s practice test',
                                    '%(numPractices)s practice tests',
                                    program.testCount,
                                    {numPractices: program.testCount},
                                )}
                            </span>
                        )}
                        {program.questionAnswerCount > 0 && (
                            <span className="ud-text-sm" data-purpose="q-a-count">
                                {interpolate(
                                    gettext('%(qAOffer)s Q&A discussions'),
                                    {qAOffer: program.questionAnswerCount},
                                    true,
                                )}
                            </span>
                        )}
                        {program.completionRatio || program.completionRatio === 0
                            ? this.renderCompletionRatio()
                            : null}
                    </div>
                </div>
            </ProgramCardWrapper>
        );
    }
}
