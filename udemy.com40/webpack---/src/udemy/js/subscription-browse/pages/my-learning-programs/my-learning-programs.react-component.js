import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import {ProgramEnrollmentStore, DATA_STATES, QUERIES_BY_USE_CASE} from '@udemy/subscription-browse';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import emptyStatePNG from 'assets/images/program/empty-state.png';
import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import EmptyState from 'my-courses-v3/empty-state.react-component';
import ProgramCard from 'subscription-browse/components/program-card/program-card.react-component';
import {UDEMY_PRO_PLACEHOLDER_URL} from 'subscription-browse/constants';

import './my-learning-programs.less';

@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
export default class MyLearningPrograms extends Component {
    static propTypes = {
        isMobileMax: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(null)]),
        store: PropTypes.instanceOf(ProgramEnrollmentStore),
    };

    static defaultProps = {
        isMobileMax: null,
        store: undefined,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new ProgramEnrollmentStore();
    }

    componentDidMount() {
        this.store.fetchProgramEnrollments(QUERIES_BY_USE_CASE.PROGRAM_ENROLLMENTS);
    }

    renderEmptyState() {
        return (
            <EmptyState
                layout="vertical"
                imageProps={{src: emptyStatePNG, height: 114, width: 291}}
                title={gettext("You've not enrolled in any programs yet.")}
                subtitle={
                    <p className="ud-text-with-links">
                        <a
                            data-purpose="library-link"
                            className="ud-text-bold"
                            href={UDEMY_PRO_PLACEHOLDER_URL}
                        >
                            {gettext('View all IT Certification Programs')}
                        </a>
                    </p>
                }
            />
        );
    }

    renderErrorState() {
        return (
            <AlertBanner
                title={gettext('There was a problem loading your programs')}
                body={gettext('Please reload the page to resolve this issue')}
                ctaText={pgettext('e.g. Refresh a webpage', 'Reload Page')}
                onAction={() => window.location.reload(true)}
                udStyle="warning"
            />
        );
    }

    renderSuccessState() {
        return (
            <>
                <h3 className="my-courses__section-heading ud-heading-xl">
                    {gettext('Recently accessed')}
                </h3>
                <div className="my-courses__wide-card-grid">
                    {this.store.programCardData.map((program) => (
                        <div key={program.id}>
                            <ProgramCard
                                program={program}
                                path={program.path}
                                size={this.props.isMobileMax ? 'small' : 'large'}
                            />
                        </div>
                    ))}
                </div>
                <p className="ud-text-with-links" styleName="link-udemy-pro">
                    <a
                        data-purpose="library-link"
                        className="ud-text-bold"
                        href={UDEMY_PRO_PLACEHOLDER_URL}
                    >
                        {gettext('View all IT Certification Programs')}
                    </a>
                </p>
            </>
        );
    }

    render() {
        if (this.store.state === DATA_STATES.ERROR) {
            return this.renderErrorState();
        } else if (this.store.state === DATA_STATES.EMPTY) {
            return this.renderEmptyState();
        } else if (this.store.state === DATA_STATES.SUCCESS) {
            return this.renderSuccessState();
        }
        return <MainContentLoader />;
    }
}
