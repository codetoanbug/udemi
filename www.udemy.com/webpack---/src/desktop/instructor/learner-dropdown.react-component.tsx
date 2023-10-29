import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {useUDData} from '@udemy/ud-data';

import {useHeaderStore} from '../../hooks/use-header-store';
import {HeaderDropdown, HeaderButton, HeaderMenu} from '../header-dropdown.react-component';
import styles from '../panel-menu.module.less';

interface LearnerDropdownProps {
    className: string;
}

export const LearnerDropdown = observer(({className}: LearnerDropdownProps) => {
    const headerStore = useHeaderStore();
    const {Config} = useUDData();
    const {gettext} = useI18n();
    let buttonText, panelText;

    if (Config.brand.has_organization) {
        buttonText = gettext('Learner');
        panelText = gettext(
            'Switch to the learn view here - get back to the courses you’re taking.',
        );
    } else {
        buttonText = gettext('Student');
        panelText = gettext(
            'Switch to the student view here - get back to the courses you’re taking.',
        );
    }
    return (
        <HeaderDropdown
            className={className}
            a11yRole="description"
            trigger={
                <HeaderButton
                    componentClass="a"
                    href={headerStore.instructorURLs.BROWSE}
                    data-testid="instructor-dropdown"
                >
                    {buttonText}
                </HeaderButton>
            }
        >
            <HeaderMenu>
                <div className={styles.panel} data-testid="switch-view-panel">
                    {panelText}
                </div>
            </HeaderMenu>
        </HeaderDropdown>
    );
});
