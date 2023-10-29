import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useMyLearningStore} from '../../hooks/use-my-learning-store';
import {HeaderDropdown, HeaderButton, HeaderMenu} from '../header-dropdown.react-component';
import {MyLearningItems} from './my-learning-items.react-component';

interface MyLearningDropdownProps {
    className: string;
}

export const MyLearningDropdown = observer(({className = ''}: MyLearningDropdownProps) => {
    const headerStore = useHeaderStore();
    const myLearningStore = useMyLearningStore();
    const {gettext} = useI18n();

    return (
        <HeaderDropdown
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={headerStore.urls.MY_LEARNING}
                    data-testid="my-courses"
                >
                    {gettext('My learning')}
                </HeaderButton>
            }
            className={className}
            onFirstOpen={myLearningStore.loadMyLearningContent}
        >
            <HeaderMenu>
                <MyLearningItems />
            </HeaderMenu>
        </HeaderDropdown>
    );
});
