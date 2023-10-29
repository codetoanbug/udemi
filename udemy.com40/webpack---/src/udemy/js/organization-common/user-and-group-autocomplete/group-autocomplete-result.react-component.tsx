import {useI18n} from '@udemy/i18n';
import classNames from 'classnames';
import React from 'react';

import UserAndGroupPill, {
    Entity,
} from 'organization-manage-common/user-and-group-pill/user-and-group-pill.react-component';

import styles from './autocomplete-result.less';

export interface GroupAutocompleteResultProps {
    group: Entity;
    onClose?: (obj: Entity) => void;
    isAssigned?: boolean;
    isSuggestionItem?: boolean;
}

const GroupAutocompleteResult = ({
    group,
    onClose,
    isAssigned = false,
    isSuggestionItem = false,
}: GroupAutocompleteResultProps) => {
    const {gettext} = useI18n();
    return (
        <div
            className={classNames(styles.wrapper, {
                [styles['is-suggestion-item']]: isSuggestionItem,
            })}
        >
            <UserAndGroupPill
                key={group.id}
                entity={group}
                isSuggestionItem={isSuggestionItem}
                onClose={onClose}
            />
            {isAssigned && (
                <div className={classNames('ud-text-xs', styles['assigned-text'])}>
                    {gettext('Already assigned')}
                </div>
            )}
        </div>
    );
};

// eslint-disable-next-line import/no-default-export
export default GroupAutocompleteResult;
