import {withI18n} from '@udemy/i18n';
import {Autosuggest} from '@udemy/react-autosuggest-components';
import {FormGroup} from '@udemy/react-form-components';
import {withUDData} from '@udemy/ud-data';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {AddMembersModalStore} from 'learning-community/components/add-members-modal/learning-community-add-members-modal.mobx-store';
import AssignResourceStore from 'organization-common/assign-resource/assign-resource.mobx-store';
import UserAutocompleteResult from 'organization-common/assign-resource/user-autocomplete-result.react-component';
import {ORGANIZATION_GROUP_CLASS} from 'organization-common/constants';
import UserAndGroupPill from 'organization-manage-common/user-and-group-pill/user-and-group-pill.react-component';

import {EmailAssigneesStore} from '../assign-resource/email-assignees.mobx-store';
import RecommendResourceModalStore from '../recommend-resource/recommend-resource-modal.mobx-store';
import styles from './autocomplete-result.less';
import {AUTOSUGGEST_LABEL, AUTOSUGGEST_LABEL_NON_ADMIN, RECOMMEND_MODAL} from './constants';
import GroupAutocompleteResult from './group-autocomplete-result.react-component';

@inject('store')
@observer
class InternalUserAndGroupAutocomplete extends Component {
    static propTypes = {
        store: PropTypes.oneOfType([
            PropTypes.instanceOf(RecommendResourceModalStore),
            PropTypes.instanceOf(AssignResourceStore),
            PropTypes.instanceOf(EmailAssigneesStore),
            PropTypes.instanceOf(AddMembersModalStore),
        ]).isRequired,
        context: PropTypes.string,
        gettext: PropTypes.func.isRequired,
        udData: PropTypes.object.isRequired,
    };

    static defaultProps = {
        context: RECOMMEND_MODAL,
    };

    constructor(props) {
        super(props);
        this.displayEmails = this.props.store.displayEmails;
    }

    componentDidUpdate() {
        if (this.addedUsersAndGroupsRefs[this.props.store.selectedUsersAndGroups.at(-1)?.id]) {
            this.addedUsersAndGroupsRefs[
                this.props.store.selectedUsersAndGroups.at(-1).id
            ].current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }

    addedUsersAndGroupsRefs = {};

    onSuggestionSelected = (suggestion) => {
        this.props.store.selectObj(suggestion);
        this.props.store.clearSearch();
    };

    onUserOrGroupRemoveRequested = (user) => {
        this.props.store.removeObj(user);
    };

    onAllUsersRemovedRequested = () => {
        this.props.store.clearOnAllUsersRemoved();
    };

    renderUserOrGroupSuggestions = (renderSuggestion, obj, index) => {
        // obj: can be user or group
        if (obj._class === ORGANIZATION_GROUP_CLASS) {
            return renderSuggestion(
                index,
                <GroupAutocompleteResult
                    group={obj}
                    isAssigned={obj.is_assigned_to_resource}
                    isSuggestionItem={true}
                />,
                {
                    disabled: obj.num_users === 0 || obj.is_assigned_to_resource,
                },
            );
        }
        return renderSuggestion(
            index,
            <UserAutocompleteResult
                user={obj}
                isAssigned={obj.is_assigned_to_resource}
                displayEmails={this.displayEmails}
            />,
            {disabled: obj.is_assigned_to_resource},
        );
    };

    /*
        Displays 'All users' for Admin & as soon as the users clicks on the input
        If 'All users' is selected, the input is disabled
        If a user or group is selected, 'All users' option is not displayed in the suggestions
    */
    renderSuggestions = (suggestions, renderSuggestion) => {
        const {gettext} = this.props;
        return (
            <ul className="ud-unstyled-list">
                {suggestions.map((obj, index) => {
                    if (obj.isAllUsersSuggestion) {
                        return (
                            <li key={index} className={styles['user-and-group-suggestion']}>
                                {renderSuggestion(
                                    index,
                                    <GroupAutocompleteResult
                                        group={{
                                            id: index,
                                            _class: ORGANIZATION_GROUP_CLASS,
                                            num_users: this.props.store.totalNumberOfLicensedUsers,
                                            title: gettext('All Users'),
                                        }}
                                        isAssigned={this.props.store.isAllUsersAutoAssignRuleActive}
                                        isSuggestionItem={true}
                                    />,
                                    {disabled: this.props.store.isAllUsersAutoAssignRuleActive},
                                )}
                            </li>
                        );
                    }
                    return (
                        <li key={index} className={styles['user-and-group-suggestion']}>
                            {this.renderUserOrGroupSuggestions(renderSuggestion, obj, index)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    renderSelectedUserAndGroups = () => {
        const {gettext} = this.props;
        const [selectedUsers, selectedGroups] = [
            this.props.store.selectedUsers,
            this.props.store.selectedGroups,
        ];
        return (
            <>
                {selectedUsers?.length > 0 && selectedGroups?.length > 0 && (
                    <label className="ud-text-sm">{gettext('Users')}</label>
                )}
                {selectedUsers?.length > 0 && (
                    <div className={styles['autocompletion-wrapper']}>
                        {selectedUsers.map((user) => {
                            this.addedUsersAndGroupsRefs[user.id] = React.createRef();
                            return (
                                <UserAndGroupPill
                                    ref={this.addedUsersAndGroupsRefs[user.id]}
                                    key={user.id}
                                    entity={user}
                                    onClose={this.onUserOrGroupRemoveRequested}
                                />
                            );
                        })}
                    </div>
                )}
                {selectedUsers?.length > 0 && selectedGroups?.length > 0 && (
                    <label className="ud-text-sm">{gettext('Groups')}</label>
                )}
                {selectedGroups?.length > 0 && (
                    <div className={styles['autocompletion-wrapper']}>
                        {selectedGroups.map((group) => {
                            this.addedUsersAndGroupsRefs[group.id] = React.createRef();
                            return (
                                <UserAndGroupPill
                                    ref={this.addedUsersAndGroupsRefs[group.id]}
                                    key={group.id}
                                    entity={group}
                                    onClose={this.onUserOrGroupRemoveRequested}
                                />
                            );
                        })}
                    </div>
                )}
            </>
        );
    };

    render() {
        const {gettext, udData} = this.props;
        const {isAllUsersSelected} = this.props.store;
        const isStudent = udData.me.organization.isStudent;

        return (
            <>
                <FormGroup
                    label={isStudent ? AUTOSUGGEST_LABEL_NON_ADMIN.label : AUTOSUGGEST_LABEL.label}
                    udStyle="default"
                >
                    <div className={styles['user-and-group-container']}>
                        {isAllUsersSelected && (
                            <div className={styles['user-and-group-autocompletion-wrapper']}>
                                <div className={styles['autocompletion-wrapper']}>
                                    <UserAndGroupPill
                                        entity={{
                                            _class: ORGANIZATION_GROUP_CLASS,
                                            num_users: `${this.props.store.totalNumberOfLicensedUsers}`,
                                            title: gettext('All Users'),
                                        }}
                                        onClose={this.onAllUsersRemovedRequested}
                                    />
                                </div>
                            </div>
                        )}
                        {this.props.store.selectedUsersAndGroups.length > 0 && (
                            <div className={styles['user-and-group-autocompletion-wrapper']}>
                                {this.renderSelectedUserAndGroups()}
                            </div>
                        )}
                        <Autosuggest
                            placeholder={
                                isStudent
                                    ? AUTOSUGGEST_LABEL_NON_ADMIN.placeholder
                                    : AUTOSUGGEST_LABEL.placeholder
                            }
                            autosuggestStore={this.props.store}
                            renderSuggestions={this.renderSuggestions}
                            onSuggestionSelected={this.onSuggestionSelected}
                            disabled={isAllUsersSelected}
                            data-purpose="user-group-autocomplete-input"
                        />
                    </div>
                </FormGroup>
            </>
        );
    }
}

const UserAndGroupAutocomplete = withUDData(withI18n(InternalUserAndGroupAutocomplete));
export default UserAndGroupAutocomplete;
