import {Button} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {TextInputWithCounter, TextAreaWithCounter, FormGroup} from '@udemy/react-form-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {
    MAX_TITLE_CHARACTER_LIMIT,
    MIN_TITLE_CHARACTER_LIMIT,
} from 'browse/components/save-to-list/constants';
import {noop} from 'utils/noop';

import CollectionModalStore from './collection-modal.mobx-store';
import './collection-modal.less';

const DESCRIPTION_CHARACTER_LIMIT = 200;

@observer
export default class CollectionModal extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onUpdateSuccess: PropTypes.func,
        onCreateSuccess: PropTypes.func,
        collection: PropTypes.object,
        uiRegion: PropTypes.string.isRequired,
    };

    static defaultProps = {
        onCreateSuccess: noop,
        onUpdateSuccess: noop,
        collection: undefined,
    };

    constructor(props) {
        super(props);
        this.store = new CollectionModalStore(this.props.uiRegion);
    }

    @autobind
    onOpen() {
        this.store.reset(this.props.collection);
    }

    @autobind
    setTitleValue(e) {
        this.store.setTitle(e.target.value);
    }

    @autobind
    setDescriptionValue(e) {
        this.store.setDescription(e.target.value);
    }

    @autobind
    saveCollection(e) {
        e.preventDefault();
        if (this.store.id) {
            this.store.updateCollection().then(() => {
                this.props.onClose();
                this.props.onUpdateSuccess();
            });
        } else {
            this.store.createCollection().then((collection) => {
                this.props.onClose();
                this.props.onCreateSuccess(collection);
            });
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                onOpen={this.onOpen}
                title={this.store.id ? gettext('Edit your list') : gettext('Create new list')}
            >
                <form onSubmit={this.saveCollection} styleName="form">
                    <FormGroup label={gettext('Title')} labelProps={{className: 'ud-sr-only'}}>
                        <TextInputWithCounter
                            maxLength={MAX_TITLE_CHARACTER_LIMIT}
                            placeholder={gettext('Name your list e.g. HTML skills')}
                            value={this.store.title}
                            onChange={this.setTitleValue}
                        />
                    </FormGroup>
                    <FormGroup
                        label={gettext('Description')}
                        labelProps={{className: 'ud-sr-only'}}
                    >
                        <TextAreaWithCounter
                            maxLength={DESCRIPTION_CHARACTER_LIMIT}
                            placeholder={gettext(
                                'Why are you creating this list? e.g. To start a new business, To get a new job, To become a web developer',
                            )}
                            value={this.store.description}
                            onChange={this.setDescriptionValue}
                        />
                    </FormGroup>
                    <FooterButtons>
                        <Button onClick={this.props.onClose} udStyle="ghost">
                            {gettext('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                this.store.title.length < MIN_TITLE_CHARACTER_LIMIT ||
                                this.store.isLoading
                            }
                        >
                            {this.store.id ? gettext('Edit') : gettext('Create')}
                        </Button>
                    </FooterButtons>
                </form>
            </Modal>
        );
    }
}
