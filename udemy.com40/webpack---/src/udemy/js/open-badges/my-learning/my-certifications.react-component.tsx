import {Accordion} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import {CertificationAssertionStore} from '../certification-assertion.mobx-store';
import {CertificationStore} from '../certification.mobx-store';
import {UploadBadgeStore} from '../upload-badge/upload-badge.mobx-store';
import {MyCertificationPreparationPanel} from './my-certification-praperation-panel.react-component';
import assertionStyle from './my-certification-style.less';
import {MyCertificationsAssertionPanel} from './my-certifications-assertion-panel.react-component';

interface MyCertificationsProps {
    assertionStore?: CertificationAssertionStore;
    certificationStore?: CertificationStore;
    badgeUploadStore?: UploadBadgeStore;
}

const MyCertificationsComponent: React.FC<MyCertificationsProps> = (props) => {
    const assertionStore = props.assertionStore;
    const certificationStore = props.certificationStore;
    const badgeUploadStore = props.badgeUploadStore;

    return (
        <Accordion className={assertionStyle.accordion}>
            <Accordion.Panel defaultExpanded={true} title={gettext('My badges')}>
                <MyCertificationsAssertionPanel
                    assertionStore={assertionStore}
                    badgeUploadStore={badgeUploadStore}
                />
            </Accordion.Panel>
            <Accordion.Panel defaultExpanded={true} title={gettext('Certification preparation')}>
                <MyCertificationPreparationPanel certificationStore={certificationStore} />
            </Accordion.Panel>
        </Accordion>
    );
};

export const MyCertifications = observer(MyCertificationsComponent);
