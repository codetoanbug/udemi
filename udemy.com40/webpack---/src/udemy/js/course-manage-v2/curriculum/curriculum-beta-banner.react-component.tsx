import {useI18n} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import React from 'react';

import {useSystemMessageWithOpenFlag} from 'instructor/hooks/use-system-message';

import styles from './curriculum-editor.less';

export const CurriculumBetaBanner: React.FC = () => {
    const i18n = useI18n();
    const [isOpen, onClose] = useSystemMessageWithOpenFlag('ceBetaBannerOnCurriculumSeen');

    if (!isOpen) return <></>;
    return (
        <div className={styles['beta-badge']}>
            <div>
                <Badge className={styles.yellow}>{i18n.gettext('Beta')}</Badge>
            </div>
            <div className={styles.content}>
                <div className="ud-heading-md">
                    {i18n.gettext(
                        'Enhance your course by adding coding exercises with our new features.',
                    )}
                </div>
            </div>
            <div></div>
            <div className={styles['button-wrapper']}>
                <Button
                    componentClass="a"
                    href="/udemy-teach-hub/whats_new_with_coding_exercises/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {i18n.gettext('Learn more')}
                </Button>
                <Button udStyle="ghost" className="ud-link-neutral" onClick={onClose}>
                    {i18n.gettext('Dismiss')}
                </Button>
            </div>
        </div>
    );
};
