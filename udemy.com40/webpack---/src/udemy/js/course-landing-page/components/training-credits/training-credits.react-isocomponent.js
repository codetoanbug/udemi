import {LocalizedHtml} from '@udemy/i18n';
import {Image} from '@udemy/react-core-components';
import {ShowMore} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';
import udLink from 'utils/ud-link';

import cpeSponsorLogo from './cpe_sponsor_logo.svg';
import './styles.less';

@isomorphic
@observer
export default class TrainingCredits extends Component {
    static propTypes = {
        numCpeCredits: PropTypes.number,
        cpeFieldOfStudy: PropTypes.string,
        cpeProgramLevel: PropTypes.string,
    };

    static defaultProps = {
        numCpeCredits: undefined,
        cpeFieldOfStudy: undefined,
        cpeProgramLevel: undefined,
    };

    render() {
        const {numCpeCredits, cpeFieldOfStudy, cpeProgramLevel} = this.props;
        if (!numCpeCredits) {
            return null;
        }
        return (
            <div
                className="ud-text-sm component-margin"
                styleName="training-credits"
                data-purpose="training-credits"
            >
                <h2 className="ud-heading-xl">{gettext('NASBA CPE accredited course')}</h2>
                <ShowMore collapsedHeight={200} withGradient={true}>
                    <div>
                        <div styleName="subtitle">
                            <p styleName="label">
                                {gettext(
                                    'National Association of State Boards of Accountancy (NASBA)',
                                )}
                            </p>
                            <p styleName="label">
                                {interpolate(
                                    gettext('NASBA CPE credits: %(numCpeCredits)s'),
                                    {numCpeCredits: numCpeCredits.toFixed(1)},
                                    true,
                                )}
                            </p>
                        </div>
                        <div styleName="description-section">
                            {cpeFieldOfStudy && (
                                <p styleName="label" data-purpose="cpe-field-of-study">
                                    {interpolate(
                                        gettext(
                                            'Recommended NASBA field of study: %(cpeFieldOfStudy)s',
                                        ),
                                        {cpeFieldOfStudy},
                                        true,
                                    )}
                                </p>
                            )}
                            {cpeProgramLevel && (
                                <p styleName="label" data-purpose="cpe-program-level">
                                    {interpolate(
                                        gettext('Program level: %(cpeProgramLevel)s'),
                                        {cpeProgramLevel},
                                        true,
                                    )}
                                </p>
                            )}
                        </div>
                        <div styleName="description-section">
                            <p styleName="label">{gettext('To earn NASBA CPE credits:')}</p>
                            <ul>
                                <li>{gettext('Complete all videos')}</li>
                                <li>{gettext('Score 70% or higher on final exam')}</li>
                            </ul>
                        </div>
                        <div styleName="description-section">
                            <p>
                                <strong>{`${gettext('Glossary')}: `}</strong>
                                {gettext('Find PDF attached to the first lecture of this course.')}
                            </p>
                            <p>
                                {gettext(
                                    'Completion to obtain CPE should be accomplished a year after purchase date.',
                                )}
                            </p>
                        </div>
                        <p styleName="description-section">
                            <LocalizedHtml
                                html={gettext(
                                    'If you undertake this course for NASBA CPE credits, please complete the' +
                                        ' <a class="evaluationLink">Self Study Course Evaluation</a>.',
                                )}
                                interpolate={{
                                    evaluationLink: (
                                        <a
                                            href={udLink.toHardLink('cpe_course_evaluation')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                }}
                            />
                        </p>
                        <div styleName="description description-section">
                            <Image
                                styleName="sponsor-logo"
                                src={cpeSponsorLogo}
                                alt={gettext('CPE Sponsor')}
                                height={90}
                                width={60}
                            />
                            <p>
                                <LocalizedHtml
                                    html={gettext(
                                        'Udemy is registered with the National Association of State Boards of Accountancy (NASBA)' +
                                            ' as a sponsor of continuing professional education on the National Registry of CPE Sponsors.' +
                                            ' State boards of accountancy have the final authority on the acceptance of individual courses for CPE credit.' +
                                            ' Complaints regarding registered sponsors may be submitted to the National Registry of CPE Sponsors' +
                                            ' through its website: <a class="nasbaLink">www.nasbaregistry.org</a>. ' +
                                            'For additional information including refunds and complaints, please see <a class="termsPageLink" target="_blank">Udemy Terms of Use</a>. ' +
                                            'For more information regarding administrative policies, please contact our <a class="supportLink" target="_blank">support</a>.',
                                    )}
                                    interpolate={{
                                        nasbaLink: (
                                            <a
                                                href={udLink.toHardLink('nasba_registry')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        termsPageLink: (
                                            <a
                                                href={udLink.to('terms')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        supportLink: (
                                            <a
                                                href={udLink.toSupportHome()}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                    }}
                                />
                            </p>
                        </div>
                    </div>
                </ShowMore>
            </div>
        );
    }
}
