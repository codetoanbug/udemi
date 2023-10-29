import InfoIcon from '@udemy/icons/dist/info.ud-icon';
import LockIcon from '@udemy/icons/dist/lock.ud-icon';
import {FormGroup} from '@udemy/react-form-components';
import {Popover} from '@udemy/react-popup-components';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CourseLabels from 'course-labels/course-labels.react-component';
import PrimaryLabelSelect from 'course-labels/primary-label-select.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './course-basics-form.less';

@observer
export default class LabelManager extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        validationProps: PropTypes.object,
    };

    static defaultProps = {
        validationProps: {},
    };

    renderTooltip(content) {
        return (
            <Popover
                a11yRole="description"
                canToggleOnHover={true}
                placement="right"
                trigger={<InfoIcon label={gettext('Get info')} />}
            >
                <div className="ud-text-sm ud-text-with-links">{content}</div>
            </Popover>
        );
    }

    renderLabel(descriptionOfCaller, html, icon) {
        return (
            <span styleName={classNames({'label-with-icon': !!icon})}>
                <span {...safelySetInnerHTML({descriptionOfCaller, html})} />
                {icon && <span styleName="icon-container">{icon}</span>}
            </span>
        );
    }

    render() {
        const visibleCourseHasLabels = this.props.store.courseHasLabelsStore.visibleCourseHasLabels;
        const primaryCourseHasLabels = this.props.store.courseHasLabelsStore.primaryCourseHasLabels;
        let labelsTooltipIcon,
            lockIcon,
            primaryLabelSelect,
            primaryLabelSelects,
            primaryLabelSelectHeader,
            primaryLabelTooltipIcon;
        if (this.props.store.locked) {
            lockIcon = <LockIcon label={false} />;
        }
        if (visibleCourseHasLabels.length > 1) {
            if (!this.props.store.locked) {
                primaryLabelTooltipIcon = this.renderTooltip(
                    <>
                        {gettext(
                            'Which topic do you spend the most time covering in your course? If you believe two topics are equally ' +
                                'representative of your entire course, select either one. All of the topics listed will still count as being taught in ' +
                                'your course.',
                        )}{' '}
                        <a
                            href="https://support.udemy.com/hc/en-us/articles/115000371028"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {gettext('Learn more.')}
                        </a>
                    </>,
                );
            }
            primaryLabelSelectHeader = this.renderLabel(
                'label-manager:most-representative-topic',
                gettext(
                    'From the topics you have selected, which is the <strong>most representative</strong> topic?',
                ),
                lockIcon || primaryLabelTooltipIcon,
            );
            if (primaryCourseHasLabels.length > 1) {
                primaryLabelSelects = [];
                primaryCourseHasLabels.forEach((primaryLabel, key) => {
                    primaryLabelSelects.push(
                        <PrimaryLabelSelect
                            key={key}
                            primaryLabel={primaryLabel}
                            labels={[primaryLabel]}
                            locked={true}
                        />,
                    );
                });
            } else {
                primaryLabelSelects = (
                    <PrimaryLabelSelect
                        primaryLabel={
                            visibleCourseHasLabels.length > 1
                                ? primaryCourseHasLabels[0] || null
                                : visibleCourseHasLabels[0]
                        }
                        labels={visibleCourseHasLabels.slice()}
                        onPrimaryLabelChange={this.props.store.setPrimary}
                        locked={this.props.store.locked || visibleCourseHasLabels.length === 1}
                    />
                );
            }
            primaryLabelSelect = (
                <FormGroup
                    udStyle="fieldset"
                    styleName="primary-label-select"
                    label={primaryLabelSelectHeader}
                    labelProps={{typography: 'ud-heading-md'}}
                >
                    {primaryLabelSelects}
                </FormGroup>
            );
        }
        if (!this.props.store.locked) {
            labelsTooltipIcon = this.renderTooltip(
                <>
                    {gettext(
                        "Each individual topic chosen should comprehensively describe your course's content without being too broad. E.g. " +
                            '"The Complete Tennis Course" should have "Tennis" – not "Tennis Serve" (specific, but not comprehensive) and not "Sports" ' +
                            '(comprehensive, but not specific).',
                    )}{' '}
                    <a
                        href="https://support.udemy.com/hc/en-us/articles/115000371028"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {gettext('Learn more.')}
                    </a>
                </>,
            );
        }
        return (
            <FormGroup
                udStyle="fieldset"
                label={this.renderLabel(
                    'label-manager:what-is-taught',
                    gettext('What is <strong>primarily</strong> taught in your course?'),
                    lockIcon || labelsTooltipIcon,
                )}
                labelProps={{typography: 'ud-heading-md'}}
                {...this.props.validationProps}
            >
                <div styleName="inline-fields">
                    <CourseLabels
                        courseHasLabelsStore={this.props.store.courseHasLabelsStore}
                        locked={this.props.store.locked}
                    />
                    <div styleName="spacer" />
                </div>
                {primaryLabelSelect}
            </FormGroup>
        );
    }
}
