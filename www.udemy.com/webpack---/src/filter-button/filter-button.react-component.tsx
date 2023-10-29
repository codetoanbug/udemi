import React, {MouseEventHandler} from 'react';

import {useI18n} from '@udemy/i18n';
import FilterIcon from '@udemy/icons/dist/filter.ud-icon';
import {Button} from '@udemy/react-core-components';

import styles from './filter-button.module.less';

export interface FilterButtonProps {
    isSidebarVisible: boolean;
    onClickHandler: MouseEventHandler<HTMLElement>;
}
export const FilterButton = ({isSidebarVisible, onClickHandler}: FilterButtonProps) => {
    const {gettext} = useI18n();
    const showFiltersText = gettext('Show filters');
    const hideFiltersText = gettext('Hide filters');
    return (
        <Button
            data-testid="filter-button"
            udStyle="secondary"
            className={styles['button']}
            onClick={onClickHandler}
        >
            <FilterIcon label={false} />
            {isSidebarVisible ? hideFiltersText : showFiltersText}
        </Button>
    );
};
