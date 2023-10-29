import {Button} from '@udemy/react-core-components';
import {FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {LabelAutosuggestion} from 'course-labels/label-autosuggestion.react-component';
import {showErrorToast} from 'instructor/toasts';
import udMe from 'utils/ud-me';

import CourseHasLabelsStore from './course-has-labels.mobx-store';
import CourseLabel from './course-label.react-component';
import CourseLabelsStore, {PROPOSE_LABEL} from './course-labels.mobx-store';

import './course-labels.less';

@observer
export default class CourseLabels extends Component {
    static propTypes = {
        courseHasLabelsStore: PropTypes.instanceOf(CourseHasLabelsStore).isRequired,
        strikeThrough: PropTypes.bool,
        renderLabels: PropTypes.func,
        canPropose: PropTypes.bool,
        locked: PropTypes.bool,
    };

    static defaultProps = {
        strikeThrough: false,
        renderLabels: undefined,
        canPropose: true,
        locked: false,
    };

    constructor(props) {
        super(props);
        this.canPropose = this.props.canPropose && udMe.locale === 'en_US';
        this.courseLabelsStore = new CourseLabelsStore(this.canPropose);
    }

    @autobind
    onSuggestionSelected(suggestion) {
        if (suggestion === PROPOSE_LABEL) {
            return this.addProposedLabel();
        }

        this.courseLabelsStore.reset();
        this.props.courseHasLabelsStore.addLabel(suggestion).catch(() => {
            showErrorToast(
                interpolate(
                    gettext(
                        'Something went wrong adding the topic "%(topic)s" to this course.  Please refresh and try again.',
                    ),
                    {topic: suggestion.title},
                    true,
                ),
            );
        });
    }

    @autobind
    addProposedLabel() {
        if (!this.canPropose) {
            return;
        }

        const topic = this.courseLabelsStore.inputValue;
        this.courseLabelsStore
            .create(topic)
            .then((response) => {
                this.props.courseHasLabelsStore.addLabel(response.data);
                this.courseLabelsStore.reset();
            })
            .catch(() => {
                this.courseLabelsStore.reset();
                showErrorToast(
                    interpolate(
                        gettext(
                            'Something went wrong proposing the topic "%(topic)s".  Please try again.',
                        ),
                        {topic},
                        true,
                    ),
                );
            });
    }

    renderLabels(courseHasLabels) {
        if (this.props.renderLabels) {
            return this.props.renderLabels();
        }

        const labels = [];
        courseHasLabels.forEach((chl) => {
            if (!chl.is_deleted || this.props.strikeThrough) {
                labels.push(
                    <CourseLabel
                        key={chl.label.id}
                        label={chl.label}
                        strikeThrough={chl.is_deleted}
                        locked={this.props.locked}
                        onAdd={chl.create}
                        showAdd={this.props.courseHasLabelsStore.canAddLabel}
                        onDelete={chl.delete}
                    />,
                );
            }
        });
        return !labels.length ? null : <span styleName="course-labels">{labels}</span>;
    }

    renderAutosuggestComponent() {
        return (
            <LabelAutosuggestion
                autosuggestPlaceholder={gettext('e.g. Landscape Photography')}
                onSuggestionSelected={this.onSuggestionSelected}
                courseLabelsStore={this.courseLabelsStore}
                autofocus={this.props.courseHasLabelsStore.visibleCourseHasLabels.length > 0}
                addProposedLabel={this.addProposedLabel}
            />
        );
    }

    get searchBoxVisible() {
        return (
            (this.courseLabelsStore.addNewLabel && this.props.courseHasLabelsStore.canAddLabel) ||
            !this.props.courseHasLabelsStore.visibleCourseHasLabels.length
        );
    }

    render() {
        let autosuggest, note;
        if (this.searchBoxVisible) {
            autosuggest = this.renderAutosuggestComponent();
        } else if (!this.props.locked && this.props.courseHasLabelsStore.canAddLabel) {
            note = (
                <Button
                    udStyle="link"
                    data-purpose="display-autosuggest-box"
                    onClick={this.courseLabelsStore.handleNewLabelClick}
                    className="ud-link-neutral ud-link-underline"
                    typography="ud-text-xs"
                >
                    {gettext('Propose another topic...')}
                </Button>
            );
        } else if (!this.props.locked) {
            note = gettext(
                'A maximum of 4 topics are allowed. To replace a topic, first remove one.',
            );
        }
        return (
            <FormGroup label={gettext('Topic')} labelProps={{className: 'ud-sr-only'}} note={note}>
                {this.renderLabels(this.props.courseHasLabelsStore.courseHasLabels)}
                {autosuggest}
            </FormGroup>
        );
    }
}
