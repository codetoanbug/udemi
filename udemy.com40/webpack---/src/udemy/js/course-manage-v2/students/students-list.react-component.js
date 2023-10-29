import SearchIcon from '@udemy/icons/dist/search.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {ConfirmModal, ModalTrigger} from '@udemy/react-dialog-components';
import {FormGroup, TextInputForm} from '@udemy/react-form-components';
import {Badge, AlertBanner} from '@udemy/react-messaging-components';
import {Pagination} from '@udemy/react-navigation-components';
import {Tooltip} from '@udemy/react-popup-components';
import {Table} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';
import userSettings, {SETTINGS} from 'utils/user-settings';

import renderDate from './render-date';
import StudentsListStore, {SEARCH_QUERY_MIN_LENGTH} from './students-list.mobx-store';

import './students-list.less';

const sortablePageCountLimit = 1000;
export const CSVModal = (props) => (
    <ConfirmModal
        {...props}
        title={gettext('Export students list to CSV')}
        confirmText={gettext('Export')}
    >
        <p>
            {gettext(
                'A list of all students enrolled in this course will be generated in CSV ' +
                    'format and emailed to you. This may take a few minutes if your course has a lot ' +
                    'of students. Continue?',
            )}
        </p>
    </ConfirmModal>
);

const SearchButton = ({children, ...htmlProps}) => (
    <IconButton {...htmlProps} type={htmlProps['aria-disabled'] ? 'button' : 'submit'}>
        <SearchIcon label={gettext('Submit search')} />
    </IconButton>
);

const SearchTooltip = ({children, ...htmlProps}) => (
    <Tooltip placement="bottom-end" trigger={<SearchButton {...htmlProps} />}>
        {interpolate(
            gettext('Please enter at least %(min)s characters'),
            {min: SEARCH_QUERY_MIN_LENGTH},
            true,
        )}
    </Tooltip>
);

@observer
export default class StudentsList extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new StudentsListStore(props.courseId);
    }

    componentDidMount() {
        this.store.fetchStudentsList();
    }

    @autobind
    onSearchChange(event) {
        this.store.setSearchInputValue(event.target.value);
    }

    @autobind
    onSearchSubmit() {
        this.store.fetchStudentsListBySearch();
    }

    renderNameCell(student) {
        return (
            <div>
                <a
                    href={student.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    styleName="student-name"
                >
                    {student.display_name}
                </a>
                {student.is_organization_enrollment && (
                    <Badge styleName="ub-badge">{'Udemy Business'}</Badge>
                )}
            </div>
        );
    }

    renderJoinDateCell(student) {
        return renderDate(student.enrollment_date);
    }

    renderLastAccessedCell(student) {
        return student.last_accessed ? renderDate(student.last_accessed) : gettext('Never');
    }

    renderCompletionRateCell(student) {
        return interpolate(gettext('%(percent)s%'), {percent: student.completion_ratio}, true);
    }

    renderMessageCell(student) {
        return (
            <Button
                componentClass="a"
                href={`/instructor/communication/messages/compose/user/${student.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                udStyle="secondary"
            >
                {gettext('Message')}
            </Button>
        );
    }

    getColumns(pageCount) {
        const nameColumn = {
            fieldName: 'title',
            headerName: gettext('Name'),
            initialSortOrder: pageCount > sortablePageCountLimit ? null : 'ascending',
            renderMethod: this.renderNameCell,
            wrap: true,
        };
        const enrollmentDateColumn = {
            fieldName: 'enrollment_date',
            headerName: gettext('Enrolled'),
            initialSortOrder: 'descending',
            renderMethod: this.renderJoinDateCell,
            wrap: true,
        };
        const lastVisitedColumn = {
            fieldName: 'last_accessed',
            headerName: gettext('Last Visited'),
            initialSortOrder: pageCount > sortablePageCountLimit ? null : 'descending',
            renderMethod: this.renderLastAccessedCell,
            wrap: true,
        };
        const completionRatioColumn = {
            fieldName: 'completion_ratio',
            headerName: gettext('Progress'),
            renderMethod: this.renderCompletionRateCell,
            wrap: true,
        };
        const askedQuestionCountColumn = {
            fieldName: 'question_count',
            headerName: gettext('Questions Asked'),
            wrap: true,
        };
        const answeredQuestionCountColumn = {
            fieldName: 'question_answer_count',
            headerName: gettext('Questions Answered'),
            wrap: true,
        };

        const columns = [
            nameColumn,
            enrollmentDateColumn,
            lastVisitedColumn,
            completionRatioColumn,
            askedQuestionCountColumn,
            answeredQuestionCountColumn,
        ];

        const renderSendMessageColumn = userSettings.get(SETTINGS.directMessagingEnabled);

        if (renderSendMessageColumn) {
            const sendMessageColumn = {
                fieldName: 'send_message',
                headerName: gettext('Send message'),
                isScreenReaderOnly: true,
                renderMethod: this.renderMessageCell,
            };

            columns.push(sendMessageColumn);
        }
        return columns;
    }

    render() {
        const {
            sendCSV,
            error,
            setSorting,
            sortBy,
            studentsList,
            pageCount,
            activePage,
            setActivePage,
            isLoading,
            isFirstLoadingComplete,
            isCJKLanguage,
            isSearchQueryValid,
        } = this.store;

        if (!isFirstLoadingComplete) {
            return <Loader />;
        }

        return (
            <>
                <div styleName="button-bar">
                    <ModalTrigger
                        trigger={<Button udStyle="secondary">{gettext('Export to CSV')}</Button>}
                        renderModal={(props) => (
                            <CSVModal
                                {...props}
                                onCancel={props.onClose}
                                onConfirm={() => sendCSV(props.onClose)}
                            />
                        )}
                    />
                    <FormGroup
                        styleName="search-field"
                        label={gettext('Student name')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextInputForm
                            placeholder={gettext('Search by name')}
                            value={this.store.searchInputValue}
                            onChange={this.onSearchChange}
                            onSubmit={this.onSearchSubmit}
                            showClearInputButton={!!this.store.searchInputValue}
                            onClearInput={this.store.clearSearchInputValue}
                            submitButtonProps={{
                                componentClass: isCJKLanguage ? SearchButton : SearchTooltip,
                                'aria-disabled': !isSearchQueryValid,
                            }}
                        />
                    </FormGroup>
                </div>
                {isLoading && <Loader />}
                {!isLoading && error && (
                    <AlertBanner
                        showCta={false}
                        udStyle="error"
                        title={error.title}
                        body={error.content}
                    />
                )}
                {!isLoading && !error && studentsList.length === 0 && (
                    <div styleName="no-students">{gettext('No students found')}</div>
                )}
                {!isLoading && !error && studentsList.length > 0 && (
                    <div styleName="table-container">
                        <Table
                            padding="xs"
                            noBackgroundColor={true}
                            noBorder={true}
                            caption={gettext('Students')}
                            columns={this.getColumns(pageCount)}
                            onSort={setSorting}
                            sortBy={sortBy}
                            rows={studentsList.slice()}
                        />
                        <Pagination
                            pageCount={pageCount}
                            activePage={activePage}
                            onPageChange={setActivePage}
                            styleName="pagination"
                        />
                    </div>
                )}
            </>
        );
    }
}
