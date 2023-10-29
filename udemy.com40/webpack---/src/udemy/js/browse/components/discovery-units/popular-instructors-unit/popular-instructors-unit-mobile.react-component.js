import {FunnelLog} from '@udemy/funnel-tracking';
import {withI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {AlternateHeadline} from '@udemy/react-discovery-units';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {InstructorCard} from 'browse/components/instructor-card/instructor-card.react-component';

import styles from './popular-instructors-unit.less';

@observer
class PopularInstructorsUnitMobile extends Component {
    static propTypes = {
        titleId: PropTypes.string,
        className: PropTypes.string,
        onLoad: PropTypes.func,
        unit: PropTypes.object.isRequired,
        showTitle: PropTypes.bool,
        alternateHeadline: PropTypes.shape({
            title: PropTypes.string.isRequired,
            secondaryText: PropTypes.string,
        }),
        componentName: PropTypes.string.isRequired,
        gettext: PropTypes.func.isRequired,
    };

    static defaultProps = {
        titleId: 'popularInstructorsHeading',
        className: undefined,
        onLoad: noop,
        showTitle: true,
        alternateHeadline: undefined,
    };

    componentDidMount() {
        this.props.onLoad();
    }

    @observable isExpanded = false;

    @action
    toggleExpansion = () => {
        this.isExpanded = !this.isExpanded;
    };

    render() {
        const {
            className,
            unit,
            showTitle,
            alternateHeadline,
            componentName,
            titleId,
            gettext,
        } = this.props;
        const instructors = unit.items;
        const instructorsToShow = this.isExpanded ? instructors : instructors.slice(0, 3);

        return (
            <div className={className}>
                <section aria-labelledby={titleId}>
                    {showTitle && (
                        <h2
                            id={titleId}
                            className={classNames('ud-heading-lg', styles['unit-title'])}
                            data-purpose="title"
                        >
                            {unit.title}
                        </h2>
                    )}
                    {!showTitle && alternateHeadline && (
                        <AlternateHeadline titleTag="h2" titleId={titleId} {...alternateHeadline} />
                    )}
                    {instructorsToShow.map((instructor, idx) => (
                        <FunnelLog key={idx} item={{id: `instructor|${instructor.id}`}}>
                            <InstructorCard
                                instructor={instructor}
                                className={styles['instructor-card-container']}
                                componentName={componentName}
                            />
                        </FunnelLog>
                    ))}
                    <Button
                        size="medium"
                        udStyle="secondary"
                        onClick={this.toggleExpansion}
                        className={styles['button-sizing']}
                    >
                        {this.isExpanded ? gettext('See less') : gettext('See more')}
                    </Button>
                </section>
            </div>
        );
    }
}

export default withI18n(PopularInstructorsUnitMobile);
