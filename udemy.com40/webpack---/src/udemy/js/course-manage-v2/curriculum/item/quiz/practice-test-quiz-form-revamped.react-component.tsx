import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import CurriculumQuizFormModel from './curriculum-quiz-form.mobx-model';
import CurriculumQuizModel from './curriculum-quiz.mobx-model';

import '../item-form.less';

@observer
export class PracticeTestQuizFormRevamped extends Component<{
    curriculumItem: CurriculumQuizModel;
    form: CurriculumQuizFormModel;
    onCancel: VoidFunction;
    onSubmit: (data: CurriculumQuizFormModel) => void;
}> {
    static propTypes = {
        curriculumItem: PropTypes.instanceOf(CurriculumQuizModel),
        form: PropTypes.instanceOf(CurriculumQuizFormModel).isRequired,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        curriculumItem: null,
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        this.props.form.reset({...this.props.curriculumItem, duration: 50, pass_percent: 50});
    }

    @autobind
    onTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.form.setField('title', event.target.value);
    }

    @autobind
    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.onSubmit(this.props.form.data);
    }

    render() {
        const {form, onCancel} = this.props;
        return (
            <form data-purpose="practice-test-form" styleName="item-form" onSubmit={this.onSubmit}>
                <div styleName="flex">
                    <FormGroup
                        label={gettext('Title')}
                        labelProps={{className: 'ud-sr-only'}}
                        data-purpose="practice-test-form-group-title"
                        note={form.error.title ? form.error.title.join(' ') : null}
                        validationState={form.error.title ? 'error' : 'neutral'}
                    >
                        <TextInputWithCounter
                            autoFocus={true}
                            maxLength={100}
                            placeholder={gettext('Enter a Title')}
                            data-purpose="practice-test-title"
                            value={form.data.title}
                            onChange={this.onTitleChange}
                            size="small"
                        />
                    </FormGroup>
                    <div styleName="submit-row">
                        <Button
                            size="small"
                            className="ud-link-neutral"
                            udStyle="ghost"
                            onClick={onCancel}
                            data-purpose="cancel-practice-test-form"
                        >
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            data-purpose="submit-practice-test-form"
                            disabled={form.isSaving}
                        >
                            {gettext('Add Practice Test')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
