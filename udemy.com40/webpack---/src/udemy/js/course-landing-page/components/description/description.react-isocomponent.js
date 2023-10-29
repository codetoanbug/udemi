import {Accordion, ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';
import {isomorphic} from 'utils/isomorphic-rendering';

import styles from './styles.less';

export const TargetAudiences = ({items}) => {
    if (items.length === 0) {
        return null;
    }
    const audienceItems = items.map((audience, index) => <li key={index}>{audience}</li>);
    return (
        <div className={styles.audience} data-purpose="target-audience">
            <h2 className={classNames('ud-heading-xl', styles.audience__title)}>
                {gettext('Who this course is for:')}
            </h2>
            <ul className={styles.audience__list}>{audienceItems}</ul>
        </div>
    );
};

TargetAudiences.propTypes = {
    items: PropTypes.array.isRequired,
};

@isomorphic
@observer
export default class Description extends Component {
    static propTypes = {
        description: PropTypes.string.isRequired,
        target_audiences: PropTypes.array.isRequired,
        isCollapsible: PropTypes.bool,
        className: PropTypes.string,
        titleTypography: PropTypes.oneOf(['ud-heading-lg', 'ud-heading-xl']),
        onAccordionToggle: PropTypes.func,
    };

    static defaultProps = {
        isCollapsible: false,
        className: 'component-margin',
        titleTypography: 'ud-heading-xl',
        onAccordionToggle: undefined,
    };

    get accordionSize() {
        let size;
        switch (this.props.titleTypography) {
            case 'ud-heading-lg':
                size = 'large';
                break;
            case 'ud-heading-xl':
            default:
                size = 'xlarge';
        }
        return size;
    }

    render() {
        const {
            description,
            className,
            isCollapsible,
            titleTypography,
            onAccordionToggle,
        } = this.props;
        const title = gettext('Description');

        if (!isCollapsible) {
            return (
                <div
                    className={classNames(`ud-text-sm ${className}`, styles.description)}
                    data-purpose="course-description"
                >
                    <h2
                        data-purpose="description-title"
                        className={classNames(titleTypography, styles.description__header)}
                    >
                        {title}
                    </h2>
                    <ShowMore
                        ariaLabelExpanded={gettext('Show less description')}
                        ariaLabelCollapsed={gettext('Show more description')}
                        collapsedHeight={221}
                        withGradient={true}
                    >
                        <div
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'description:description',
                                html: description,
                            })}
                        />
                        <TargetAudiences items={this.props.target_audiences} />
                    </ShowMore>
                </div>
            );
        }
        return (
            <Accordion size={this.accordionSize} className={className}>
                <Accordion.Panel title={title} onToggle={onAccordionToggle}>
                    <div
                        className={classNames('ud-text-sm', styles.description)}
                        data-purpose="course-description"
                    >
                        <div
                            {...safelySetInnerHTML({
                                descriptionOfCaller: 'description:description',
                                html: description,
                            })}
                        />
                        <TargetAudiences items={this.props.target_audiences} />
                    </div>
                </Accordion.Panel>
            </Accordion>
        );
    }
}
