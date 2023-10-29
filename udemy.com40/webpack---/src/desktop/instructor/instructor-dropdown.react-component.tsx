import {observer} from 'mobx-react';
import React from 'react';

import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';

import {useHeaderStore} from '../../hooks/use-header-store';
import {useUfbContext} from '../../hooks/use-ufb-context';
import {HeaderDropdown, HeaderButton, HeaderMenu} from '../header-dropdown.react-component';
import styles from '../panel-menu.module.less';

interface InstructorDropdownProps {
    className: string;
}
export const InstructorDropdown = observer(({className}: InstructorDropdownProps) => {
    const headerStore = useHeaderStore();
    const ufbContext = useUfbContext();
    const {gettext} = useI18n();

    function renderForInstructor() {
        return (
            <div className={className} data-purpose="instructor-dropdown">
                <HeaderButton
                    componentClass="a"
                    href={headerStore.urls.TEACH}
                    data-testid="instructor-link"
                >
                    {ufbContext?.instructorDropdownText ?? gettext('Instructor')}
                </HeaderButton>
            </div>
        );
    }

    function renderForProspectiveInstructor() {
        return (
            <HeaderDropdown
                className={className}
                a11yRole="description"
                trigger={
                    <HeaderButton
                        componentClass="a"
                        href={headerStore.urls.TEACH}
                        data-purpose="instructor-dropdown"
                        data-testid="teach-on-udemy-link"
                    >
                        {ufbContext?.prospectiveInstructorDropdownText ?? gettext('Teach on Udemy')}
                    </HeaderButton>
                }
            >
                <HeaderMenu>
                    <div className={styles.panel}>
                        <div className={`ud-heading-lg ${styles['gap-bottom']}`}>
                            {ufbContext?.prospectiveInstructorHeadline ??
                                gettext(
                                    'Turn what you know into an opportunity and reach millions around the world.',
                                )}
                        </div>
                        <Button
                            componentClass="a"
                            href={headerStore.urls.TEACH}
                            className={styles.cta}
                            data-testid="learn-more-link"
                        >
                            {ufbContext?.prospectiveInstructorCTAText ?? gettext('Learn more')}
                        </Button>
                    </div>
                </HeaderMenu>
            </HeaderDropdown>
        );
    }

    const {isInstructor} = headerStore.userSpecificContext;
    return isInstructor ? renderForInstructor() : renderForProspectiveInstructor();
});
