import {Button} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {htmlToText} from 'base-components/ungraduated/form/rich-text-editor/helpers';
import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import {noop} from 'utils/noop';

import requires from '../../registry/requires';
import Bookmark from './bookmark.mobx-model';
import {MAX_BODY_LENGTH_V2, MAX_BODY_LENGTH_V2_BE} from './constants';

import './lecture-bookmark-form.less';

@requires('courseTakingStore', 'bookmarksStore')
@observer
export default class LectureBookmarkForm extends Component {
    static propTypes = {
        bookmark: PropTypes.instanceOf(Bookmark).isRequired,
        courseTakingStore: PropTypes.shape({
            currentCurriculumItemId: PropTypes.number.isRequired,
            track: PropTypes.func.isRequired,
        }).isRequired,
        bookmarksStore: PropTypes.shape({
            delete: PropTypes.func.isRequired,
            update: PropTypes.func.isRequired,
        }).isRequired,
        onCancelClick: PropTypes.func.isRequired,
        onSaveClick: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func,
        autoFocus: PropTypes.bool,
        setFocusRef: PropTypes.func,
        onBlur: PropTypes.func,
    };

    static defaultProps = {
        onKeyDown: noop,
        autoFocus: false,
        setFocusRef: noop,
        onBlur: noop,
    };

    @observable emptyNote = false;
    @observable isSavingBookmark = false;
    @observable hasSaveError = false;

    @autobind
    @action
    _setHasSaveError(hasError) {
        this.hasSaveError = hasError;
    }

    @autobind
    @action
    _setSavingBookmark(isSavingBookmark) {
        this.isSavingBookmark = isSavingBookmark;
    }

    @autobind
    @action
    onSaveBookmark(event) {
        event.preventDefault();
        this.isSavingBookmark = true;
        if (!this.props.bookmark.hasBodyText) {
            this.emptyNote = true;
            this.isSavingBookmark = false;
            this.hasSaveError = false;
            return;
        }
        const promise = this.props.onSaveClick(this.props.bookmark);
        if (promise) {
            promise
                .then(() => this._setHasSaveError(false))
                .catch(() => this._setHasSaveError(true))
                .finally(() => this._setSavingBookmark(false));
        } else {
            this.hasSaveError = false;
            this.isSavingBookmark = false;
        }
    }

    @autobind
    @action
    onCancelEditing() {
        this.emptyNote = false;
        this.props.bookmark.reset();
        this.props.onCancelClick();
    }

    @autobind
    @action
    onValueChange(value) {
        this.props.bookmark.changeBody(value);
        if (this.props.bookmark.hasBodyText) {
            this.emptyNote = false;
        }
    }

    renderError(message) {
        return (
            <AlertBanner
                styleName="alert-banner"
                udStyle="warning"
                title={message}
                showCta={false}
            />
        );
    }

    render() {
        // The bookmark body contains html formatting tags hidden to the user, so the length of the bookmark body is
        // more than the number of character the user enters. This might cause the bookmark body length to be longer
        // than what the backend enforces. We inform the user of such case via a new alert banner. (TE-2666) (TE-2563)
        const htmlBodyLength = this.props.bookmark.body.length;
        const bodyHtmlToTextCount = htmlToText(this.props.bookmark.body).length;
        return (
            <form onSubmit={this.onSaveBookmark} data-purpose="save-bookmark">
                <RichTextEditor
                    value={this.props.bookmark.body}
                    onValueChange={this.onValueChange}
                    theme={RichTextEditor.THEMES.BOOKMARK}
                    onBlur={this.props.onBlur}
                    onKeyDown={this.props.onKeyDown}
                    autoFocus={this.props.autoFocus}
                    onInit={this.props.setFocusRef}
                    withCounter={true}
                    maxLength={MAX_BODY_LENGTH_V2}
                />
                <FooterButtons>
                    <Button
                        disabled={this.isSavingBookmark}
                        size="small"
                        className="ud-link-neutral"
                        udStyle="ghost"
                        onClick={this.onCancelEditing}
                        data-purpose="cancel-editing-bookmark"
                    >
                        {gettext('Cancel')}
                    </Button>
                    <Button
                        size="small"
                        type="submit"
                        disabled={
                            this.isSavingBookmark ||
                            bodyHtmlToTextCount > MAX_BODY_LENGTH_V2 ||
                            htmlBodyLength > MAX_BODY_LENGTH_V2_BE
                        }
                        data-purpose="save-bookmark-button"
                    >
                        {gettext('Save note')}
                    </Button>
                </FooterButtons>
                {this.emptyNote && this.renderError(gettext("You can't save an empty note"))}
                {bodyHtmlToTextCount > MAX_BODY_LENGTH_V2 &&
                    this.renderError(
                        ninterpolate(
                            "You can't save a note longer than %(count)s character",
                            "You can't save a note longer than %(count)s characters",
                            MAX_BODY_LENGTH_V2,
                            {count: MAX_BODY_LENGTH_V2},
                        ),
                    )}
                {bodyHtmlToTextCount <= MAX_BODY_LENGTH_V2 &&
                    htmlBodyLength > MAX_BODY_LENGTH_V2_BE &&
                    this.renderError(
                        ninterpolate(
                            "The note contains hidden formatting characters that make it longer than %(count)s character. You can't save a note longer than %(count)s character",
                            "The note contains hidden formatting characters that make it longer than %(count)s characters. You can't save a note longer than %(count)s characters",
                            MAX_BODY_LENGTH_V2,
                            {count: MAX_BODY_LENGTH_V2},
                        ),
                    )}
                {this.hasSaveError && this.renderError(gettext('Failed to save the note'))}
            </form>
        );
    }
}
